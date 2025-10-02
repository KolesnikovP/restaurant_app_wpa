import { Card } from "@/shared/ui/Card";
import { useGetMenuItems } from "../api/useGetMenuItems";
import type { TMenuItem } from "../model/types";
import { MenuItem } from "@/entities/menuItem";
import { useNavigate } from "react-router-dom";

type Props = {
  selectedId: number | null;
  onSelectId: (id: number | null) => void;
  query?: string;
};

export function MenuList({ selectedId, onSelectId, query = "" }: Props) {
  const { data: items, isPending, error } = useGetMenuItems();
  const navigate = useNavigate();

  const filtered = items.filter((i) => {
    const hay = (i.name + " " + i.category + " " + i.ingredients.join(" ")).toLowerCase();
    return query.trim().length === 0 ? true : hay.includes(query.toLowerCase());
  });

  if (isPending) return <div className="opacity-70 text-sm">Loading menu items…</div>;
  if (error) return <div className="text-red-300 text-sm">Failed to load menu items</div>;

  const handleToggle = (r: TMenuItem) => {
    onSelectId(selectedId === r.id ? null : r.id);
  };

  const handleOnClickMenuItem = (id: number) => {
    navigate(`/menu-item/${id}`);
  };

  return (
    <div className="grid rounded-xl border border-white/10">
      {filtered.map((i) => {
        const isOpen = i.id === selectedId;
        return (
          <div key={i.id} className="grid  bg-white/5 pl-8 pr-8 hover:bg-white/10">
          
            <MenuItem
              id={i.id}
              title={i.name}
              subtitle={i.category}
              onClick={() => handleOnClickMenuItem(i.id)}
              description={i.ingredients[0] + " ..."}
            />
            {/* <Card
              title={i.name}
              subtitle={i.category}
              onClick={() => handleToggle(i)}
            >
              <div className="text-sm opacity-85">
                {isOpen ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {i.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="line-clamp-2">
                    {i.ingredients.join(" • ")}
                  </div>
                )}
              </div>
            </Card> */}
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div className="opacity-70 text-sm">No menu items match your query.</div>
      )}
    </div>
  );
}
