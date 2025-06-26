import { Button, Drawer, Input, message, Tabs } from "antd";
import { useEffect, useState } from "react";
import Loading from "../../Components/Loading";
import supabase from "../../supabase";
import styled from "styled-components";
import ListView from "./ListView";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";

const AccountList = ({ setSelected, activeTab, setActiveTab, setSelName }) => {
  // const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const getData = async (key) => {
    setIsLoading(true);
    let { data, error } = await supabase.from(key).select();
    setData(data);

    setIsLoading(false);
  };

  const onChange = (key) => {
    setActiveTab(key);
    setSelected("");
    getData(key);
  };

  useEffect(() => {
    getData(activeTab);
  }, []);
  const items = [
    {
      key: "users",
      label: "Users",
      children: (
        <ListView
          data={data}
          tabKey={activeTab}
          getData={getData}
          setSelected={setSelected}
          setSelName={setSelName}
        />
      ),
    },
    {
      key: "faculty",
      label: "Faculty",
      children: (
        <ListView
          data={data}
          tabKey={activeTab}
          getData={getData}
          setSelected={setSelected}
          setSelName={setSelName}
        />
      ),
      //   disabled: true,
    },
    {
      key: "admin",
      label: "Admin",
      children: (
        <ListView
          data={data}
          tabKey={activeTab}
          getData={getData}
          setSelected={setSelected}
          setSelName={setSelName}
        />
      ),
    },
  ];

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setName("");
    setCode("");
    setOpen(false);
  };

  const insertAccount = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from(activeTab)
      .insert({ name: name, code: code });

    error === null && message.success("Successfully Inserted.");

    getData(activeTab);
    setIsLoading(false);
    onClose();
  };

  return (
    <Container>
      <Tabs defaultActiveKey="users" items={items} onChange={onChange} />
      <Button
        type="primary"
        style={{
          width: "100%",
          height: "28px",
          marginTop: 10,
          marginBottom: 10,
          fontSize: 12,
        }}
        onClick={showDrawer}
      >
        + New Account
      </Button>

      <Drawer placement="left" open={open} onClose={onClose} width={300}>
        <Input
          style={{ marginBottom: 10 }}
          placeholder="User Name"
          prefix={<UserOutlined />}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          style={{ marginBottom: 10 }}
          placeholder="Insert Code"
          prefix={<KeyOutlined />}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button
          style={{ width: "100%" }}
          type="primary"
          onClick={insertAccount}
        >
          Create
        </Button>
      </Drawer>

      {isLoading && <Loading />}
    </Container>
  );
};

export default AccountList;

const Container = styled.div``;
