import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getForm, submitForm } from "../utils/api";
import Loader from "../components/Loader";
import FormViewer from "../components/FormViewer";

export default function FormPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const userId = params.get("userId");

  const [form, setForm] = useState(null);

  useEffect(() => {
    getForm(id).then((r) => setForm(r.data));
  }, [id]);

  if (!form) return <Loader />;

  return (
    <FormViewer
      form={form}
      onSubmit={(answers) =>
        submitForm(id, userId, answers).then(() => alert("Submitted!"))
      }
    />
  );
}
