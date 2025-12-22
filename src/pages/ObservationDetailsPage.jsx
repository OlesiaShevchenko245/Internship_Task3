import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockObservations } from "../mock/observations";

function ObservationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isCreateMode = !id;

  const existingObservation = mockObservations.find(
    (o) => o.id === Number(id)
  );

  const [mode, setMode] = useState(isCreateMode ? "edit" : "view");

  const [formData, setFormData] = useState(
    existingObservation || {
      name: "",
      description: "",
      observationTime: "",
      author: { firstName: "", lastName: "" },
      celestialObjects: [],
    }
  );

  const [originalData, setOriginalData] = useState(existingObservation);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.observationTime) {
      setError("Observation time is required");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    try {
      setError(null);

      setOriginalData(formData);
      setMode("view");

      setToastMessage(
        isCreateMode
          ? "Observation created successfully"
          : "Observation updated successfully"
      );
      setTimeout(() => setToastMessage(null), 3000);

      if (isCreateMode) {
        navigate("/observations");
      }
    } catch (e) {
      setError("Saving error occurred");
    }
  };

  const handleCancel = () => {
    if (isCreateMode) {
      navigate("/observations");
    } else {
      setFormData(originalData);
      setMode("view");
      setError(null);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate("/observations")}>← Back</button>

      <h1>
        {isCreateMode
          ? "Create observation"
          : mode === "view"
          ? "Observation details"
          : "Edit observation"}
      </h1>

      {mode === "view" && (
        <>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Description:</strong> {formData.description}</p>
          <p><strong>Date:</strong> {formData.observationTime}</p>
          <p>
            <strong>Author:</strong>{" "}
            {formData.author.firstName} {formData.author.lastName}
          </p>
          <p>
            <strong>Celestial objects:</strong>{" "}
            {formData.celestialObjects.join(", ")}
          </p>

          <button onClick={() => setMode("edit")}>✏️ Edit</button>
        </>
      )}

      {mode === "edit" && (
        <>
          <div>
            <label>Name</label>
            <input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
            />
          </div>

          <div>
            <label>Date</label>
            <input
              type="datetime-local"
              value={formData.observationTime}
              onChange={(e) =>
                handleChange("observationTime", e.target.value)
              }
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{ marginTop: "16px" }}>
            <button onClick={handleSave}>
              {isCreateMode ? "Create" : "Save"}
            </button>
            <button onClick={handleCancel} style={{ marginLeft: "8px" }}>
              Cancel
            </button>
          </div>
        </>
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

export default ObservationDetailsPage;
