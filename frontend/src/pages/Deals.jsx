import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

export default function Deals() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    apiRequest("/deals")
      .then(setDeals)
      .catch(() => (window.location.href = "/"));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Deals</h2>
      <pre>{JSON.stringify(deals, null, 2)}</pre>
    </div>
  );
}
