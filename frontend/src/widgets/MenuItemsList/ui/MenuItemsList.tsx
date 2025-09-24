import { MenuItem } from "@/entities/menuItem";
import { TTask } from "@/entities/menuItem/model/types";

type Props = {
  menuItems: TTask[];
  onCheck: (id: number, completed: boolean) => void;
};

export function MenuItemsList({ menuItems, onCheck }: Props) {
  return (
    <div className="space-y-2">
      {menuItems.map((menuItem, index) => (
        <MenuItem
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
