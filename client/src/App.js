import "./App.css";
import { colors, hFontPrototype } from "./theme/Theme";
import useWebSocket from "react-use-websocket";
import { CookiesProvider, useCookies } from "react-cookie";
import useAuth from "./hooks/useAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  const { cookies, login, logout } = useAuth();
  // const onWsClose = (e) => {
  //   if (e.reason === "unauth") {
  //     logout();
  //   }
  //   console.error(e);
  // };
  // const onWsOpen = () => {
  //   //sendJsonMessage({ token });
  // };
  // const onWsMessage = (e) => {
  //   const data = JSON.parse(e?.data);
  //   if (!data) return;
  //   if (data.error) {
  //     console.error("FETCH ERROR:", data.error);
  //     if (data.error === "access to this data is denied") {
  //       navigate("/main");
  //     }
  //     return;
  //   }

  //   console.info(data);
  //   setDataset(data.message);
  // };

  // const { sendJsonMessage } = useWebSocket(socketUrl, {
  //   onOpen: onWsOpen,
  //   onClose: onWsClose,
  //   onMessage: onWsMessage,
  //   queryParams: { token: cookies?.token },
  //   shouldReconnect: (closeEvent) => true,
  // });

  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <div
        className="App"
        style={{ height: "100%", backgroundColor: colors.BACKGROUND }}
      >
        {cookies?.token ? <Home logout={logout} /> : <Login login={login} />}
      </div>
    </CookiesProvider>
  );
}

export default App;
