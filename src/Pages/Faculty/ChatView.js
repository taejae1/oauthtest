import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import supabase from "../../supabase";
import GPTMsg from "./GPTMsg";
import { CommentOutlined, LikeFilled, LikeOutlined } from "@ant-design/icons";
import { Modal, Input, Popover, message } from "antd";
const { TextArea } = Input;

const ChatView = ({ roomId }) => {
  const messageEndRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [msgID, setMsgID] = useState("");
  const [comment, setComment] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [chats, setChats] = useState([]);
  const getChatList = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("chats")
      .select(
        "id,role,message,created_at, users(name), comment(id,comment,thumbs_up)"
      )
      .eq("fk_room_id", roomId)
      .order("created_at", { ascending: true });
    // console.log(data);
    setChats(data);
    setIsLoading(false);
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

  useEffect(() => {
    getChatList();
  }, [roomId]);

  useEffect(() => {
    messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
  });

  const handleModal = (id) => {
    setIsModal(true);
    setMsgID(id);
  };

  const postComment = async () => {
    console.log("POST");

    // await supabase.from("chats").update({ comment: comment }).eq("id", msgID);

    const { error } = await supabase
      .from("comment")
      .insert({ comment: comment, fk_room_id: roomId, fk_chat_id: msgID });

    error === null && message.success("Successfully.");

    console.log(error);

    await supabase.from("rooms").update({ noti_state: true }).eq("id", roomId);

    getChatList();
    handleCancel();
  };

  const handleCancel = () => {
    setIsModal(false);
    setComment("");
    setMsgID("");
  };

  return (
    <Container>
      <ChatBox ref={messageEndRef}>
        {chats.length > 0 &&
          chats.map((item) => {
            const role = item.role;

            if (role === "user") {
              return (
                <Chat className="user_1">
                  {item.comment.length !== 0 && item.comment[0].thumbs_up && (
                    <>
                      <LikeFilled
                        style={{
                          marginRight: 8,
                          color: "#512D83",
                          alignItems: "start",
                          marginTop: 5,
                        }}
                      />
                    </>
                  )}
                  {item.comment.length !== 0 && (
                    <>
                      <Popover
                        content={
                          // <PopContent>{console.log(item)}</PopContent>
                          <PopContent>{item.comment[0].comment}</PopContent>
                        }
                        trigger={"hover"}
                      >
                        <CommentOutlined
                          style={{
                            marginRight: 8,
                            color: "#512D83",
                            alignItems: "start",
                            marginTop: 5,
                          }}
                        />
                      </Popover>
                    </>
                  )}

                  <Message
                    onClick={() => handleModal(item.id)}
                    className="user"
                  >
                    {item.message}
                  </Message>
                </Chat>
              );
            }

            if (role === "assistant") {
              return (
                <Chat className={"assistant_1"}>
                  <Message
                    className="assistant"
                    onClick={() => handleModal(item.id)}
                  >
                    <GPTMsg
                      message={messageFilterFn(item.message)}
                      user={item.users}
                    />
                  </Message>

                  {item.comment.length !== 0 && (
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
                    </>
                  )}
                  {item.comment.length !== 0 && item.comment[0].thumbs_up && (
                    <>
                      <LikeFilled
                        style={{
                          marginLeft: 8,
                          color: "#512D83",
                          alignItems: "start",
                          marginTop: 5,
                        }}
                      />
                    </>
                  )}
                </Chat>
              );
            }
          })}
      </ChatBox>

      <Modal
        title="Comment"
        open={isModal}
        onOk={postComment}
        onCancel={handleCancel}
      >
        <TextArea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment"
          autoSize={{
            minRows: 3,
            maxRows: 5,
          }}
        />
      </Modal>
    </Container>
  );
};

export default ChatView;

const Container = styled.div`
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  padding: 20px;
  display: flex;
  flex-direction: column;
  .user_1 {
    justify-content: end;
    /* color: red; */
    margin-left: 50px;
  }
  .assistant_1 {
    margin-right: 50px;
  }
`;

const Chat = styled.div`
  display: flex;

  .user {
    color: white;
    background-color: #512d83;
    border-radius: 10px;
    max-width: 400px;
  }
  .assistant {
    max-width: 400px;
    border-radius: 10px;
    border: 2px solid #512d83;
  }
`;

const Message = styled.div`
  white-space: pre-line;
  font-size: 13px;
  padding: 15px 20px;
  margin-bottom: 20px;
  max-width: 400px;
  cursor: pointer;
  position: relative;
`;

const ChatBox = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  &::-webkit-scrollbar {
    // display: none;
  }
  flex-direction: column;
`;

const PopContent = styled.div`
  width: 300px;
  max-height: 120px;
  overflow: scroll;
  word-break: break-word;
  &::-webkit-scrollbar {
    display: none;
  }
`;
