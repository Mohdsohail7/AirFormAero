import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FormBuilder = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [bases, setBases] = useState([]);
  const [selectedBase, setSelectedBase] = useState(null);

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const [fields, setFields] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Fetch bases on load
  useEffect(() => {
    if (userId) {
      fetch(`${process.env.REACT_APP_BASE_URL}/api/airtable/bases/${userId}`)
        .then((res) => res.json())
        .then((data) => setBases(data))
        .catch((err) => console.error(err));
    }
  }, [userId]);

  // Fetch tables when a base is selected
  useEffect(() => {
    if (selectedBase) {
      fetch(
        `${process.env.REACT_APP_BASE_URL}/api/airtable/tables/${userId}/${selectedBase.id}`
      )
        .then((res) => res.json())
        .then((data) => setTables(data))
        .catch((err) => console.error(err));
    }
  }, [selectedBase, userId]);

  // Fetch fields when a table is selected
  useEffect(() => {
    if (selectedTable) {
      fetch(
        `${process.env.REACT_APP_BASE_URL}/api/airtable/fields/${userId}/${selectedBase.id}/${selectedTable.id}`
      )
        .then((res) => res.json())
        .then((data) => setFields(data))
        .catch((err) => console.error(err));
    }
  }, [selectedTable, selectedBase, userId]);

  const toggleQuestion = (field) => {
    // Add or remove field from questions
    const exists = questions.find((q) => q.id === field.id);
    if (exists) {
      setQuestions(questions.filter((q) => q.id !== field.id));
    } else {
      setQuestions([
        ...questions,
        { ...field, label: field.name, conditions: [] },
      ]);
    }
  };

  const updateLabel = (id, label) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, label } : q)));
  };

  // Add conditional logic for a question
  const addCondition = (questionId, triggerQuestionId, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              conditions: [...q.conditions, { triggerQuestionId, value }],
            }
          : q
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Form Builder</h1>

      {/* Select Base */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Select Base:</label>
        <select
          className="border p-2 rounded w-full"
          onChange={(e) =>
            setSelectedBase(bases.find((b) => b.id === e.target.value))
          }
        >
          <option value="">--Select Base--</option>
          {bases.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Select Table */}
      {selectedBase && (
        <div className="mb-4">
          <label className="block font-semibold mb-2">Select Table:</label>
          <select
            className="border p-2 rounded w-full"
            onChange={(e) =>
              setSelectedTable(tables.find((t) => t.id === e.target.value))
            }
          >
            <option value="">--Select Table--</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Fields & Questions */}
      {selectedTable && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Fields</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {fields.map((field) => (
              <div
                key={field.id}
                className={`p-4 border rounded cursor-pointer ${
                  questions.find((q) => q.id === field.id)
                    ? "bg-blue-100 border-blue-400"
                    : "bg-white"
                }`}
                onClick={() => toggleQuestion(field)}
              >
                {field.name} ({field.type})
              </div>
            ))}
          </div>

          {questions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-2">Questions</h2>
              {questions.map((q) => (
                <div key={q.id} className="mb-4">
                  <input
                    type="text"
                    value={q.label}
                    onChange={(e) => updateLabel(q.id, e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  {/* Conditional Logic */}
                  <div className="mt-2">
                    <h3 className="font-semibold mb-1">Conditional Logic</h3>
                    {questions
                      .filter((prev) => prev.id !== q.id)
                      .map((prev) => (
                        <div
                          key={prev.id}
                          className="flex items-center mb-2 space-x-2"
                        >
                          <span>{prev.label} = </span>
                          <input
                            type="text"
                            placeholder="Value"
                            className="border p-1 rounded flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addCondition(q.id, prev.id, e.target.value);
                                e.target.value = "";
                              }
                            }}
                          />
                        </div>
                      ))}

                    {q.conditions.length > 0 && (
                      <ul className="text-sm mt-2">
                        {q.conditions.map((c, idx) => (
                          <li key={idx}>
                            Show if{" "}
                            {
                              questions.find(
                                (ques) => ques.id === c.triggerQuestionId
                              )?.label
                            }{" "}
                            = {c.value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
