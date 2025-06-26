import styled from "styled-components";
import Layout from "./Layout";
import ListContainer from "./ListContainer";
import { useEffect, useState } from "react";
import FirstStep from "./FirstStep";
import Chat from "./Chat";

const MainPanner = ({ setIsLogined }) => {
  const [isNewChat, setIsNewChat] = useState(false);
  const [selRoomId, setSelRoomId] = useState("");

  return (
    <Layout
      setIsLogined={setIsLogined}
      setIsNewChat={setIsNewChat}
      setSelRoomId={setSelRoomId}
    >
      {isNewChat === false ? (
        <>
          {selRoomId === "" ? (
            <ListContainer
              setIsNewChat={setIsNewChat}
              setSelRoomId={setSelRoomId}
            />
          ) : (
            <Chat
              roomId={selRoomId}
              action={true}
              setIsNewChat={setIsNewChat}
              setSelRoomId={setSelRoomId}
            />
          )}
        </>
      ) : (
        <FirstStep setIsNewChat={setIsNewChat} />
      )}
    </Layout>
  );
};

export default MainPanner;
