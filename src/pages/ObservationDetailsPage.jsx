import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { mockObservations } from "../mock/observations";
import "./ObservationDetailsPage.css";
import {
  getObservationById,
  createObservation,
  updateObservation,
} from "../services/observationApi";

function ObservationDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isCreateMode = !id;

    const [loading, setLoading] = useState(!isCreateMode);

    useEffect(() => {
    if (!isCreateMode) {
        getObservationById(id)
        .then((data) => {
            setFormData(data);
            setOriginalData(data);
        })
        .catch(() => setSaveError("Failed to load observation"))
        .finally(() => setLoading(false));
    }
    }, [id, isCreateMode]);

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

    const handleSave = async () => {
        if (!validate()) return;

        try {
            setSaveError(null);
            try {
                setSaveError(null);

                const saved = isCreateMode
                    ? await createObservation(formData)
                    : await updateObservation(id, formData);

                setFormData(saved);
                setOriginalData(saved);
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

            setToastMessage(
                isCreateMode
                    ? "Observation created successfully"
                    : "Observation updated successfully"
            );

            setTimeout(() => setToastMessage(null), 3000);

            if (isCreateMode) {
                navigate(`/observations${location.search}`);
            }
        } catch {
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
        <div className="page">
            <div className="container">
                <button className="backButton" onClick={goBack}>
                    ← Back
                </button>

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

                        <div className="actions">
                            <button className="primaryButton" onClick={() => setMode("edit")}>
                                ✏️ Edit
                            </button>
                        </div>
                    </>
                )}

                {mode === "edit" && (
                    <>
                        <div className="field">
                            <label>Name</label>
                            <input
                                className="input"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                style={{
                                    borderColor: errors.name ? "#ff6b6b" : undefined,
                                }}
                            />
                            {errors.name && (
                                <p className="error">{errors.name}</p>
                            )}
                        </div>

                        <div className="field">
                            <label>Description</label>
                            <textarea
                                className="textarea"
                                value={formData.description}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                            />
                        </div>

                        <div className="field">
                            <label>Date</label>
                            <input
                                type="datetime-local"
                                className="input"
                                value={formData.observationTime}
                                onChange={(e) =>
                                    handleChange("observationTime", e.target.value)
                                }
                                style={{
                                    borderColor: errors.observationTime ? "#ff6b6b" : undefined,
                                }}
                            />
                            {errors.observationTime && (
                                <p className="error">{errors.observationTime}</p>
                            )}
                        </div>

                        {saveError && <p className="error">{saveError}</p>}

                        <div className="actions">
                            <button className="primaryButton" onClick={handleSave}>
                                {isCreateMode ? "Create" : "Save"}
                            </button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </>
                )}

                {toastMessage && (
                    <div className="toast">{toastMessage}</div>
                )}
            </div>
        </div>
    );
}

export default ObservationDetailsPage;
