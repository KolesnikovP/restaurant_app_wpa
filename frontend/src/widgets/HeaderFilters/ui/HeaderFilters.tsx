type Props = {
  value: "menu" | "drinks" | "refils" | "guidelines";
  onChange: (v: "menu" | "drinks" | "refils" | "guidelines") => void;
};

export function HeaderFilters({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onChange("menu")}
        className={`p-2 px-3 flex rounded-full ${
          value === "menu" ? "bg-green-200 text-black" : "bg-gray-800 text-white"
        }`}
      >
        Menu
      </button>
      <button
        onClick={() => onChange("drinks")}
        className={`p-2 px-3 flex rounded-full ${
          value === "drinks" ? "bg-green-200 text-black" : "bg-gray-800 text-white"
        }`}
      >
        Drinks
      </button>
      <button
        onClick={() => onChange("refils")}
        className={`p-2 px-3 flex rounded-full ${
          value === "refils" ? "bg-green-200 text-black" : "bg-gray-800 text-white"
        }`}
      >
        Refils
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
  );
}

