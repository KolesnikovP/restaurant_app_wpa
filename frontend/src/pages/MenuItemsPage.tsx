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
  const [filter, setFilter] = useState<"menu" | "drinks" | "refils" | "guidelines">(
    "menu"
  );

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

  /* const filteredMenuItems = menuItems.filter((t) => {
    if (filter === "drinks") return t.completed === true; // completed
    if (filter === "refils") return t.completed === false; // not completed
    return true; // guidelines -> show all
  }); */

  return (
    <Layout>
      {/* tags header + create */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="shrink-0">
          <HeaderFilters value={filter} onChange={setFilter} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex items-center justify-center bg-gray-800 rounded-full p-2 text-white"
            // TODO: wire up onClick to open search UI when available
          >
            <IoSearch className="text-xl" />
          </button>
          <Link
            to={ROUTES.createMenuItem}
            className="inline-flex items-center justify-center bg-yellow-200 rounded-full p-2 text-black"
          >
            <IoAdd className="text-xl" />
          </Link>
        </div>
      </div>

      {/* menuItems */}
      <MenuItemsList menuItems={menuItems} onCheck={handleMenuItemCheck} />
    </Layout>
  );
}

export default MenuItemsPage;
