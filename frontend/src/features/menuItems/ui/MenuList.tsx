import { Card } from "@/shared/ui/Card";
import { useGetMenuItems } from "../api/useGetMenuItems";
import type { TMenuItem } from "../model/types";

type Props = {
  selectedId: number | null;
  onSelectId: (id: number | null) => void;
  query?: string;
};

export function MenuList({ selectedId, onSelectId, query = "" }: Props) {
  const { data: items, isPending, error } = useGetMenuItems();

  const filtered = items.filter((i) => {
    const hay = (i.name + " " + i.category + " " + i.ingredients.join(" ")).toLowerCase();
    return query.trim().length === 0 ? true : hay.includes(query.toLowerCase());
  });

  if (isPending) return <div className="opacity-70 text-sm">Loading menu items…</div>;
  if (error) return <div className="text-red-300 text-sm">Failed to load menu items</div>;

  const handleToggle = (r: TMenuItem) => {
    onSelectId(selectedId === r.id ? null : r.id);
  };

  return (
    <div className="grid gap-3">
      {filtered.map((i) => {
        const isOpen = i.id === selectedId;
        return (
          <div key={i.id} className="grid gap-2">
            <Card
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
            </Card>
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div className="opacity-70 text-sm">No menu items match your query.</div>
      )}
    </div>
  );
}

