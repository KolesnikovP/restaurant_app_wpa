import { useMemo } from "react";
import Layout from "@/shared/ui/Layout";
import { useParams, useLocation, Link } from "react-router-dom";
import { useGetMenuItems } from "@/features/menuItems/api/useGetMenuItems";
import { useGetRecipes } from "@/features/recipes/api/useGetRecipes";
import { Card } from "@/shared/ui/Card";
import { ROUTES } from "@/shared/consts/routeNames";

function DetailedItemPage() {
  const params = useParams();
  const location = useLocation();
  const isMenuItem = location.pathname.startsWith('/menu-item/');
  const id = Number(params.id);

  const { data: menuItems = [], isPending: pendingMenu } = useGetMenuItems();
  const { data: recipes = [], isPending: pendingRecipes } = useGetRecipes();

  const item = useMemo(() => {
    if (!Number.isFinite(id)) return null;
    if (isMenuItem) {
      return menuItems.find(m => m.id === id) ?? null;
    }
    return recipes.find(r => r.id === id) ?? null;
  }, [id, isMenuItem, menuItems, recipes]);

  return (
    <Layout>
      <div className="flex items-center justify-between gap-2 mb-4">
        <Link to={isMenuItem ? ROUTES.menuItems : ROUTES.recipes} className="text-sm underline opacity-80">Back</Link>
      </div>
      <div className="fadeIn">
        {!Number.isFinite(id) && (
          <div className="text-red-300">Invalid ID</div>
        )}
        {(pendingMenu || pendingRecipes) && (
          <div className="opacity-70 text-sm">Loading…</div>
        )}
        {item && isMenuItem && (
          <Card title={item.name} subtitle={item.category}>
            <ul className="list-disc pl-5 space-y-1 text-sm opacity-90">
              {item.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </Card>
        )}
        {item && !isMenuItem && (
          <Card title={item.recipe_name} subtitle={`Shelf life: ${item.shelf_life}`}>
            <div className="text-sm opacity-90 whitespace-pre-wrap">{item.description}</div>
            <div className="mt-2 text-xs opacity-70 flex gap-3">
              <span>Priority: {item.priority}</span>
              <span>Status: {item.completed ? 'Completed' : 'Open'}</span>
              <span>Updated: {new Date(item.updated_at).toLocaleDateString()}</span>
            </div>
          </Card>
        )}
        {!pendingMenu && !pendingRecipes && !item && (
          <div className="opacity-70">Not found.</div>
        )}
      </div>
    </Layout>
  );
}

export default DetailedItemPage;
