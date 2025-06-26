import styled from "styled-components";
import { Button, Input, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import supabase from "../supabase";
import GoogleLoginButton from "./GoogleLoginButton";
import { useNavigate } from "react-router-dom";

const LoginPanner = ({ setIsLogined }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      setIsLogined(true);
    }
  }, [setIsLogined]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const email = session.user.email;
          let { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email);
          if (user && user.length > 0) {
            localStorage.setItem("user", JSON.stringify(user[0]));
            setIsLogined(true);
            navigate("/");
          } else {
            alert("등록된 사용자가 아닙니다.");
            await supabase.auth.signOut();
            localStorage.removeItem("user");
            setIsLogined(false);
            navigate("/login");
          }
        }
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "인증에 실패하였습니다. 코드를 확인해주세요.",
    });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    let { data: user, error } = await supabase
      .from("users")
      .select("id,name,state")
      .eq("code", code);

    if (user.length > 0) {
      if (user[0].state === false) {
        messageApi.open({
          type: "error",
          content: "허가된 코드가 아닙니다. 관리자에게 문의해주세요.",
        });
        setIsLoading(false);
        return;
      }

      setIsLogined(true);
      localStorage.setItem("user", JSON.stringify(user[0]));
    } else {
      errorMessage();
    }
    setCode("");
    setIsLoading(false);
  };

  // 구글 로그인 버튼 클릭 시
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <Body>
      {contextHolder}
      <Container>
        <LogoImage src={`${process.env.PUBLIC_URL}/image/Logo1.png`} alt="" />
        <Input.Password
          placeholder="Authentication Code"
          prefix={<UserOutlined />}
          style={{ marginBottom: 10 }}
          onChange={(e) => setCode(e.target.value)}
          onPressEnter={handleLogin}
          value={code}
        />
        <Button type="primary" block onClick={handleLogin}>
          Login
        </Button>
        <GoogleLoginButton onClick={handleGoogleLogin} />
      </Container>
      {isLoading && <Loading />}
    </Body>
  );
};

export default LoginPanner;

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

const LogoImage = styled.img`
  width: 260px;
  padding-bottom: 28px;
`;

const Body = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;
