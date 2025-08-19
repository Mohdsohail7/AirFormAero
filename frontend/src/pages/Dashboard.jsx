import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getCurrentUser,
  fetchBases,
  fetchTables,
  fetchFields,
  createForm,
} from "../utils/api";

import BaseSelector from "../components/BaseSelector";
import TableSelector from "../components/TableSelector";
import FieldSelector from "../components/FieldSelector";
import FormBuilder from "../components/FormBuilder";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [params] = useSearchParams();
  const userId = params.get("userId");

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState("");

  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [fields, setFields] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [base, setBase] = useState(null);
  const [table, setTable] = useState(null);

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

  // Load bases once user is ready
  useEffect(() => {
    if (userId) {
      fetchBases(userId)
        .then((r) => setBases(r.data))
        .catch(() => setError("Failed to fetch bases"));
    }
  }, [userId]);

  const toggleField = (f) => {
    setQuestions((prev) =>
      prev.some((q) => q.id === f.id)
        ? prev.filter((q) => q.id !== f.id)
        : [...prev, { ...f, label: f.name }]
    );
  };

  const saveForm = () => {
    createForm({
      ownerId: userId,
      baseId: base.id,
      baseName: base.name,
      tableId: table.id,
      tableName: table.name,
      title: "My Form",
      questions,
    }).then((r) => {
      alert("Form created! Form ID: " + r.data._id);
    });
  };

  if (loadingUser) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Welcome, {user?.name || "User"} 👋</h1>
      <p className="mb-6 text-gray-600">Email: {user?.email}</p>

      {/* Step 1: Pick a base */}
      {!base && (
        <BaseSelector
          bases={bases}
          onSelect={(b) => {
            setBase(b);
            fetchTables(userId, b.id)
              .then((r) => setTables(r.data.tables))
              .catch(() => setError("Failed to fetch tables"));
          }}
        />
      )}

      {/* Step 2: Pick a table */}
      {base && !table && (
        <div>
          <button
            onClick={() => setBase(null)}
            className="mb-4 px-3 py-1 bg-gray-300 rounded"
          >
            ← Back to Bases
          </button>
          <TableSelector
            tables={tables}
            onSelect={(t) => {
              setTable(t);
              fetchFields(userId, base.id, t.id)
                .then((r) => setFields(r.data.fields))
                .catch(() => setError("Failed to fetch fields"));
            }}
          />
        </div>
      )}

      {/* Step 3: Pick fields + build form */}
      {base && table && (
        <div>
          <button
            onClick={() => {
              setTable(null);
              setFields([]);
            }}
            className="mb-4 px-3 py-1 bg-gray-300 rounded"
          >
            ← Back to Tables
          </button>

          <FieldSelector
            fields={fields}
            selected={questions}
            toggleField={toggleField}
          />

          <FormBuilder questions={questions} setQuestions={setQuestions} />

          <button
            onClick={saveForm}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded shadow"
          >
            Save Form
          </button>
        </div>
      )}
    </div>
  );
}
