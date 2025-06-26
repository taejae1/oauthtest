import { Button, Table, Popconfirm } from "antd";
import styled from "styled-components";
import supabase from "../supabase";
import Loading from "./Loading";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const SOPModal = ({
  json,
  setIsModal,
  type,
  roomId,
  setIsNewChat,
  setSelRoomId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef();

  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const today = `${year}-${month}-${day}`;

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSave = async () => {
    setIsLoading(true);
    await supabase
      .from("rooms")
      .update({ state: 4, plan: { ...json, date: today }, thread_id: "" })
      .eq("id", roomId)
      .select();

    setIsModal(false);
    setIsLoading(false);
    setIsNewChat(false);
    setSelRoomId("");
  };

  const onCapture = async () => {
    // 가로 방향으로 입력되며, 단위는 mm, 사이즈는 A4인 PDF를 생성한다.
    // const doc = new jsPDF("p", "mm", "a4");
    // ref로 입력된 대상을 canvas화 시키며, 해당 대상을 image/png 형식으로 URL화 한다.
    const canvas = await html2canvas(ref.current);
    const refImage = canvas.toDataURL("image/png");
    // const refImage = await html2canvas(ref.current).then((canvas) => {
    //   return canvas.toDataURL("image/png");
    // });

    const doc = new jsPDF("p", "mm", "a4");
    //pdf 가로 세로 사이즈
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    //이미지의 길이와 pdf의 가로길이가 다르므로 이미지 길이를 기준으로 비율을 구함
    const widthRatio = pageWidth / canvas.width;
    //비율에 따른 이미지 높이
    const customHeight = canvas.height * widthRatio;
    //pdf에 1장에 대한 이미지 추가
    doc.addImage(refImage, "png", 10, 10, pageWidth - 20, customHeight);
    //doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    //감소하면서 남은 길이 변수
    let heightLeft = customHeight;
    //증가하면서 이미지 자를 위치 변수
    let heightAdd = -pageHeight;

    // 한 페이지 이상일 경우
    while (heightLeft >= pageHeight) {
      //pdf페이지 추가
      doc.addPage();
      //남은 이미지를 추가
      doc.addImage(refImage, "png", 0, heightAdd, pageWidth, customHeight);
      //남은길이
      heightLeft -= pageHeight;
      //남은높이
      heightAdd -= pageHeight;
    }
    //문서저장
    doc.save("LearnMateAI-" + user.name + "-" + json.date + ".pdf");
  };

  return (
    <Body>
      <Container>
        <Nav>
          <Button onClick={() => setIsModal(false)}>Exit</Button>
          {type === "view" ? (
            <Button
              type="primary"
              style={{ marginLeft: 10, width: 100 }}
              onClick={onCapture}
            >
              Export PDF
            </Button>
          ) : (
            <Popconfirm
              title="Save the Statement of Purpose"
              description="Once you proceed, you will not be able to return."
              onConfirm={handleSave}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" style={{ marginLeft: 10, width: 120 }}>
                Save & Next
              </Button>
            </Popconfirm>
          )}
        </Nav>
        <Page>
          <div ref={ref}>
            <Section style={{ textAlign: "right" }}>
              <img
                src={`${process.env.PUBLIC_URL}/image/Logo1.png`}
                style={{ width: 200 }}
              />
            </Section>
            <Section>
              <div className="title"># Project Name.</div>
              <div className="main-title">{json.project_name}</div>
            </Section>

            <Section>
              <div className="info"># Learner : {user.name}</div>
              <div className="info">
                # Date of creation : {type === "view" ? json.date : today}
              </div>
            </Section>

            <Section>
              <div className="title"># Project Description</div>
              <div className="sub-title">{json.project_description}</div>
            </Section>

            <Section>
              <div className="title"># Recommended Learning Materials</div>
              {json.recommended_learning_materials.length !== 0 &&
                json.recommended_learning_materials.map((item, idx) => {
                  return (
                    <div className="sub-title" key={idx}>
                      - {item}
                    </div>
                  );
                })}
            </Section>

            <Section>
              <div className="title"># Project Schedule</div>
              <Table
                columns={columns}
                dataSource={json.learning_plan}
                pagination={false}
                rowKey={(row) => row.week}
              />
            </Section>
          </div>
        </Page>
      </Container>
      {isLoading && <Loading />}
    </Body>
  );
};

export default SOPModal;

const columns = [
  {
    title: "Week",
    dataIndex: "week",
    key: "week",
    width: 82,
    render: (text) => <div>Week {text}</div>,
  },
  {
    title: "Inquiry Question",
    dataIndex: "inquiry_question",
    key: "inquiry_question",
    // render: (text) => <div>Week {text}</div>,
  },
  {
    title: "Referense Materials",
    dataIndex: "reference_materials",
    key: "reference_materials",
    render: (item) => item.map((text, idx) => <div key={idx}>- {text}</div>),
  },
  {
    title: "Learning Activity",
    dataIndex: "learning_activity",
    key: "learning_activity",
  },
];

const Body = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 99;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const Container = styled.div`
  width: 1000px;
  max-height: 900px;
  background-color: white;
  border-radius: 15px;
  padding: 20px;

  -moz-box-sizing: border-box;
  box-sizing: border-box;
  overflow: auto;
`;

const Nav = styled.div`
  text-align: right;
  margin-bottom: 20px;
`;

const Page = styled.div`
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid black;
`;

const Section = styled.div`
  width: 100%;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  padding-top: 20px;
  padding-bottom: 20px;

  .main-title {
    font-size: 20px;
    font-weight: bold;
  }

  .title {
    font-size: 18px;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .sub-title {
  }

  .info {
    font-weight: bold;
    font-size: 16px;
  }
`;
