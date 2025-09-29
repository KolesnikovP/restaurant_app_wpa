import { useState } from "react";
import Layout from "@/shared/ui/Layout";
import { HeaderBar } from "@/widgets/HeaderBar";
import { MenuList } from "@/features/menuItems/ui/MenuList";

function MenuItemsPage() {
  const [inputQuery, setInputQeury] = useState("");
  
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  return (
    <Layout>
      <div className="flex items-center justify-between gap-2 mb-4">
        <HeaderBar inputQuery={inputQuery} onChangeInput={setInputQeury} />
      </div>
      <div className="fadeIn">
        <div className="grid gap-4">
          <MenuList selectedId={selectedRecipeId} onSelectId={setSelectedRecipeId} query={inputQuery} />
        </div>
      </div>
    </Layout>
  );
}

export default MenuItemsPage;
