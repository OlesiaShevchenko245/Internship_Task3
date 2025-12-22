import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mockObservations } from "../mock/observations";

function ObservationsListPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const authorId = searchParams.get("authorId");
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 2); // page size

    const [filterAuthorId, setFilterAuthorId] = useState(authorId || "");
    const [filterFrom, setFilterFrom] = useState(fromDate || "");
    const [filterTo, setFilterTo] = useState(toDate || "");

    const [observations, setObservations] = useState(mockObservations);
    const [hoveredId, setHoveredId] = useState(null);

    const [observationToDelete, setObservationToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const [toastMessage, setToastMessage] = useState(null);

    const applyFilters = () => {
        const params = {};

        if (filterAuthorId) params.authorId = filterAuthorId;
        if (filterFrom) params.from = filterFrom;
        if (filterTo) params.to = filterTo;

        params.page = 0; 
        params.size = size;

        setSearchParams(params);
    };

    const filteredObservations = observations.filter((obs) => {
        if (authorId && obs.author.id !== Number(authorId)) return false;
        if (fromDate && obs.observationTime < fromDate) return false;
        if (toDate && obs.observationTime > toDate) return false;
        return true;
    });

    const totalPages = Math.ceil(filteredObservations.length / size);

    const paginatedObservations = filteredObservations.slice(
        page * size,
        page * size + size
    );

    const goToPage = (newPage) => {
        const params = Object.fromEntries(searchParams.entries());
        params.page = newPage;
        params.size = size;
        setSearchParams(params);
    };

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

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                }}
            >
                <h3>Filters</h3>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <div>
                        <label>Author ID</label>
                        <input
                            type="number"
                            value={filterAuthorId}
                            onChange={(e) => setFilterAuthorId(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>From</label>
                        <input
                            type="date"
                            value={filterFrom}
                            onChange={(e) => setFilterFrom(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>To</label>
                        <input
                            type="date"
                            value={filterTo}
                            onChange={(e) => setFilterTo(e.target.value)}
                        />
                    </div>

                    <div style={{ alignSelf: "flex-end" }}>
                        <button onClick={applyFilters}>Apply filters</button>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => navigate("/observations/new")}>
                    Add new entity
                </button>
            </div>

            {paginatedObservations.length === 0 ? (
                <p>The list is empty</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {paginatedObservations.map((obs) => (
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

            {totalPages > 1 && (
                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                    <button
                        disabled={page === 0}
                        onClick={() => goToPage(page - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page + 1} of {totalPages}
                    </span>

                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => goToPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
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
