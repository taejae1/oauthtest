import { Button } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import SOPModal from "./SOPModal";

const GPTMsg = ({
  message: obj,
  setPlanJson,
  roomId,
  setIsNewChat,
  setSelRoomId,
}) => {
  const [isModal, setIsModal] = useState(false);
  //   console.log(obj.json);
  useEffect(() => {
    if (obj.json) setPlanJson(obj.json);
  }, []);

  const handleButton = (json) => {
    // console.log(json);
    setIsModal(true);
  };

  const ConvertFunction = (content) => {
    content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // ### 제목 변환
    content = content.replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>");
    // **굵게** 변환
    content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // *기울임* 변환
    content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");

    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };
  return (
    <>
      <div>{ConvertFunction(obj.message)}</div>
      {obj.json !== undefined && (
        <>
          <PlanButton
            type="primary"
            size={"small"}
            onClick={() => handleButton(obj.json)}
          >
            View Plan
          </PlanButton>
          {isModal && (
            <SOPModal
              json={obj.json}
              setIsModal={setIsModal}
              roomId={roomId}
              setIsNewChat={setIsNewChat}
              setSelRoomId={setSelRoomId}
            />
          )}
        </>
      )}
    </>
  );
};

export default GPTMsg;

const PlanButton = styled(Button)`
  font-size: 12px;
  margin-top: 10px;
  padding: 13px 15px;
`;
