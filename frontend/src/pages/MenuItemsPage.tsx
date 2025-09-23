import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import Layout from "@/shared/ui/Layout";
import { fetchMenuItems } from "@/entities/task/model/api";
import { HeaderFilters } from "@/widgets/header-filters/ui/HeaderFilters";
import { TTask } from "@/entities/task/model/types";
import { MenuItemsList } from "@/widgets/MenuItemsList";


function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<TTask[]>([]);
  const [filter, setFilter] = useState<"drinks" | "refils" | "guidelines">(
    "drinks"
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
    if (filter === "drinks") {
      return t.completed;
    }
    // both "todo" and "in-progress" map to not completed with current schema
    return !t.completed;
  });

  return (
    <Layout>
      {/* tags header + create */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="shrink-0">
          <HeaderFilters value={filter} onChange={setFilter} />
        </div>
        <Link
          to="/create"
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
