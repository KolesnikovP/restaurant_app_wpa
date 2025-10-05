import { useState } from "react";
import Layout from "@/shared/ui/Layout";
import { HeaderBar } from "@/widgets/HeaderBar";
import { RecipesList } from "@/features/recipes/ui/RecipesList";
import { SearchInput } from "@/shared/ui/SearchInput";

function RecipesPage() {
  const [inputQuery, setInputQeury] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <Layout>
      <div className="flex items-center justify-between gap-2 mb-4">
        {/* <HeaderBar inputQuery={inputQuery} onChangeInput={setInputQeury} /> */}
        <SearchInput className="fixed top-25 left-50 right-50 z-40" value={inputQuery} onChange={setInputQeury}/>
      </div>
      <div className="fadeIn">
        <div className="grid gap-4">
          <RecipesList selectedId={selectedId} onSelectId={setSelectedId} query={inputQuery} />
        </div>
      </div>
    </Layout>
  );
}

export default RecipesPage;
