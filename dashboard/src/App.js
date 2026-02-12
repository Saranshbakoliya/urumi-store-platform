import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    const res = await axios.get("http://localhost:5000/stores");
    setStores(res.data);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const createStore = async () => {
    setLoading(true);
    await axios.post("http://localhost:5000/stores");
    await fetchStores();
    setLoading(false);
  };

  const deleteStore = async (name) => {
    await axios.delete(`http://localhost:5000/stores/${name}`);
    await fetchStores();
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Urumi Store Provisioning Dashboard</h1>

      <button
        onClick={createStore}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        {loading ? "Provisioning..." : "Create New Store"}
      </button>

      {stores.length === 0 && <p>No stores created yet.</p>}

      {stores.map((store) => (
        <div
          key={store.name}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <h3>{store.name}</h3>
          <p>Status: {store.status}</p>
          <p>Namespace: {store.namespace}</p>
          <p>Created: {store.createdAt}</p>

          <button
            onClick={() => deleteStore(store.name)}
            style={{
              padding: "5px 10px",
              background: "red",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
