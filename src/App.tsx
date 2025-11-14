import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import AuthPopUpChildren from "./components/authPopUp/authPopUpChildren";
import Header from "./components/header/header";
import Home from "./components/home/home";

function App() {
  const [cookies] = useCookies(["token"]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!cookies.token) {
      setShowPopup(true); 
    } else {
      setShowPopup(false); 
    }
  }, [cookies.token]);

  return (
    <>
      <Header />
      <Home />

      {showPopup && <AuthPopUpChildren />}
    </>
  );
}

export default App;
