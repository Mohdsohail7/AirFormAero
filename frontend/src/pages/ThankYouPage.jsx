import { Link, useParams, useSearchParams } from "react-router-dom";

export default function ThankYouPage() {
  const { id } = useParams();
  const [params] = useSearchParams();

  const name = params.get("name") || "there";
  const userId = params.get("userId");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Thank You, {name}!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your response has been submitted successfully.
      </p>

      <div className="space-x-4">
        <Link
          to={`/form/${id}?userId=${userId}`}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Fill Again
        </Link>

        <Link
          to={`/dashboard?userId=${userId}`}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
