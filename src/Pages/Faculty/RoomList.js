import { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "../../Components/Loading";
import { Badge, Tabs } from "antd";
import supabase from "../../supabase";
import RoomListView from "./RoomListView";
import InviteListView from "./InviteListView";

const RoomList = ({ roomId, setRoomId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("rooms");
  const [rooms, setRooms] = useState([]);
  const [invite, setInvite] = useState([]);

  let info = JSON.parse(localStorage.getItem("faculty"));

  const getRoomList = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("invite")
      .select("id,fk_user_id, fk_room_id ,state, users(id,name), rooms(*)")
      .eq("fk_faculty_id", info.id)
      .eq("state", true);

    setRooms(data);
    setIsLoading(false);
  };

  const getInviteList = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("invite")
      .select("id,fk_user_id, fk_room_id ,state, users(id,name), rooms(*)")
      .eq("fk_faculty_id", info.id)
      .eq("state", false);

    setInvite(data);
    setIsLoading(false);
  };

  const onChange = (key) => {
    setActiveTab(key);
    if (key === "rooms") {
      getRoomList();
    }
    if (key === "invite") {
      getInviteList();
    }
  };

  const items = [
    {
      key: "rooms",
      label: "Rooms",
      children: (
        <RoomListView
          data={rooms}
          getRoomList={getRoomList}
          setRoomId={setRoomId}
        />
      ),
    },
    {
      key: "invite",
      label: (
        <Badge count={invite.length} offset={[10,0]}>

        Invite
        </Badge>
      ),
      children: (
          <InviteListView
            data={invite}
            getInviteList={getInviteList}
            onChange={onChange}
            />
      ),
    },
  ];

  useEffect(() => {
    onChange(activeTab);
  }, []);

  return (
    <Container>
      <Tabs activeKey={activeTab} items={items} onChange={onChange} />

      {isLoading && <Loading />}
    </Container>
  );
};

export default RoomList;

const Container = styled.div``;
