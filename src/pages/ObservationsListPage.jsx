import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockObservations } from "../mock/observations";

function ObservationsListPage() {
  const navigate = useNavigate();

  const [observations, setObservations] = useState(mockObservations);
  const [hoveredId, setHoveredId] = useState(null);

  const [observationToDelete, setObservationToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  const handleDelete = () => {
    try {
      setObservations((prev) =>
        prev.filter((obs) => obs.id !== observationToDelete.id)
      );

      setObservationToDelete(null);
      setDeleteError(null);

      setToastMessage("The entity was deleted successfully");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      setDeleteError("An error occurred while deleting");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Observations list</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/observations/new")}>
          Add new entity
        </button>
      </div>

      {observations.length === 0 ? (
        <p>The list is empty</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {observations.map((obs) => (
            <li
              key={obs.id}
              onClick={() => navigate(`/observations/${obs.id}`)}
              onMouseEnter={() => setHoveredId(obs.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: "12px",
                cursor: "pointer",
                position: "relative",
                backgroundColor:
                  hoveredId === obs.id ? "#f9f9f9" : "transparent",
              }}
            >
              {hoveredId === obs.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setObservationToDelete(obs);
                  }}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "12px",
                    cursor: "pointer",
                    marginTop: "50px"
                  }}
                >
                  🗑
                </button>
              )}

              <h3 style={{ margin: "0 0 8px 0" }}>{obs.name}</h3>

              <div style={{ fontSize: "14px", color: "#555" }}>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(obs.observationTime).toLocaleString()}
                </div>
                <div>
                  <strong>Author:</strong>{" "}
                  {obs.author.firstName} {obs.author.lastName}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {observationToDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h3>Confirmation</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>{observationToDelete.name}</strong>?
            </p>

            {deleteError && (
              <p style={{ color: "red" }}>{deleteError}</p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                marginTop: "16px",
              }}
            >
              <button onClick={() => setObservationToDelete(null)}>
                Cancel
              </button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#333",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "6px",
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default ObservationsListPage;
