import { Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

const GoogleLoginButton = ({ onClick }) => (
  <Button
    icon={<GoogleOutlined />}
    style={{ width: "100%", marginTop: 10 }}
    onClick={onClick}
  >
    Google로 로그인
  </Button>
);

export default GoogleLoginButton; 