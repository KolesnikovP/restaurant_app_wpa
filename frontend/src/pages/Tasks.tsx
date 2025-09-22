import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import Layout from "@/shared/ui/Layout";
import { fetchTasks } from "@/entities/task/model/api";
import { TaskList } from "@/widgets/task-list/ui/TaskList";
import { HeaderFilters } from "@/widgets/header-filters/ui/HeaderFilters";
import { TTask } from "@/entities/task/model/types";


function Tasks() {
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [filter, setFilter] = useState<"todo" | "in-progress" | "done">(
    "todo"
  );

  const getTasks = async () => {
    const tasks = await fetchTasks();
    setTasks(tasks);
  };

  const handleTaskCheck = (taskId: number, completed: boolean) => {
    setTasks((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, completed } : task))
    );
    if (navigator.onLine) {
      getTasks();
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "done") return t.completed;
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

      {/* tasks */}
      <TaskList tasks={filteredTasks} onCheck={handleTaskCheck} />
    </Layout>
  );
}

export default Tasks;
