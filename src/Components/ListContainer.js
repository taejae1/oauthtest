import styled from "styled-components";
import { Button, List, message, Tag, Popconfirm, Badge } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import supabase from "../supabase";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import SOPModal from "./SOPModal";

const ListContainer = ({ setIsNewChat, setSelRoomId }) => {
  const [roomList, setRoomList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [plan, setPlan] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [isEdit, setIsEdit] = useState(false);

  const setStateTag = (value) => {
    let data = { name: "", color: "" };
    if (value === 1) {
      data.name = "Interest Set";
      data.color = "red";
    } else if (value === 2) {
      data.name = "Planning";
      data.color = "orange";
    } else if (value === 3) {
      data.name = "Waiting";
      data.color = "purple";
    } else if (value === 4) {
      data.name = "Learning";
      data.color = "green";
    } else {
      data.name = "End";
      data.color = "gray";
    }

    return data;
  };

  const getList = async () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("현재 로그인한 사용자:", user);
    
    // 환경 변수 확인
    console.log("Supabase URL:", process.env.REACT_APP_SUPABASE_URL);
    console.log("Supabase Key 존재 여부:", !!process.env.REACT_APP_SUPABASE_KEY);
    
    if (!user || !user.id) {
      console.error("사용자 정보가 없거나 ID가 없습니다.");
      setIsLoading(false);
      return;
    }
    
    try {
      let { data: list, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("fk_user_id", user.id);

      console.log("방 목록 조회 결과:", { list, error });
      
      if (error) {
        console.error("데이터베이스 조회 오류:", error);
        messageApi.open({
          type: "error",
          content: "방 목록을 불러오는데 실패했습니다: " + error.message,
        });
      }

      setRoomList(list || []);
    } catch (err) {
      console.error("예상치 못한 오류:", err);
      messageApi.open({
        type: "error",
        content: "연결 오류가 발생했습니다.",
      });
    }
    
    setIsLoading(false);
  };

  const handleTitle = async (item) => {
    if(item.noti_state){
      await supabase
          .from("rooms")
          .update({ noti_state: false })
          .eq("id", item.id)
          .select();
    }

    setSelRoomId(item.id);
  };

  const handleDeleteItem = async (item) => {
    // setIsLoading(true);
    const response = await supabase.from("rooms").delete().eq("id", item.id);
    getList();
    // console.log(response);
    // setIsLoading(false);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Container>
      {contextHolder}
      {isLoading && <Loading />}
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          width: "100%",
        }}
      >
        <Button
          type="link"
          size="small"
          danger={isEdit}
          onClick={() => setIsEdit(!isEdit)}
          style={{
            color: "#512d83",
          }}
        >
          {!isEdit ? "Edit" : "Cancel"}
        </Button>
      </div>
      <List
        dataSource={roomList}
        renderItem={(item, index) => {
          return (
            <Item key={index} style={{ height: 50 }}>
            
              <ItemTitle
                onClick={() => {
                  if (item.state === 3) {
                    messageApi.open({
                      type: "warning",
                      content: "It's not the study period yet. Please wait.",
                    });
                    return;
                  }
                  handleTitle(item);
                }}
              >
                <Badge dot={item.noti_state} style={{marginRight:10}}></Badge>
                {item.title}
              </ItemTitle>
              <StateTitle>
                {Object.keys(item.plan).length !== 0 && (
                  <>
                    <div
                      className="plan"
                      onClick={() => {
                        setIsModal(true);
                        setPlan(item.plan);
                      }}
                    >
                      Statement of Purpose
                    </div>
                  </>
                )}
                <Tag className="tag" color={setStateTag(item.state).color}>
                  {setStateTag(item.state).name}
                </Tag>
                {isEdit && (
                  <Popconfirm
                    title="Delete the room."
                    description="Are you sure to delete this room?"
                    onConfirm={() => handleDeleteItem(item)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      className="delete"
                      type="text"
                      danger
                      size="small"
                      style={{ fontSize: 12 }}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                )}
              </StateTitle>
            </Item>
          );
        }}
        locale={{
          emptyText: (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>아직 생성된 방이 없습니다.</p>
              <p>아래 + 버튼을 클릭하여 새로운 학습 방을 만들어보세요!</p>
            </div>
          )
        }}
      />
      <AddContainer>
        <Button
          size="large"
          type="primary"
          icon={<PlusOutlined />}
          shape="circle"
          onClick={() => {
            setIsNewChat(true);
          }}
        />
      </AddContainer>

      {isModal && (
        <SOPModal setIsModal={setIsModal} json={plan} type={"view"} />
      )}
    </Container>
  );
};

export default ListContainer;

// const data1 = [];

const ItemTitle = styled.div`
  color: "#512d83";
  font-weight: 600;
  cursor: pointer;
`;
const StateTitle = styled.div`
  display: flex;
  align-items: center;
  .plan {
    margin-right: 20px;
    font-size: 12px;
    color: #512d83;
    font-weight: 600;
    cursor: pointer;
  }

  .tag {
    width: 70px;
    text-align: center;
    font-size: 10px;
  }
`;

const Item = styled(List.Item)`
  /* cursor: pointer; */
`;

const AddContainer = styled.div`
  display: flex;
  justify-content: center;
`;


const Container = styled.div`
height: 100%;
overflow: auto;

&::-webkit-scrollbar {
    display: none;
  }
`