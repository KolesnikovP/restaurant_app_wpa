import { useState } from "react";
import Layout from "@/shared/ui/Layout";
import { HeaderFilters } from "@/widgets/HeaderFilters";
import { RecipesList } from "@/features/recipes/ui/RecipesList";

function RecipesPage() {
  const [inputQuery, setInputQeury] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <Layout>
      <div className="flex items-center justify-between gap-2 mb-4">
        <HeaderFilters inputQuery={inputQuery} onChangeInput={setInputQeury} />
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
