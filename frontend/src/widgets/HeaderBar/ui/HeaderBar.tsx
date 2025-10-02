import { ROUTES } from "@/shared/consts/routeNames";
import { Dispatch, SetStateAction, useMemo } from "react";
import { IoAdd } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { fetchRecipes } from "@/features/recipes/api/useGetRecipes";
import { fetchMenuItems } from "@/features/menuItems/api/useGetMenuItems";
import Portal from "@/shared/ui/Portal";
import { SearchInput } from "@/shared/ui/SearchInput";
import { Card } from "@/shared/ui/Card";

type Props = {
  inputQuery: string;
  onChangeInput: Dispatch<SetStateAction<string>>;
}

export function HeaderBar(props: Props) {
  const { inputQuery, onChangeInput } = props;
  const queryClient = useQueryClient();

  const { saveData, canHover } = useMemo(() => {
    const sd = (navigator as any)?.connection?.saveData;
    const ch = typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)')?.matches;
    return { saveData: !!sd, canHover: !!ch };
  }, []);

  const prefetchMenu = (allowOnTouch = false) => {
    if (saveData) return;
    if (!allowOnTouch && !canHover) return;
    // Prefetch Menu items data (Menu tab consumes menu-items backend)
    queryClient.prefetchQuery({ queryKey: ['menuItems'], queryFn: fetchMenuItems, staleTime: 30_000 });
  };
  const prefetchRecipes = (allowOnTouch = false) => {
    if (saveData) return;
    if (!allowOnTouch && !canHover) return;
    queryClient.prefetchQuery({ queryKey: ['recipesData'], queryFn: fetchRecipes, staleTime: 30_000 });
  };
  return (
    <>
      {/* Fixed header centered to match Layout width; respects safe-area */}
      <div className="fixed top-[calc(env(safe-area-inset-top)+1rem)] left-1/2 -translate-x-1/2 z-40 w-[min(90vw,36rem)]">
        <Card className="backdrop-blur shadow-lg">
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              <NavLink
                to={ROUTES.menuItems}
                onPointerEnter={() => prefetchMenu(false)}
                onFocus={() => prefetchMenu(false)}
                onTouchStart={() => prefetchMenu(true)}
                onPointerDown={() => prefetchMenu(true)}
                className={({ isActive }) =>
                  `p-2 px-3 text-sm flex rounded-xl border transition-colors ${
                    isActive
                      ? "bg-white text-black border-white"
                      : "border-white/20 bg-transparent hover:bg-white/10 text-white"
                  }`
                }
              >
                Menu
              </NavLink>
              <NavLink
                to={ROUTES.recipes}
                onPointerEnter={() => prefetchRecipes(false)}
                onFocus={() => prefetchRecipes(false)}
                onTouchStart={() => prefetchRecipes(true)}
                onPointerDown={() => prefetchRecipes(true)}
                className={({ isActive }) =>
                  `p-2 px-3 text-sm flex rounded-xl border transition-colors ${
                    isActive
                      ? "bg-white text-black border-white"
                      : "border-white/20 bg-transparent hover:bg-white/10 text-white"
                  }`
                }
              >
                Recipes
              </NavLink>
              <NavLink
                to={ROUTES.guidelines}
                className={({ isActive }) =>
                  `p-2 px-3 text-sm flex rounded-xl border transition-colors ${
                    isActive
                      ? "bg-white text-black border-white"
                      : "border-white/20 bg-transparent hover:bg-white/10 text-white"
                  }`
                }
              >
                Guidelines
              </NavLink>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.createMenuItem}
                className="inline-flex items-center justify-center rounded-full p-2 bg-white text-black shadow-sm hover:bg-white"
                aria-label="Create menu item"
              >
                <IoAdd className="text-xl" />
              </Link>
            </div>
          </div>
          <div className="mt-3">
            <SearchInput value={inputQuery} onChange={onChangeInput} placeholder="Search..." />
          </div>
        </Card>
      </div>
      {/* Spacer to offset fixed header height */}
      <div className="h-36" />
    </>
  );
}
