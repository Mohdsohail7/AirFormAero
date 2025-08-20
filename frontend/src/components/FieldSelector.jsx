export default function FieldSelector({ fields, selected, toggleField }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Select Questions</h2>
      <ul className="space-y-2">
        {fields.map((f) => {
          // Only show supported field types
          const supported = [
            "singleLineText",
            "longText",
            "singleSelect",
            "multipleSelects",
            "attachment", // ✅ support attachments
          ];
          if (!supported.includes(f.type)) return null;

          return (
            <li
              key={f.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>
                {f.name}{" "}
                <span className="text-gray-500 text-sm">({f.type})</span>
              </span>
              <button
                onClick={() => toggleField(f)}
                className={`px-2 py-1 rounded ${
                  selected.some((q) => q.id === f.id)
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {selected.some((q) => q.id === f.id) ? "Remove" : "Add"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
