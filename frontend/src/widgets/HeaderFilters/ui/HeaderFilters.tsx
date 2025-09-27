import { ROUTES } from "@/shared/consts/routeNames";
import { Dispatch, SetStateAction, useMemo } from "react";
import { IoAdd, IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { fetchRecipes } from "@/features/recipes/api/useGetRecipes";
import { fetchMenuItems } from "@/entities/menuItem/model/api";
import Portal from "@/shared/ui/Portal";

export type THeaderFilters = "menu" | "recipes" |"guidelines"

type Props = {
  value: THeaderFilters;
  onChange: (v: THeaderFilters) => void;
  inputQuery: string;
  onChangeInput: Dispatch<SetStateAction<string>>;
}

export function HeaderFilters(props: Props) {
  const { value, onChange, inputQuery, onChangeInput } = props;
  const queryClient = useQueryClient();

  const { saveData, canHover } = useMemo(() => {
    const sd = (navigator as any)?.connection?.saveData;
    const ch = typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)')?.matches;
    return { saveData: !!sd, canHover: !!ch };
  }, []);

  const prefetchMenu = (allowOnTouch = false) => {
    if (saveData) return;
    if (!allowOnTouch && !canHover) return;
    queryClient.prefetchQuery({ queryKey: ['menuItems'], queryFn: fetchMenuItems, staleTime: 30_000 });
  };
  const prefetchRecipes = (allowOnTouch = false) => {
    if (saveData) return;
    if (!allowOnTouch && !canHover) return;
    queryClient.prefetchQuery({ queryKey: ['recipesData'], queryFn: fetchRecipes, staleTime: 30_000 });
  };
  return (
    <div className="flex items-center justify-between gap-3 mb-4 w-full">
      <div className="flex items-center gap-2">
        <button
          onPointerEnter={() => prefetchMenu(false)}
          onFocus={() => prefetchMenu(false)}
          onTouchStart={() => prefetchMenu(true)}
          onPointerDown={() => prefetchMenu(true)}
          onClick={() => onChange("menu")}
          className={`p-2 px-3 flex rounded-full ${
            value === "menu" ? "bg-green-200 text-black" : "bg-gray-800 text-white"
          }`}
        >
          Menu
        </button>
        <button
          onPointerEnter={() => prefetchRecipes(false)}
          onFocus={() => prefetchRecipes(false)}
          onTouchStart={() => prefetchRecipes(true)}
          onPointerDown={() => prefetchRecipes(true)}
          onClick={() => onChange("recipes")}
          className={`p-2 px-3 flex rounded-full ${
            value === "recipes" ? "bg-green-200 text-black" : "bg-gray-800 text-white"
          }`}
        >
          Recipes
        </button>
        <button
          onClick={() => onChange("guidelines")}
          className={`p-2 px-3 flex rounded-full ${
            value === "guidelines" ? "bg-green-200 text-black" : "bg-gray-800 text-white"
          }`}
        >
          Guidelines
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to={ROUTES.createMenuItem}
          className="inline-flex items-center justify-center bg-yellow-200 rounded-full p-2 text-black"
        >
          <IoAdd className="text-xl" />
        </Link>
      </div>
      {/* Floating search pill via portal to body */}
      <Portal>
        <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 bg-gray-800/95 backdrop-blur text-white rounded-full px-3 py-2 shadow-lg w-[min(90vw,20rem)]">
            <IoSearch className="text-lg shrink-0 opacity-80" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => onChangeInput(e.target.value)}
              placeholder="Search..."
              className="bg-transparent focus:outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>
        </div>
      </Portal>
    </div>
  );
}
