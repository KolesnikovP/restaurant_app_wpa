import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import CreateMenuItem from "@/pages/CreateMenuItem";
import Wellcome from "@/pages/Wellcome";
import MenuItemsPage from "@/pages/MenuItemsPage";
import { ROUTES } from "@/shared/consts/routeNames";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools/>
      <BrowserRouter>
        <Content />
      </BrowserRouter>
    </QueryClientProvider>

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
        <Route path={ROUTES.createMenuItem} element={<CreateMenuItem />} />
        <Route path={ROUTES.menuItems} element={<MenuItemsPage />} />
      </Routes>
    </div>
  );
};

export default App;
