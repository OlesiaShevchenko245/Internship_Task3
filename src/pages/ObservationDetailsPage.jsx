import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { mockObservations } from "../mock/observations";

function ObservationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isCreateMode = !id;

  const existingObservation = mockObservations.find(
    (o) => o.id === Number(id)
  );

  const [mode, setMode] = useState(isCreateMode ? "edit" : "view");

  const emptyObservation = {
    name: "",
    description: "",
    observationTime: "",
    author: { firstName: "", lastName: "" },
    celestialObjects: [],
  };

  const [formData, setFormData] = useState(
    existingObservation || emptyObservation
  );

  const [originalData, setOriginalData] = useState(existingObservation);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.observationTime) {
      newErrors.observationTime = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    try {
      setSaveError(null);

      setOriginalData(formData);
      setMode("view");

      setToastMessage(
        isCreateMode
          ? "Observation created successfully"
          : "Observation updated successfully"
      );

      setTimeout(() => setToastMessage(null), 3000);

      if (isCreateMode) {
        navigate(`/observations${location.search}`);
      }
    } catch (e) {
      setSaveError("An error occurred while saving");
    }
  };

  const handleCancel = () => {
    if (isCreateMode) {
      navigate(`/observations${location.search}`);
    } else {
      setFormData(originalData);
      setErrors({});
      setSaveError(null);
      setMode("view");
    }
  };

  const goBack = () => {
    navigate(`/observations${location.search}`);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={goBack}>← Back</button>

      <h1 style={{ marginTop: "16px" }}>
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
              style={{
                borderColor: errors.name ? "red" : "#ccc",
              }}
            />
            {errors.name && (
              <p style={{ color: "red" }}>{errors.name}</p>
            )}
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
              style={{
                borderColor: errors.observationTime ? "red" : "#ccc",
              }}
            />
            {errors.observationTime && (
              <p style={{ color: "red" }}>
                {errors.observationTime}
              </p>
            )}
          </div>

          {saveError && (
            <p style={{ color: "red" }}>{saveError}</p>
          )}

          <div style={{ marginTop: "16px" }}>
            <button onClick={handleSave}>
              {isCreateMode ? "Create" : "Save"}
            </button>
            <button
              onClick={handleCancel}
              style={{ marginLeft: "8px" }}
            >
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
