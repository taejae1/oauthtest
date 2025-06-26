import {
  DeleteOutlined,
  FileOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { Empty, List, message, Popconfirm } from "antd";
import styled from "styled-components";
import supabase from "../../supabase";
import { useState } from "react";
import SOPModal from "./SOPModal";

const RoomListView = ({ data, getRoomList, setRoomId }) => {
  const [isModal, setIsModal] = useState(false);

  const deleteRoomConfirm = async (item) => {
    await supabase.from("invite").delete().eq("id", item.id);
    getRoomList();

    message.success("Successfully deleted.");
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
                  <Item
                    onClick={() => {
                      //   setSelected(item.id);
                      //   setSelName(item.name);
                    }}
                  >
                    <div
                      className="left"
                      onClick={() => setRoomId(item.rooms.id)}
                    >
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
                      {Object.keys(item.rooms.plan).length > 0 && (
                        <FileOutlined
                          style={{ fontSize: "13px" }}
                          onClick={() => setIsModal(true)}
                        />
                      )}

                      <Popconfirm
                        title="Delete Room"
                        description="Are you sure to delete this room?"
                        onConfirm={() => deleteRoomConfirm(item)}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <DeleteOutlined
                          style={{
                            fontSize: "14px",
                            color: "red",
                            marginLeft: "5px",
                          }}
                        />
                      </Popconfirm>
                    </div>
                  </Item>

                  {isModal && (
                    <SOPModal
                      setIsModal={setIsModal}
                      json={item.rooms.plan}
                      name={item.users.name}
                    />
                  )}
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

export default RoomListView;

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
