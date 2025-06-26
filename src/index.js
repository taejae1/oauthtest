import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ConfigProvider theme={{ token: { colorPrimary: "#512D83" } }}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const useAuthStateChange = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.REACT_APP_SUPABASE_KEY
    ).auth.onAuthStateChange(
      async (event, session) => {
        console.log(event, session);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);
};

console.log(process.env.REACT_APP_SUPABASE_URL);
console.log(process.env.REACT_APP_SUPABASE_KEY);

export default useAuthStateChange;

const handleGoogleLogin = async () => {
  console.log("구글 로그인 버튼 클릭됨");
  await supabase.auth.signInWithOAuth({ provider: "google" });
}
