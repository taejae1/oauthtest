import { Button, Empty } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import RoomList from "./RoomList";
import ChatView from "./ChatView";

const Faculty = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("faculty")) {
      navigate("/faculty/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("faculty");
    navigate("/faculty/login");
  };

  return (
    <Body>
      {localStorage.getItem("faculty") && (
        <Container>
          <div className="rooms">
            <Nav>
              <Logo src={`${process.env.PUBLIC_URL}/image/Logo3.png`} alt="" />

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: 12 }}>
                  Welcome! {JSON.parse(localStorage.getItem("faculty")).name}
                  {" :)"}
                </div>
                <Button
                  type="primary"
                  style={{ fontSize: 12 }}
                  size="small"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </Nav>
            <RoomList setRoomId={setRoomId} />
          </div>
          <div className="chat">
            {roomId !== "" ? (
              <ChatView roomId={roomId} />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Empty />
              </div>
            )}
          </div>
        </Container>
      )}
    </Body>
  );
};

export default Faculty;

const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  background-color: white;
  width: 900px;
  height: 600px;
  display: flex;
  border-radius: 15px;

  .rooms {
    width: 400px;
    /* background-color: green; */
    padding: 15px;
    border-right: 1.5px solid #f0f0f0;
  }
  .chat {
    width: 500px;
    /* background-color: red; */
    padding: 15px;
    height: 100%;
  }
`;

const Nav = styled.div`
  /* background-color: red; */
  width: 100%;
  height: 50px;
  /* justify-content: center; */
  align-items: center;
  justify-content: space-between;
  display: flex;
`;

const Logo = styled.img`
  width: 30px;
`;
