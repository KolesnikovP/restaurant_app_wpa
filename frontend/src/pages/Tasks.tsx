import { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import Layout from "@/shared/ui/Layout";
import { fetchTasks } from "@/entities/task/model/api";
import { TaskList } from "@/widgets/task-list/ui/TaskList";
import { HeaderFilters } from "@/widgets/header-filters/ui/HeaderFilters";
import { TTask } from "@/entities/task/model/types";
type TTask = {
  id: number;
  body: string;
  priority: number;
  completed: boolean;
};
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
      {/* tags header */}
      <HeaderFilters value={filter} onChange={setFilter} />

      <Link
          to="/create"
          className="bg-yellow-200 flex rounded-full h-fit my-auto p-2 
        text-black ml-auto"
        >
          <IoAdd className="text-xl" />
        </Link>

      {/* tasks */}
      <TaskList tasks={filteredTasks} onCheck={handleTaskCheck} />
    </Layout>
  );
}

export default Tasks;
