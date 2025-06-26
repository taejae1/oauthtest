import styled from "styled-components";
import supabase from "../../supabase";
import { DeleteOutlined } from "@ant-design/icons";
import { Empty, List, message, Popconfirm, Switch } from "antd";

const ListView = ({ data, tabKey, getData, setSelected, setSelName }) => {
  const deleteConfirm = async (item) => {
    await supabase.from(tabKey).delete().eq("id", item.id);
    getData(tabKey);
    message.success("Successfully deleted.");
  };

  const onSwitchChange = async (e, item) => {
    const { error } = await supabase
      .from(tabKey)
      .update({ state: e })
      .eq("id", item.id);

    error === null && getData(tabKey);
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
                      setSelected(item.id);
                      setSelName(item.name);
                    }}
                  >
                    <div className="left">
                      <div className="name">{item.name}</div>
                      <div className="code">{item.code}</div>
                    </div>
                    <div className="right">
                      <Switch
                        size="small"
                        value={item.state}
                        onChange={(e) => onSwitchChange(e, item)}
                      />

                      <Popconfirm
                        title="Delete Account"
                        description="Are you sure to delete this account?"
                        onConfirm={() => deleteConfirm(item)}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <DeleteOutlined
                          style={{
                            fontSize: "12px",
                            color: "red",
                            marginLeft: "10px",
                          }}
                        />
                      </Popconfirm>
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

export default ListView;

const Container = styled.div`
  .listview {
    max-height: 410px;
    overflow-y: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .listview::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;

  .left {
    cursor: pointer;
  }
  .name {
    font-weight: 600;
    font-size: 13px;
  }
  .code {
    font-size: 10px;
  }
`;
