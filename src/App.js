import styled from "styled-components";
import { useEffect, useState } from "react";
import LoginPanner from "./Components/LoginPanner";
import MainPanner from "./Components/MainPanner";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Pages/Admin/Login";
import Admin from "./Pages/Admin/Admin";
import Faculty from "./Pages/Faculty/Faculty";
import FacultyLogin from "./Pages/Faculty/FacultyLogin";
import supabase from "./supabase";

function App() {
  const [isLogined, setIsLogined] = useState(false);
  const navigate = useNavigate();

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

  return (
    <BackGround>
      <Routes>
        <Route
          path="/login"
          element={
            isLogined ? (
              <Navigate replace to="/" />
            ) : (
              <LoginPanner setIsLogined={setIsLogined} />
            )
          }
        />
        <Route
          path="/"
          element={
            !isLogined ? (
              <Navigate replace to="/login" />
            ) : (
              <MainPanner setIsLogined={setIsLogined} />
            )
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/faculty/login" element={<FacultyLogin />} />
      </Routes>
      <Footer>
        <FooterTitle>{"TAEJAE EPT(Education Planning Team)"}</FooterTitle>
      </Footer>
    </BackGround>
  );
}

export default App;

const BackGround = styled.div`
  width: 100vw;
  height: 100vh;
  /* justify-content: center;
  align-items: center; */
  display: flex;
  /* flex-direction: column; */
`;

const Footer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
`;

const FooterTitle = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: end;
  color: #979797;
  padding-bottom: 10px;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
`;
