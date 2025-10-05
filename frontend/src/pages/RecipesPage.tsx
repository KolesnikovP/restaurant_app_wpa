import { useState } from "react";
import Layout from "@/shared/ui/Layout";
import { RecipesList } from "@/features/recipes/ui/RecipesList";
import { SearchInput } from "@/shared/ui/SearchInput";
import Portal from "@/shared/ui/Portal";

function RecipesPage() {
  const [inputQuery, setInputQeury] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <Layout>
      <Portal container={typeof document !== 'undefined' ? document.getElementById('header-sub-slot') : null}>
        <div className="flex items-center justify-between gap-2">
          <SearchInput value={inputQuery} onChange={setInputQeury} />
        </div>
      </Portal>
      <div className="fadeIn">
        <div className="grid gap-4">
          <RecipesList selectedId={selectedId} onSelectId={setSelectedId} query={inputQuery} />
        </div>
      </div>
    </Layout>
  );
}

export default RecipesPage;
