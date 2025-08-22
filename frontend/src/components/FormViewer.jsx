import { useState } from "react";

export default function FormViewer({ form, onSubmit }) {
  const [answers, setAnswers] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleChange = (fid, val) =>
    setAnswers((prev) => ({ ...prev, [fid]: val }));

  // check conditional logic
  const shouldShow = (q) => {
    if (!q.showIf || q.showIf.length === 0) return true;
    return q.showIf.every((rule) => {
      const answer = answers[rule.whenFieldId];
      if (rule.operator === "equals") return answer === rule.value;
      if (rule.operator === "includes")
        return Array.isArray(answer) && answer.includes(rule.value);
      return true;
    });
  };

  const handleFileUpload = async (fid, files) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const urls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.url) urls.push(data.url);
      }

      // save Cloudinary URLs instead of raw File objects
      handleChange(fid, urls.length === 1 ? urls[0] : urls);
    } catch (err) {
      console.error("Upload failed", err);
      alert("File upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    // required validation
    for (const q of form.questions) {
      if (q.required && !answers[q.fieldId]) {
        alert(`Please fill required field: ${q.label}`);
        return;
      }
    }
    onSubmit(answers);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Fixed dynamic title */}
      <h1 className="text-2xl font-bold mb-4">
        {form.title?.trim() || "Untitled Form"}
      </h1>

      {form.questions.map(
        (q) =>
          shouldShow(q) && (
            <div key={q.fieldId} className="mb-3">
              <label className="block font-semibold mb-1">
                {q.label}
                {q.required && <span className="text-red-500"> *</span>}
              </label>

              {q.fieldType === "short_text" && (
                <input
                  className="w-full border p-2"
                  value={answers[q.fieldId] || ""}
                  onChange={(e) => handleChange(q.fieldId, e.target.value)}
                />
              )}

              {q.fieldType === "long_text" && (
                <textarea
                  className="w-full border p-2"
                  value={answers[q.fieldId] || ""}
                  onChange={(e) => handleChange(q.fieldId, e.target.value)}
                />
              )}

              {q.fieldType === "single_select" && (
                <select
                  className="w-full border p-2"
                  value={answers[q.fieldId] || ""}
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

              {q.fieldType === "multi_select" && (
                <select
                  multiple
                  className="w-full border p-2"
                  value={answers[q.fieldId] || []}
                  onChange={(e) =>
                    handleChange(
                      q.fieldId,
                      Array.from(e.target.selectedOptions).map((o) => o.value)
                    )
                  }
                >
                  {q.options.map((o) => (
                    <option key={o.id} value={o.name}>
                      {o.name}
                    </option>
                  ))}
                </select>
              )}

              {q.fieldType === "attachment" && (
                <div>
                  <input
                    type="file"
                    className="w-full"
                    multiple
                    onChange={(e) => handleFileUpload(q.fieldId, e.target.files)}
                  />
                  {uploading && (
                    <p className="text-sm text-gray-500">Uploading...</p>
                  )}
                  {answers[q.fieldId] && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600">Uploaded ✅</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
      )}

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Submit"}
      </button>
    </div>
  );
}
