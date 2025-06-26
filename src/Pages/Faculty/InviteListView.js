import styled from "styled-components";
import supabase from "../../supabase";
import { Button, Empty, List, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";

const InviteListView = ({ data, onChange, getInviteList }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptInvite = async (id) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("invite")
      .update({ state: true })
      .eq("id", id);

    onChange("rooms");
    getInviteList();
    setIsLoading(false);
  };

  return (
    <Container>
      <div className="listview">
        {data.length > 0 ? (
          <List
            dataSource={data}
            renderItem={(item) => {
              return (
                <List.Item>
                  <Item>
                    <div className="left">
                      <div className="title">
                        {item.rooms.plan.project_name !== undefined
                          ? item.rooms.plan.project_name
                          : "Untitled"}
                      </div>
                      <div className="name">
                        {item.users.name} / {item.rooms.title}
                      </div>
                    </div>
                    <div className="right">
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: "#512D83",
                          cursor: "pointer",
                        }}
                        onClick={() => handleAcceptInvite(item.id)}
                      >
                        Accept
                      </div>
                    </div>
                  </Item>
                </List.Item>
              );
            }}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </Container>
  );
};

export default InviteListView;

const Container = styled.div`
  .listview {
    max-height: 450px;
    overflow-y: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .listview::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  .left {
    cursor: pointer;
  }
  .right {
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-weight: 600;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 280px;
    /* width: 100px;
    height: 20px;
    overflow: hidden; */
  }
  .name {
    font-size: 10px;
  }
`;
