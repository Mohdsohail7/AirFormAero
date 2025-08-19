import { useState } from "react";

export default function FormViewer({ form, onSubmit }) {
  const [answers, setAnswers] = useState({});

  const handleChange = (fid, val) =>
    setAnswers((prev) => ({ ...prev, [fid]: val }));

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      {form.questions.map((q) => (
        <div key={q.fieldId} className="mb-3">
          <label className="block font-semibold mb-1">{q.label}</label>
          {q.kind === "short_text" && (
            <input
              className="w-full border p-2"
              onChange={(e) => handleChange(q.fieldId, e.target.value)}
            />
          )}
          {q.kind === "long_text" && (
            <textarea
              className="w-full border p-2"
              onChange={(e) => handleChange(q.fieldId, e.target.value)}
            />
          )}
          {q.kind === "single_select" && (
            <select
              className="w-full border p-2"
              onChange={(e) => handleChange(q.fieldId, e.target.value)}
            >
              <option value="">Select</option>
              {q.options.map((o) => (
                <option key={o.id} value={o.name}>
                  {o.name}
                </option>
              ))}
            </select>
          )}
          {q.kind === "multi_select" && (
            <select
              multiple
              className="w-full border p-2"
              onChange={(e) =>
                handleChange(q.fieldId, Array.from(e.target.selectedOptions).map(o => o.value))
              }
            >
              {q.options.map((o) => (
                <option key={o.id} value={o.name}>
                  {o.name}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      <button
        onClick={() => onSubmit(answers)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}
