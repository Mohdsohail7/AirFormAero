export default function FieldSelector({ fields, selected, toggleField }) {
  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2">Choose Fields</h2>
      {fields.map((f) => (
        <div key={f.id} className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            checked={selected.some((s) => s.id === f.id)}
            onChange={() => toggleField(f)}
          />
          <span>{f.name} ({f.kind})</span>
        </div>
      ))}
    </div>
  );
}
