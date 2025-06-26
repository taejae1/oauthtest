import styled from "styled-components";
import { Spin } from "antd";

const Loading = () => {
  return (
    <Container>
      <Spin size="large" />
    </Container>
  );
};

export default Loading;

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;
