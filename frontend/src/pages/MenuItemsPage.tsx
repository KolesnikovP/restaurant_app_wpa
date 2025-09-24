import { useEffect, useState } from "react";
import { IoAdd, IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import Layout from "@/shared/ui/Layout";
import { fetchMenuItems } from "@/entities/menuItem/model/api";
import { HeaderFilters } from "@/widgets/HeaderFilters/ui/HeaderFilters";
import { TTask } from "@/entities/menuItem/model/types";
import { MenuItemsList } from "@/widgets/MenuItemsList";
import { ROUTES } from "@/shared/consts/routeNames";


function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<TTask[]>([]);
  const [filter, setFilter] = useState<"menu" | "guidelines">(
    "menu"
  );
  const [query, setQuery] = useState("");

  const getMenuItems = async () => {
    const menuItems = await fetchMenuItems();
    setMenuItems(menuItems);
  };

  const handleMenuItemCheck = (menuItemId: number, completed: boolean) => {
    setMenuItems((menuItems) =>
      menuItems.map((menuItem) => (menuItem.id === menuItemId ? { ...menuItem, completed } : menuItem))
    );
    if (navigator.onLine) {
      getMenuItems();
    }
  };

  useEffect(() => {
    getMenuItems();
  }, []);

  const filteredMenuItems = menuItems.filter((t) => {
    // placeholder category filters kept as-is; adapt to real fields later
    /* const byCategory =
      filter === "menu" ? t.completed === true :
      filter === "guidelines" ? t.completed === false : true; */
    const byQuery = query.trim().length === 0
      ? true
      : (t.body ?? "").toLowerCase().includes(query.toLowerCase());
    // return byCategory && byQuery;
    return byQuery;
  });

  return (
    <Layout>
      {/* tags header + create */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="shrink-0">
          <HeaderFilters value={filter} onChange={setFilter} />
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full justify-end">
          <div className="flex items-center gap-2 bg-gray-800 text-white rounded-full px-3 py-2 w-full max-w-xs">
            <IoSearch className="text-lg shrink-0 opacity-80" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
        </div>
      </div>

      {/* menuItems */}
      <MenuItemsList menuItems={filteredMenuItems} onCheck={handleMenuItemCheck} />
    </Layout>
  );
}

export default MenuItemsPage;
