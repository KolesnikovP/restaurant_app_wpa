type Props = {
  value: "todo" | "in-progress" | "done";
  onChange: (v: "todo" | "in-progress" | "done") => void;
};

export function HeaderFilters({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onChange("todo")}
        className={`p-2 px-3 flex rounded-full ${
          value === "todo" ? "bg-green-200 text-black" : "bg-gray-800 text-white"
        }`}
      >
        Todo
      </button>
      <button
        onClick={() => onChange("in-progress")}
        className={`p-2 px-3 flex rounded-full ${
          value === "in-progress" ? "bg-green-200 text-black" : "bg-gray-800 text-white"
        }`}
      >
        In Progress
      </button>
      <button
        onClick={() => onChange("done")}
        className={`p-2 px-3 flex rounded-full ${
          value === "done" ? "bg-green-200 text-black" : "bg-gray-800 text-white"
        }`}
      >
        Done
      </button>
    </div>
  );
}

