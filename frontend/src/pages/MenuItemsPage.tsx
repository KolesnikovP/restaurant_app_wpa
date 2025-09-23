import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import Layout from "@/shared/ui/Layout";
import { fetchMenuItems } from "@/entities/menuItem/model/api";
import { HeaderFilters } from "@/widgets/header-filters/ui/HeaderFilters";
import { TTask } from "@/entities/menuItem/model/types";
import { MenuItemsList } from "@/widgets/MenuItemsList";
import { ROUTES } from "@/shared/consts/routeNames";


function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<TTask[]>([]);
  const [filter, setFilter] = useState<"drinks" | "refils" | "guidelines">(
    "guidelines"
  );

  const getTasks = async () => {
    const menuItems = await fetchMenuItems();
    setMenuItems(menuItems);
  };

  const handleTaskCheck = (menuItemId: number, completed: boolean) => {
    setMenuItems((menuItems) =>
      menuItems.map((menuItem) => (menuItem.id === menuItemId ? { ...menuItem, completed } : menuItem))
    );
    if (navigator.onLine) {
      getTasks();
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const filteredTasks = menuItems.filter((t) => {
    if (filter === "drinks") return t.completed === true; // completed
    if (filter === "refils") return t.completed === false; // not completed
    return true; // guidelines -> show all
  });

  return (
    <Layout>
      {/* tags header + create */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="shrink-0">
          <HeaderFilters value={filter} onChange={setFilter} />
        </div>
        <Link
          to={ROUTES.createMenuItem}
          className="shrink-0 inline-flex items-center justify-center bg-yellow-200 rounded-full p-2 text-black"
        >
          <IoAdd className="text-xl" />
        </Link>
      </div>

      {/* menuItems */}
      <MenuItemsList menuItems={filteredTasks} onCheck={handleTaskCheck} />
    </Layout>
  );
}

export default MenuItemsPage;
