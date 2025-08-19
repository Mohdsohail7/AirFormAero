export default function FormBuilder({ questions, setQuestions }) {
  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2">Form Builder</h2>
      {questions.map((q, idx) => (
        <div key={q.id} className="border rounded-lg p-3 mb-2">
          <input
            type="text"
            value={q.label}
            onChange={(e) => {
              const newQs = [...questions];
              newQs[idx].label = e.target.value;
              setQuestions(newQs);
            }}
            className="w-full border p-2 mb-2"
          />
          <p className="text-sm text-gray-500">Type: {q.kind}</p>
        </div>
      ))}
    </div>
  );
}
