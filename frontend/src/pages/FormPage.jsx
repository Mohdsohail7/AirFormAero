import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate  } from "react-router-dom";
import { getCurrentUser, getForm, submitForm } from "../utils/api";
import Loader from "../components/Loader";
import FormViewer from "../components/FormViewer";

export default function FormPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const userId = params.get("userId");
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getForm(id).then((r) => setForm(r.data));
    if (userId) {
      getCurrentUser(userId).then((r) => setUser(r.data));
    }
  }, [id, userId]);

  if (!form) return <Loader />;

  return (
    <FormViewer
      form={form}
      onSubmit={(answers) =>
        submitForm(id, userId, answers).then(() => {
          navigate(`/form/${id}/submitted?userId=${userId}&name=${user?.name}`);
        })
      }
    />
  );
}
