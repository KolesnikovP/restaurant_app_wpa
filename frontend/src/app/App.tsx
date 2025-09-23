import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Create from "@/pages/Create";
import Wellcome from "@/pages/Wellcome";
import MenuItemsPage from "@/pages/MenuItemsPage";

function App() {
  return (
    <BrowserRouter>
      <Content />
    </BrowserRouter>
  );
}

const Content = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage("fadeOut");
  }, [location, displayLocation]);

  return (
    <div
      className={transitionStage}
      onAnimationEnd={() => {
        if (transitionStage === "fadeOut") {
          setDisplayLocation(location);
          setTransistionStage("fadeIn");
        }
      }}
    >
      <Routes location={displayLocation}>
        <Route path="/" element={<Wellcome />} />
        <Route path="/create" element={<Create />} />
        <Route path="/menu-items" element={<MenuItemsPage />} />
      </Routes>
    </div>
  );
};

export default App;

