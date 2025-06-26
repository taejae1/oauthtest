import { useState } from "react";
import styled from "styled-components";
import Preview from "./Preview";
import Chat from "./Chat";

const FirstStep = ({ setIsNewChat }) => {
  const [isStart, setIsStart] = useState(false);
  const [roomId, setRoomId] = useState("");

  return (
    <Container>
      {isStart === false ? (
        <Preview
          title="Interest Discovery Room"
          subTitle={`Please enter a room name.`}
          setIsStart={setIsStart}
          setRoomId={setRoomId}
        />
      ) : (
        <>
          {roomId !== "" && (
            <Chat roomId={roomId} setIsNewChat={setIsNewChat} />
          )}
        </>
      )}
    </Container>
  );
};

export default FirstStep;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
