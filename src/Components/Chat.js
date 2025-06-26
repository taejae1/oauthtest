import {
  Button,
  Divider,
  Input,
  Spin,
  message,
  Popconfirm,
  Popover,
  FloatButton,
  Modal,
  Table,
  Select,
} from "antd";
import styled from "styled-components";
import {
  CommentOutlined,
  QuestionCircleOutlined,
  SendOutlined,
  LikeFilled,
  LikeOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import supabase from "../supabase";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
import GPTMsg from "./GPTMsg";
import Prompt from "./Prompt";

const { TextArea } = Input;

const Chat = ({ roomId, action, setIsNewChat, setSelRoomId }) => {
  // console.log("Chat : ", roomId);
  const messageEndRef = useRef();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [state, setState] = useState(1);
  const [roomInfo, setRoomInfo] = useState({});

  const [isModal, setIsModal] = useState(false);

  const [planJson, setPlanJson] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  const [listLoading, setListLoading] = useState(true);

  const [list, setList] = useState([]);

  const [selectFaculty, setSelectFaculty] = useState("");

  useEffect(() => {
    getRoomInfo();
    if (action) {
      getChats();
    }
  }, []);

  useEffect(() => {
    messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
  });

  useEffect(() => {
    getFacultyList();
  }, []);

  const getRoomInfo = async () => {
    const { data } = await supabase
      .from("rooms")
      .select("title,thread_id,state,id")
      .eq("id", roomId);
    setRoomInfo(data[0]);
    setThreadId(data[0].thread_id);
    setState(data[0].state);

    if (data[0].state === 4) {
      if (data[0].thread_id === "") {
        const { data } = await supabase
          .from("rooms")
          .select("plan")
          .eq("id", roomId);
        // console.log("@@", data[0].plan);
        getAssistantMSG(JSON.stringify(data[0].plan), "", 4);
      }
    }
  };

  const getChats = async () => {
    const { data } = await supabase
      .from("chats")
      .select("*, comment(id,comment,thumbs_up)")
      .eq("fk_room_id", roomId)
      .order("created_at", { ascending: true });

    const result = data.map((item) => {
      return {
        message: item.message,
        createdAt: item.created_at,
        role: item.role,
        comment: item.comment,
      };
    });

    setChats(result);
  };

  const getAssistantMSG = async (msg, thread, idx) => {
    try {
      setMsgLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_NODE_BASE_URL}/message`,
        {
          userMessage: msg,
          threadId: thread,
          type: idx,
        }
      );
      if (threadId === "") {
        setThreadId(data.threadId);
        await supabase
          .from("rooms")
          .update({ thread_id: data.threadId })
          .eq("id", roomId)
          .select();
      }

      setMsgLoading(false);

      // console.log(data);

      insertMessage(data.assistant, "assistant");
    } catch (e) {
      console.log(e);
    }
  };

  const insertMessage = async (msg, role) => {
    try {
      const { data } = await supabase
        .from("chats")
        .insert([
          {
            fk_user_id: user.id,
            fk_room_id: roomInfo.id,
            message: msg,
            role: role,
          },
        ])
        .select();
      // console.log(data, role);

      setChats((prev) => [
        ...prev,
        { message: msg, createdAt: "", role: role },
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMessage = async () => {
    if (message !== "") {
      // User Chat Process
      insertMessage(message, "user");

      //Assistant Chat Process
      getAssistantMSG(message, threadId, state);
      setMessage("");
    }
  };

  const getFacultyList = async () => {
    const { data, error } = await supabase.from("faculty").select();

    if (data.length > 0) {
      const arr = [{ value: "", label: "None" }];
      data.map((item) => {
        arr.push({ value: item.id, label: item.name });
      });
      setList(arr);
    }

    setListLoading(false);
  };

  const showModal = () => {
    setIsModal(true);
  };
  const handleOk = () => {
    setIsModal(false);
  };
  const handleCancel = () => {
    setIsModal(false);
  };

  const changeInputValueHandler = (e) => {
    if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
      e.preventDefault();
      msgLoading === false && handleMessage();
    }
  };

  const handleNextLevel = async () => {
    // console.log(chats);
    setState(2);
    setThreadId("");
    await supabase
      .from("rooms")
      .update({ state: 2, thread_id: "" })
      .eq("id", roomId)
      .select();
    getAssistantMSG(JSON.stringify(chats), "", 2);
    // getAssistantMSG(JSON.stringify(chats), "", 2);

    if (selectFaculty !== "") {
      await supabase.from("invite").insert([
        {
          fk_user_id: user.id,
          fk_room_id: roomId,
          fk_faculty_id: selectFaculty,
        },
      ]);
    }
  };

  const messageFilterFn = (text) => {
    // JSON 부분 추출하기
    const jsonStart = text.indexOf("```json");
    const jsonEnd = text.indexOf("```", jsonStart + 6);
    // console.log(text);

    if (jsonStart === -1) return { message: text };

    // JSON 문자열 추출
    const jsonString = text.substring(jsonStart + 7, jsonEnd).trim();

    // 나머지 텍스트 추출
    const textOnly =
      text.substring(0, jsonStart).trim() +
      "\n" +
      text.substring(jsonEnd + 3).trim();

    // JSON 문자열을 객체로 파싱
    let jsonData;
    try {
      jsonData = JSON.parse(jsonString);
      // console.log(jsonData);
    } catch (e) {
      console.error("JSON 파싱 오류:", e);
    }

    return { message: textOnly, json: jsonData };
  };

  const handleThumbsUp = async (thumbsUp, id) => {
    await supabase
      .from("comment")
      .update({ thumbs_up: !thumbsUp })
      .eq("id", id);
    getChats();
  };

  return (
    <Container>
      <ChatContainer ref={messageEndRef}>
        {chats.map((item, index) => {
          if (item.role === "user")
            return (
              <UserMessage key={index}>
                {typeof item.comment !== "undefined" &&
                  item.comment.length !== 0 && (
                    <>
                      {item.comment[0].thumbs_up ? (
                        <>
                          <LikeFilled
                            onClick={() =>
                              handleThumbsUp(
                                item.comment[0].thumbs_up,
                                item.comment[0].id
                              )
                            }
                            style={{
                              marginRight: 8,
                              color: "#512D83",
                              alignItems: "start",
                              marginTop: 5,
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <LikeOutlined
                            onClick={() =>
                              handleThumbsUp(
                                item.comment[0].thumbs_up,
                                item.comment[0].id
                              )
                            }
                            style={{
                              marginRight: 8,
                              color: "#512D83",
                              alignItems: "start",
                              marginTop: 5,
                            }}
                          />
                        </>
                      )}

                      <Popover
                        content={
                          <PopContent>{item.comment[0].comment}</PopContent>
                        }
                        trigger={"hover"}
                        // open={true}
                      >
                        <CommentOutlined
                          style={{
                            marginRight: 8,
                            color: "#512D83",
                            marginTop: 5,
                            alignItems: "start",
                          }}
                        />
                      </Popover>
                    </>
                  )}

                <Message className="user">{item.message}</Message>
              </UserMessage>
            );
          else if (item.role === "assistant")
            return (
              <GptMessage key={index}>
                <Message className="gpt">
                  <GPTMsg
                    message={messageFilterFn(item.message)}
                    setPlanJson={setPlanJson}
                    roomId={roomId}
                    setIsNewChat={setIsNewChat}
                    setSelRoomId={setSelRoomId}
                  />
                </Message>

                {typeof item.comment !== "undefined" &&
                  item.comment.length !== 0 && (
                    <>
                      <Popover
                        content={
                          <PopContent>{item.comment[0].comment}</PopContent>
                        }
                        trigger={"hover"}
                      >
                        <CommentOutlined
                          style={{
                            marginLeft: 8,
                            color: "#512D83",
                            marginTop: 5,
                            alignItems: "start",
                          }}
                        />
                      </Popover>

                      {item.comment[0].thumbs_up ? (
                        <>
                          <LikeFilled
                            onClick={() =>
                              handleThumbsUp(
                                item.comment[0].thumbs_up,
                                item.comment[0].id
                              )
                            }
                            style={{
                              marginLeft: 8,
                              color: "#512D83",
                              alignItems: "start",
                              marginTop: 5,
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <LikeOutlined
                            onClick={() =>
                              handleThumbsUp(
                                item.comment[0].thumbs_up,
                                item.comment[0].id
                              )
                            }
                            style={{
                              marginLeft: 8,
                              color: "#512D83",
                              alignItems: "start",
                              marginTop: 5,
                            }}
                          />
                        </>
                      )}
                    </>
                  )}
              </GptMessage>
            );
        })}

        {msgLoading && <Spin />}
      </ChatContainer>
      <Divider />
      <InputContainer>
        {/* <Input
          placeholder="send message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={changeInputValueHandler}
        /> */}
        <TextArea
          placeholder="send message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={changeInputValueHandler}
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          style={{ marginLeft: 10, width: 50 }}
          onClick={handleMessage}
          disabled={msgLoading}
        />

        <Popconfirm
          title="Caution"
          // description="Once you proceed, you will not be able to return."
          description={
            <>
              <div>Once you proceed, you will not be able to return.</div>
              <div> And Select your faculty.</div>
              <Select
                placeholder="Select a faculty"
                style={{ marginTop: 10, width: 300, marginBottom: 20 }}
                loading={listLoading}
                options={list}
                onChange={(e) => setSelectFaculty(e)}
              />
            </>
          }
          onConfirm={handleNextLevel}
          okText="Yes"
          cancelText="Cancle"
        >
          <Button type="primary" style={{ marginLeft: 10 }}>
            Next
          </Button>
        </Popconfirm>
      </InputContainer>

      <FloatButton
        icon={<QuestionCircleOutlined />}
        type="primary"
        style={{
          insetInlineEnd: 100,
          // top: 100,
          // right: 150,
          width: 50,
          height: 50,
        }}
        onClick={() => setIsModal(true)}
      />

      {/* {isModal && <Prompt />} */}

      <Modal
        title="Prompt"
        open={isModal}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer
        width={800}
      >
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Modal>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChatContainer = styled.div`
  flex: 9;
  /* margin-bottom: 10px; */
  overflow-y: auto;
  flex-direction: column;
  padding-right: 10px;

  &::-webkit-scrollbar {
    // display: none;
  }
`;

const InputContainer = styled.div`
  flex-direction: row;
  display: flex;
  align-items: end;
`;

const UserMessage = styled.div`
  display: flex;
  justify-content: end;
  .user {
    /* max-width: 480px; */
    color: white;
    background-color: #512d83;
    border-radius: 10px;
  }
`;

const GptMessage = styled.div`
  display: flex;
  margin-right: 50px;
  .gpt {
    border-radius: 10px;
    border: 2px solid #512d83;
  }
`;

const Message = styled.div`
  white-space: pre-line;
  font-size: 13px;
  padding: 15px 20px;
  margin-bottom: 20px;
`;

let a = {
  project_name: "",
  project_description: "",
  recommended_learning_materials: [],
  learning_plan: [
    {
      week: 1,
      inquiry_question: "",
      reference_materials: [],
      learning_activity: "",
    },
    {
      week: 2,
      inquiry_question: "",
      reference_materials: [],
      learning_activity: "",
    },
    {
      week: 3,
      inquiry_question: "",
      reference_materials: [],
      learning_activity: "",
    },
  ],
};

const dataSource = [
  {
    key: "1",
    type: "1. Assign a role",
    examples: `- “You are an expert in the field of [domain/discipline]…”
- “You are a professor…”`,
  },
  {
    key: "2",
    type: "2. Integrate the intended audience",
    examples: `- “The audience is an expert in this field.”
- “Explain the concept as if you are explaining to someone with zero knowledge…”
- “Explain as if you are teaching a 5-year-old.”
- “I want to teach this concept to my [teammate/friend] that is part of the same project.”`,
  },
  {
    key: "3",
    type: "3. Provide background information",
    examples: `- “I am currently in charge of a research project for…”
- “I am a university student that majors in…”
- “I am a complete beginner in physical sciences…”`,
  },
  {
    key: "4",
    type: "4. Rewarding system",
    examples: `- “I will give you a bonus if you provide a better solution.”
- “I am going to tip $xxx if you…”`,
  },
  {
    key: "5",
    type: "5. Warning / Punishment",
    examples: `- “You will be penalized…”
- “You will get punished if…”`,
  },
  {
    key: "6",
    type: "6. Get the chatbot to ask questions",
    examples: `- “From now on, I would like you to ask me questions [to/until]…”
- “Before you start working, ask me any necessary questions to gather data to construct a better response.”`,
  },
  {
    key: "7",
    type: "7. Use adjectives/adverbs as keywords",
    examples: `- “Explain it to me step-by-step…”
- “[Respond/explain] in a natural, human-like manner…”
- “Give a detailed explanation…”
- “Be specific in your [reasoning/answer/response].”
- “Provide a brief and clear summary…”
- “Use [simple/basic] language…”`,
  },
  {
    key: "8",
    type: "8. Use emphasizing keywords",
    examples: `- “You must do…”
- “I strongly recommend you to…”
- “Be very specific when explaining your answer…”
- “Pay extra attention to your [style/tone/language].”
- “It is really important that…”`,
  },
  {
    key: "9",
    type: "9. Use leading words",
    examples: `- “Think step-by-step…”
- “Think critically…”
- “Think out-of-the-box…”
- “Be [careful/cautious]…”`,
  },
  {
    key: "10",
    type: "10. Others",
    examples: `- If you want more concise answers, do not use words such as “please”, “if you don’t mind”, “thank you”, “I would like to…”, etc., and get straight to the point.
- Use more affirmative directives such as “do,” and try to use less negative language like “don’t.”
- “I am providing you with the beginning [paragraph/essay/story]: [Insert the paragraph/essay/story] 
Finish the [paragraph/essay/story] based on the following words provided: “`,
  },
];

const columns = [
  {
    title: "Prompt Type",
    dataIndex: "type",
    key: "type",
    render: (e) => <div style={{ fontWeight: "bold" }}>{e}</div>,
  },
  {
    title: "Examples",
    dataIndex: "examples",
    key: "examples",
    render: (e) => {
      return <div style={{ whiteSpace: "pre-line" }}>{e}</div>;
    },
  },
];

const PopContent = styled.div`
  width: 300px;
  max-height: 120px;
  overflow: scroll;
  word-break: break-word;
  &::-webkit-scrollbar {
    display: none;
  }
`;
