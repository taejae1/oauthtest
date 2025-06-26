import { Empty, Result } from "antd";
import { useState } from "react";
import styled from "styled-components";
import RoomList from "./RoomList";

const DetailView = ({ selected, activeTab, selName }) => {
  // const [isEmpty, setIsEmpty] = useState(true);

  if (activeTab === "users") {
    return (
      <RoomList selected={selected} activeTab={activeTab} selName={selName} />
    );
  } else if (activeTab === "faculty") {
    return (
      <Container>
        <Result status="warning" title="Service is being prepared. " />
      </Container>
    );
  } else if (activeTab === "admin") {
    return (
      <Container>
        {" "}
        <Result status="warning" title="Service is being prepared. " />
      </Container>
    );
  }
  return (
    <Container>
      {" "}
      <Result status="warning" title="Service is being prepared. " />
    </Container>
  );
};

export default DetailView;

const Container = styled.div`
  /* background-color: red; */
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100%;
`;
