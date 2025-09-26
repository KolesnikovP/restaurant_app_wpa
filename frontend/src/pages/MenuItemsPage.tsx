import { useState } from "react";
import Layout from "@/shared/ui/Layout";
import { fetchMenuItems } from "@/entities/menuItem/model/api";
import { TTask } from "@/entities/menuItem/model/types";
import { MenuItemsList } from "@/widgets/MenuItemsList";
import { HeaderFilters, THeaderFilters } from "@/widgets/HeaderFilters";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RecipesList } from "@/features/recipes/ui/RecipesList";

function MenuItemsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<THeaderFilters>(
    "menu"
  );
  const [inputQuery, setInputQeury] = useState("");
  
  // Conditional queries per header filter
  const {
    data: menuItemsData = [],
  } = useQuery<TTask[]>({
    queryKey: ["menuItems"],
    queryFn: fetchMenuItems,
    enabled: filter === "menu",
    staleTime: 30_000,
  });

  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  const handleMenuItemCheck = (menuItemId: number, completed: boolean) => {
    // optimistic update in cache
    queryClient.setQueryData<TTask[] | undefined>(["menuItems"], (prev) =>
      (prev ?? []).map((mi) => (mi.id === menuItemId ? { ...mi, completed } : mi))
    );
    if (navigator.onLine) {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    }
  };

  const filteredMenuItems = menuItemsData.filter((t) => {
    // placeholder category filters kept as-is; adapt to real fields later
    /* const byCategory =
      filter === "menu" ? t.completed === true :
      filter === "guidelines" ? t.completed === false : true; */
    const byQuery = inputQuery.trim().length === 0
      ? true
      : (t.body ?? "").toLowerCase().includes(inputQuery.toLowerCase());
    // return byCategory && byQuery;
    return byQuery;
  });

  return (
    <Layout>
      {/* tags header + create */}
      <div className="flex items-center justify-between gap-2 mb-4">
          <HeaderFilters  inputQuery={inputQuery} onChangeInput={setInputQeury} value={filter} onChange={setFilter} />
        {/* <div className="flex items-center gap-2 shrink-0 w-full justify-end">
          <div className="flex items-center gap-2 bg-gray-800 text-white rounded-full px-3 py-2 w-full max-w-xs">
            <IoSearch className="text-lg shrink-0 opacity-80" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQeury(e.target.value)}
              placeholder="Search..."
              className="bg-transparent focus:outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>
          <Link
            to={ROUTES.createMenuItem}
            className="inline-flex items-center justify-center bg-yellow-200 rounded-full p-2 text-black"
          >
            <IoAdd className="text-xl" />
          </Link>
        </div> */}
      </div>

      {/* Lists */}
      {filter === "menu" && (
        <MenuItemsList menuItems={filteredMenuItems} onCheck={handleMenuItemCheck} />
      )}
      {filter === "recipes" && (
        <div className="grid gap-4">
          <RecipesList selectedId={selectedRecipeId} onSelectId={setSelectedRecipeId} query={inputQuery} />
        </div>
      )}
      {filter === "guidelines" && (
        <div className="text-sm opacity-75">Guidelines: no data source yet.</div>
      )}
    </Layout>
  );
}

export default MenuItemsPage;
