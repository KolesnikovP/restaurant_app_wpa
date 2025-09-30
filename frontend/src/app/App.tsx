import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateMenuItem from "@/pages/CreateMenuItem";
import Wellcome from "@/pages/Wellcome";
import RecipesPage from "@/pages/RecipesPage";
import GuidelinesPage from "@/pages/GuidelinesPage";
import { ROUTES } from "@/shared/consts/routeNames";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { MenuItemsPage } from "@/pages/MenuItemsPage";

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
  return (
    <Routes>
      <Route path={ROUTES.root} element={<Wellcome />} />
      <Route path={ROUTES.createMenuItem} element={<CreateMenuItem />} />
      <Route path={ROUTES.menuItems} element={<MenuItemsPage />} />
      <Route path={ROUTES.recipes} element={<RecipesPage />} />
      <Route path={ROUTES.guidelines} element={<GuidelinesPage />} />
    </Routes>
  );
};

export default App;
