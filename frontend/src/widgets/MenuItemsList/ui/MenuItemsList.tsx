import TaskItem from "@/entities/task/ui/TaskItem";
import { TTask } from "@/entities/task/model/types";

type Props = {
  menuItems: TTask[];
  onCheck: (id: number, completed: boolean) => void;
};

export function MenuItemsList({ menuItems, onCheck }: Props) {
  return (
    <div className="space-y-2">
      {menuItems.map((menuItem, index) => (
        <TaskItem
          id={menuItem.id}
          key={index + "menuItem"}
          body={menuItem.body}
          completed={menuItem.completed}
          priority={menuItem.priority}
          onCheck={(completed) => onCheck(menuItem.id, completed)}
        />
      ))}
    </div>
  );
}

