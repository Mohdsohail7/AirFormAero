import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetch(`${process.env.REACT_APP_BASE_URL}/api/airtable/bases/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setBases(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Dashboard</h1>
      <h2 className="text-xl text-center mb-6">Select a Base</h2>

      {loading ? (
        <p className="text-center">Loading bases...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bases.map((base) => (
            <div
              key={base.id}
              className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer hover:shadow-xl transition duration-300"
            >
              {base.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
