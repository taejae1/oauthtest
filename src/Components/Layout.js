import { Button, Divider } from "antd";
import { Navigate } from "react-router-dom";
import styled from "styled-components";

const Layout = ({ children, setIsLogined, setIsNewChat, setSelRoomId }) => {
  const handleLogOut = () => {
    localStorage.removeItem("user");
    setIsLogined(false);
    // <Navigate to="/login" />;
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Body>
      <Container>
        <Header>
          <LogoContainer
            onClick={() => {
              setIsNewChat(false);
              setSelRoomId("");
            }}
          >
            <Logo src={`${process.env.PUBLIC_URL}/image/Logo3.png`} />
            <LogoTitle>LearnMate AI</LogoTitle>
            <BetaTitle>Beta</BetaTitle>
          </LogoContainer>
          <SideContainer>
            <WelcomeTitle>
              Welcome! {user.name} {`:)`}
            </WelcomeTitle>
            <Button type="primary" size="small" onClick={handleLogOut}>
              Logout
            </Button>
          </SideContainer>
        </Header>
        <Divider />
        <Content>{children}</Content>
      </Container>
    </Body>
  );
};

export default Layout;

const Body = styled.div`
  width: 100%;
  /* height: 100%; */
  display: flex;
  justify-content: center;
  padding-top: 80px;
`;

const Container = styled.div`
  background-color: white;

  width: 600px;
  height: 800px;
  max-height: 800px;
  /* min-height: 400px; */
  padding: 38px;
  border-radius: 10px;

  -moz-box-sizing: border-box;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Content = styled.div`
  width: 100%;
  height: 650px;

  /* background-color: red; */
`;

const Logo = styled.img`
  width: 30px;
  margin-right: 10px;
`;
const LogoTitle = styled.div`
  color: #512d83;
  font-size: 24px;
  font-weight: 800;
`;
const BetaTitle = styled.div`
  color: #512d83;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 600;
`;

const LogoContainer = styled.div`
  display: flex;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const SideContainer = styled.div`
  display: flex;
  align-items: center;
`;
const WelcomeTitle = styled.div`
  margin-right: 20px;
  color: #979797;
  font-weight: 500;
`;
