import { useState } from "react";
import Layout from "@/shared/ui/Layout";
import { HeaderBar } from "@/widgets/HeaderBar";
import { MenuList } from "@/features/menuItems/ui/MenuList";
import Portal from "@/shared/ui/Portal";
import { SearchInput } from "@/shared/ui/SearchInput";

function MenuItemsPage() {
  const [inputQuery, setInputQeury] = useState("");
  
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  return (
    <Layout>
      <Portal container={typeof document !== 'undefined' ? document.getElementById('header-sub-slot') : null}>
        <div className="flex items-center justify-between gap-2">
          <SearchInput value={inputQuery} onChange={setInputQeury} />
        </div>
      </Portal>
      <div className="fadeIn">
        <div className="grid gap-4">
          <MenuList selectedId={selectedRecipeId} onSelectId={setSelectedRecipeId} query={inputQuery} />
        </div>
      </div>
    </Layout>
  );
}

export default MenuItemsPage;
