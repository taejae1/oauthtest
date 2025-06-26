import styled from "styled-components";

const Prompt = () => {
  return (
    <Container>
      <Card>asdf</Card>
    </Container>
  );
};

export default Prompt;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  width: 700px;
  height: 900px;
  border-radius: 15px;
  padding: 25px;
  background-color: white;
`;
