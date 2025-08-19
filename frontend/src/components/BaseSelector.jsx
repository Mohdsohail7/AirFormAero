export default function BaseSelector({ bases, onSelect }) {
  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2">Select a Base</h2>
      <div className="grid grid-cols-2 gap-2">
        {bases.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelect(b)}
            className="p-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            {b.name}
          </button>
        ))}
      </div>
    </div>
  );
}
