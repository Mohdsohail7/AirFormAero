import React, { useEffect, useState } from "react";

const FormViewer = ({ form }) => {
  const [responses, setResponses] = useState({});
  const [visibleFields, setVisibleFields] = useState(form.fields);

  useEffect(() => {
    applyConditionalLogic();
  }, [responses]);

  const handleChange = (fieldId, value) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Simple conditional logic engine
  const applyConditionalLogic = () => {
    let updated = form.fields.filter((field) => {
      if (!field.conditions || field.conditions.length === 0) return true;

      return field.conditions.every((cond) => {
        const userValue = responses[cond.field];
        return userValue === cond.value;
      });
    });

    setVisibleFields(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Responses:", responses);
    alert("Form Submitted! Check console.");
    // Later → POST to backend API
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{form.title}</h2>

        {visibleFields.map((field) => (
          <div key={field.id} className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">{field.label}</label>

            {field.type === "text" && (
              <input
                type="text"
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}

            {field.type === "email" && (
              <input
                type="email"
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}

            {field.type === "textarea" && (
              <textarea
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormViewer;
