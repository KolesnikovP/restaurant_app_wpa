import { ROUTES } from "@/shared/consts/routeNames";
import { Dispatch, SetStateAction } from "react";
import { IoAdd, IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";

type Props = {
  value: "menu" | "guidelines";
  onChange: (v: "menu" | "guidelines") => void;
  inputQuery: string;
  onChangeInput: Dispatch<SetStateAction<string>>;
}

export function HeaderFilters(props: Props) {
  const { value, onChange, inputQuery, onChangeInput } = props;
  return (
    <div className="flex items-center justify-between gap-3 mb-4 w-full">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange("menu")}
          className={`p-2 px-3 flex rounded-full ${
            value === "menu" ? "bg-green-200 text-black" : "bg-gray-800 text-white"
          }`}
        >
          Menu
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
        <div className="flex items-center gap-2 bg-gray-800 text-white rounded-full px-3 py-2 w-full max-w-xs">
          <IoSearch className="text-lg shrink-0 opacity-80" />
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => onChangeInput(e.target.value)}
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-sm w-full placeholder:text-gray-400"
          />
        </div>
        <Link
          to={ROUTES.createMenuItem}
          className="inline-flex items-center justify-center bg-yellow-200 rounded-full p-2 text-black"
        >
          <IoAdd className="text-xl" />
        </Link>
      </div>
    </div>
  );
}
