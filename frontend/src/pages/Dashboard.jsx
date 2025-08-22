import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  fetchBases,
  fetchTables,
  fetchFields,
  createForm,
  updateForm,
  listForms,
  deleteForm
} from "../utils/api";
import BaseSelector from "../components/BaseSelector";
import TableSelector from "../components/TableSelector";
import FieldSelector from "../components/FieldSelector";
import FormBuilder from "../components/FormBuilder";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [params] = useSearchParams();
  const userId = params.get("userId");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState("");

  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [fields, setFields] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [base, setBase] = useState(null);
  const [table, setTable] = useState(null);
  const [forms, setForms] = useState([]);
  const [editingFormId, setEditingFormId] = useState(null);

  // New states for title 
  const [formTitle, setFormTitle] = useState("");

  // Load current user
  useEffect(() => {
    if (!userId) {
      setError("Missing userId");
      setLoadingUser(false);
      return;
    }

    getCurrentUser(userId)
      .then((res) => setUser(res.data))
      .catch(() => setError("Failed to load user"))
      .finally(() => setLoadingUser(false));
  }, [userId]);

  // Load bases + user forms
  useEffect(() => {
    if (userId) {
      fetchBases(userId)
        .then((r) => setBases(r.data))
        .catch(() => setBases([]));

      listForms(userId).then((r) => setForms(r.data));
    }
  }, [userId]);

  // Load tables when a base is selected
  useEffect(() => {
    if (userId && base) {
      fetchTables(userId, base.id)
        .then((r) => setTables(r.data.tables || r.data))
        .catch(() => setTables([]));
    }
  }, [userId, base]);

  const toggleField = (f) => {
    setQuestions((prev) =>
      prev.some((q) => q.id === f.id)
        ? prev.filter((q) => q.id !== f.id)
        : [...prev, { ...f, label: f.name }]
    );
  };

  const saveForm = () => {
    const mappedQuestions = questions.map((q) => {
      let fieldType;
      switch (q.type) {
        case "singleLineText":
          fieldType = "short_text";
          break;
        case "longText":
          fieldType = "long_text";
          break;
        case "singleSelect":
          fieldType = "single_select";
          break;
        case "multipleSelects":
          fieldType = "multi_select";
          break;
        case "attachment":
          fieldType = "attachment"; //
          break;
        default:
          fieldType = "short_text"; // fallback
      }
      return {
        fieldId: q.id || `${q.name}-${Date.now()}-${Math.random()}`,
        fieldType,
        label: q.label || q.name,
        required: false,
        options: q.options || [],
        showIf: [],
      };
    });

    const payload = {
      ownerId: userId,
      baseId: base.id,
      baseName: base.name,
      tableId: table.id,
      tableName: table.name,
      title: formTitle || "Untitled Form", 
      questions: mappedQuestions,
    };

    if (editingFormId) {
      // Update existing form
      updateForm(editingFormId, payload)
        .then((r) => {
          setForms((prev) =>
            prev.map((f) => (f._id === editingFormId ? r.data : f))
          );
          setEditingFormId(null);
          navigate(`/form/${r.data._id}?userId=${userId}`);
        })
        .catch((err) => {
          console.error("Update form error:", err.response?.data || err.message);
          alert("Failed to update form. Check console for details.");
        });
    } else {
      // Create new form
      createForm(payload)
        .then((r) => {
          setForms((prev) => [r.data, ...prev]);
          navigate(`/form/${r.data._id}?userId=${userId}`);
        })
        .catch((err) => {
          console.error("Save form error:", err.response?.data || err.message);
          alert("Failed to create form. Check console for details.");
        });
    }
  };

  const handleDelete = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;

    try {
      await deleteForm(formId);
      setForms((prev) => prev.filter((f) => f._id !== formId));
    } catch (err) {
      alert("Failed to delete form");
    }
  };

  if (loadingUser) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Welcome, {user?.name || "User"}
      </h1>
      <p className="mb-6 text-gray-600">Email: {user?.email}</p>

      {/* Form builder UI */}
      {!base && <BaseSelector bases={bases} onSelect={setBase} />}

      {base && !table && (
        <TableSelector
          tables={tables}
          onSelect={(t) => {
            setTable(t);
            fetchFields(userId, base.id, t.id)
              .then((r) => setFields(r.data.fields))
              .catch(() => setFields([]));
          }}
        />
      )}

      {base && table && (
        <>
          {/* Title Inputs */}
          <input
            type="text"
            placeholder="Enter form title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="border p-2 w-full mb-3"
          />

          <FieldSelector
            fields={fields}
            selected={questions}
            toggleField={toggleField}
          />
          <FormBuilder questions={questions} setQuestions={setQuestions} />

          <button
            onClick={saveForm}
            className="bg-purple-600 text-white px-4 py-2 rounded shadow mt-4"
          >
            {editingFormId ? "Update Form" : "Save Form"}
          </button>
        </>
      )}

      {/* List of created forms */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Your Forms</h2>
        {forms.length === 0 ? (
          <p className="text-gray-500">No forms yet.</p>
        ) : (
          <ul className="space-y-2">
            {forms.map((form) => (
              <li
                key={form._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{form.title}</span>
                <div className="space-x-3">
                  <Link
                    to={`/form/${form._id}?userId=${userId}`}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => {
                      setEditingFormId(form._id);
                      setBase({ id: form.baseId, name: form.baseName });
                      setTable({ id: form.tableId, name: form.tableName });
                      setQuestions(form.questions);
                      setFormTitle(form.title); // prefill
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                    {/* delete button */}
                  <button
                    onClick={() => handleDelete(form._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
