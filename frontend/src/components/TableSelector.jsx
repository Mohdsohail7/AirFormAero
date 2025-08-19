export default function TableSelector({ tables, onSelect }) {
  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2">Select a Table</h2>
      <div className="grid grid-cols-2 gap-2">
        {tables.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="p-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
