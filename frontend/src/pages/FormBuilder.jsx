import { useState } from "react";

export default function FormBuilder({ questions, setQuestions }) {
  const updateQuestion = (id, updates) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q.id} className="border p-3 rounded">
          <label className="font-semibold">{q.label}</label>

          {/* Rename */}
          <input
            type="text"
            value={q.label}
            onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
            className="block w-full border p-1 my-2"
          />

          {/* Required toggle */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={q.required || false}
              onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
            />
            Required
          </label>

          {/* Conditional logic builder */}
          <div className="mt-2 p-2 bg-gray-50 rounded">
            <p className="text-sm font-medium mb-1">Show this question only if:</p>
            {(q.showIf || []).map((rule, i) => (
              <div key={i} className="flex gap-2 items-center mb-1">
                <select
                  value={rule.whenFieldId}
                  onChange={(e) => {
                    const newRules = [...q.showIf];
                    newRules[i].whenFieldId = e.target.value;
                    updateQuestion(q.id, { showIf: newRules });
                  }}
                  className="border p-1"
                >
                  <option value="">Select Question</option>
                  {questions
                    .filter((x) => x.id !== q.id) // don’t allow self-reference
                    .map((other) => (
                      <option key={other.id} value={other.id}>
                        {other.label}
                      </option>
                    ))}
                </select>

                <select
                  value={rule.operator}
                  onChange={(e) => {
                    const newRules = [...q.showIf];
                    newRules[i].operator = e.target.value;
                    updateQuestion(q.id, { showIf: newRules });
                  }}
                  className="border p-1"
                >
                  <option value="equals">equals</option>
                  <option value="includes">includes</option>
                </select>

                <input
                  type="text"
                  value={rule.value}
                  onChange={(e) => {
                    const newRules = [...q.showIf];
                    newRules[i].value = e.target.value;
                    updateQuestion(q.id, { showIf: newRules });
                  }}
                  placeholder="Value"
                  className="border p-1"
                />

                <button
                  className="text-red-500"
                  onClick={() => {
                    const newRules = q.showIf.filter((_, idx) => idx !== i);
                    updateQuestion(q.id, { showIf: newRules });
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              className="text-blue-600 text-sm mt-1"
              onClick={() =>
                updateQuestion(q.id, {
                  showIf: [...(q.showIf || []), { whenFieldId: "", operator: "equals", value: "" }],
                })
              }
            >
              + Add condition
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
