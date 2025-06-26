import { Button, Input, Select } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import supabase from "../supabase";

const Preview = ({ title, subTitle, setIsStart, setRoomId }) => {
  const [input, setInput] = useState("");

  const [listLoading, setListLoading] = useState(true);

  const [list, setList] = useState([]);

  const [selectFaculty, setSelectFaculty] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const buildRoom = async () => {
    try {
      const { data } = await supabase
        .from("rooms")
        .insert([
          {
            fk_user_id: user.id,
            title: input,
            state: 1,
            plan: {},
            prev_plan: {},
            thread_id: "",
          },
        ])
        .select();

      setRoomId(data[0].id);

      if (selectFaculty !== "") {
        await supabase.from("invite").insert([
          {
            fk_user_id: user.id,
            fk_room_id: data[0].id,
            fk_faculty_id: selectFaculty,
          },
        ]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleNext = () => {
    if (input === "") {
      return;
    }
    buildRoom();
    setIsStart(true);
  };

  const getFacultyList = async () => {
    const { data, error } = await supabase.from("faculty").select();

    if (data.length > 0) {
      const arr = [{ value: "", label: "None" }];
      data.map((item) => {
        arr.push({ value: item.id, label: item.name });
      });
      setList(arr);
    }

    setListLoading(false);
  };

  useEffect(() => {
    getFacultyList();
  }, []);

  return (
    <Container>
      <Title>{title}</Title>
      <SubTitle>{subTitle}</SubTitle>
      <Input
        className="title"
        placeholder="ex) Computers / Software"
        onChange={(e) => setInput(e.target.value)}
      />

      {/* <Select
        placeholder="Select a faculty"
        loading={listLoading}
        style={{ width: 300, marginBottom: 20 }}
        options={list}
        onChange={(e) => setSelectFaculty(e)}
      /> */}

      <Button className="button" type="primary" block onClick={handleNext}>
        Next
      </Button>
    </Container>
  );
};

export default Preview;

const Container = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .title {
    width: 300px;
    margin-bottom: 10px;
  }
  .button {
    width: 300px;
  }
`;
const Title = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: #512d83;
  margin-bottom: 10px;
`;
const SubTitle = styled.div`
  color: #979797;
  margin-bottom: 15px;
  font-size: 16px;
`;
