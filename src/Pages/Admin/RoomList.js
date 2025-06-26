import { useEffect, useState } from "react";
import styled from "styled-components";
import supabase from "../../supabase";
import { List, message, Tag } from "antd";
import SOPModal from "./SOPModal";
import Loading from "../../Components/Loading";

const RoomList = ({ selected, activeTab, selName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModal, setIsModal] = useState(false);

  const getList = async () => {
    setIsLoading(true);
    let { data: list, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("fk_user_id", selected);

    setData(list);

    // console.log(list);
    setIsLoading(false);
  };

  useEffect(() => {
    getList();
  }, [selected]);

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

  return (
    <Container>
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Item>
              <div className="title">{item.title}</div>
              <div className="right">
                {Object.keys(item.plan).length > 0 && (
                  <div
                    id="sop"
                    onClick={() => {
                      setIsModal(true);
                      //   console.log(item.plan);
                    }}
                  >
                    Statement of Purpose
                  </div>
                )}
                <div id="chat" onClick={() => message.error("Comming soon!")}>
                  Export Chat
                </div>
                <Tag className="tag" color={setStateTag(item.state).color}>
                  {setStateTag(item.state).name}
                </Tag>
              </div>
              {isModal && (
                <SOPModal
                  setIsModal={setIsModal}
                  json={item.plan}
                  selName={selName}
                />
              )}
            </Item>
          </List.Item>
        )}
      />

      {isLoading && <Loading />}
    </Container>
  );
};

export default RoomList;

const Container = styled.div`
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  .title {
    font-weight: 700;
  }
  .right {
    display: flex;
  }

  #sop {
    font-weight: 600;
    font-size: 13px;
    color: #512d83;
    cursor: pointer;
  }

  #chat {
    margin-left: 12px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
  }

  .tag {
    width: 70px;
    text-align: center;
    font-size: 10px;
    margin-left: 12px;
  }
`;
