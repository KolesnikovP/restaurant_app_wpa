import { ROUTES } from "@/shared/consts/routeNames";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";
import { IoAdd } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { fetchRecipes } from "@/features/recipes/api/useGetRecipes";
import { fetchMenuItems } from "@/features/menuItems/api/useGetMenuItems";
import Portal from "@/shared/ui/Portal";
import { Card } from "@/shared/ui/Card";

type Props = { children?: React.ReactNode };

export function HeaderBar({ children }: Props) {
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Publish sticky header height as a CSS variable for other sticky elements
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      document.documentElement.style.setProperty('--header-height', `${rect.height}px`);
    });
    ro.observe(el);
    // Initial measurement
    const rect = el.getBoundingClientRect();
    document.documentElement.style.setProperty('--header-height', `${rect.height}px`);
    return () => ro.disconnect();
  }, []);

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
      {/* Sticky, safe-area-aware header */}
      <div ref={containerRef} className="sticky top-0 left-0 right-0 z-40">
        <div className="pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-2 max-w-lg mx-auto">
          <Card className="backdrop-blur shadow-lg w-full">
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
          {/* Sub-slot for per-page controls injected via Portal */}
          <div id="header-sub-slot" className="mt-2" />
        </Card>
        </div>
      </div>
      {/* No spacer needed with sticky positioning */}
    </>
  );
}
