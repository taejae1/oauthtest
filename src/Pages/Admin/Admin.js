import { Button, Empty } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AccountList from "./AccountList";
import DetailView from "./DetailView";

const Admin = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [selName, setSelName] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/admin/login");
    }
  }, []);
  return (
    <Body>
      <Container>
        <div className="account">
          <Nav>
            <Logo src={`${process.env.PUBLIC_URL}/image/Logo3.png`} alt="" />
            <Button
              type="primary"
              style={{ fontSize: 12 }}
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Nav>
          <AccountList
            setSelected={setSelected}
            setSelName={setSelName}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
        <div className="room">
          {selected === "" ? (
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
          ) : (
            <DetailView
              selected={selected}
              activeTab={activeTab}
              selName={selName}
            />
          )}
        </div>
      </Container>
    </Body>
  );
};

export default Admin;

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

  .account {
    width: 250px;
    /* background-color: green; */
    padding: 15px;
    border-right: 1.5px solid #f0f0f0;
  }
  .room {
    width: 650px;
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
