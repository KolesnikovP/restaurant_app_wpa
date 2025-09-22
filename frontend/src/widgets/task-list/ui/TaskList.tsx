import TaskItem from "@/entities/task/ui/TaskItem";
import { TTask } from "@/entities/task/model/types";

type Props = {
  tasks: TTask[];
  onCheck: (id: number, completed: boolean) => void;
};

export function TaskList({ tasks, onCheck }: Props) {
  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <TaskItem
          id={task.id}
          key={index + "task"}
          body={task.body}
          completed={task.completed}
          priority={task.priority}
          onCheck={(completed) => onCheck(task.id, completed)}
        />
      ))}
    </div>
  );
}

