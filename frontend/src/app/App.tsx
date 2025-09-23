import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Create from "@/pages/Create";
import Wellcome from "@/pages/Wellcome";
import MenuItemsPage from "@/pages/MenuItemsPage";
import { ROUTES } from "@/shared/consts/routeNames";

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
        <Route path={ROUTES.root} element={<Wellcome />} />
        <Route path={ROUTES.createMenuItem} element={<Create />} />
        <Route path={ROUTES.menuItems} element={<MenuItemsPage />} />
      </Routes>
    </div>
  );
};

export default App;
