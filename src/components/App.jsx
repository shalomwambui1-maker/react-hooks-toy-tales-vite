import React, { useState, useEffect } from "react";
import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const API = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  // GET: load all toys on page load
  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data) => setToys(data))
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  // POST: create a toy, then add it to state
  function handleAddToy(newToy) {
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newToy, likes: 0 }),
    })
      .then((r) => r.json())
      .then((created) => setToys((prev) => [...prev, created]))
      .catch((err) => console.error("Add failed:", err));
  }

  // DELETE: remove from backend, then from state
  function handleDeleteToy(id) {
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then((r) => {
        if (r.ok) setToys((prev) => prev.filter((toy) => toy.id !== id));
      })
      .catch((err) => console.error("Delete failed:", err));
  }

  // PATCH: increase likes, replace the toy in place so order is kept
  function handleLikeToy(toy) {
    fetch(`${API}/${toy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: toy.likes + 1 }),
    })
      .then((r) => r.json())
      .then((updated) =>
        setToys((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      )
      .catch((err) => console.error("Like failed:", err));
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={() => setShowForm((show) => !show)}>Add a Toy</button>
      </div>
      <ToyContainer
        toys={toys}
        onDeleteToy={handleDeleteToy}
        onLikeToy={handleLikeToy}
      />
    </>
  );
}

export default App;