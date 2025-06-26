import { UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import supabase from "../../supabase";
import Loading from "../../Components/Loading";

const FacultyLogin = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "인증에 실패하였습니다. 코드를 확인해주세요.",
    });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    let { data: user, error } = await supabase
      .from("faculty")
      .select("id,name")
      .eq("code", code);

    if (user.length > 0) {
      localStorage.setItem("faculty", JSON.stringify(user[0]));
    } else {
      errorMessage();
    }
    setCode("");
    setIsLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("faculty")) {
      navigate("/faculty");
    }
  });

  return (
    <Body>
      {contextHolder}

      <Container>
        {/* <Title>Admin Login</Title> */}
        <LogoImage src={`${process.env.PUBLIC_URL}/image/Logo1.png`} alt="" />
        <Input.Password
          placeholder="Insert Faculty Code"
          prefix={<UserOutlined />}
          style={{ marginBottom: 10 }}
          onChange={(e) => setCode(e.target.value)}
          onPressEnter={handleLogin}
          value={code}
        />

        <Button type="primary" block onClick={handleLogin}>
          Login
        </Button>
      </Container>
      {isLoading && <Loading />}
    </Body>
  );
};
export default FacultyLogin;

const Container = styled.div`
  width: 400px;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 10px 60px;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  flex-direction: column;
  border-radius: 10px;
`;

const Title = styled.div`
  padding-bottom: 18px;
  font-weight: 800;
  font-size: 20px;
`;

const Body = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 260px;
  padding-bottom: 28px;
`;
