import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mockObservations } from "../mock/observations";
import "./ObservationsListPage.css";

function ObservationsListPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const authorId = searchParams.get("authorId");
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    const page = Number(searchParams.get("page") ?? 0);
    const size = Number(searchParams.get("size") ?? 2);

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
        } catch {
            setDeleteError("An error occurred while deleting");
        }
    };

    return (
        <div className="container">
            <h1 className="title">Observations list</h1>

            <div className="filterBox">
                <h3>Filters</h3>

                <div className="filterRow">
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
                        <button className="primaryButton" onClick={applyFilters}>
                            Apply filters
                        </button>
                    </div>
                </div>
            </div>

            <button
                className="primaryButton"
                onClick={() => navigate("/observations/new")}
                style={{ marginBottom: "20px" }}
            >
                Add new entity
            </button>

            {paginatedObservations.length === 0 ? (
                <p>The list is empty</p>
            ) : (
                <ul className="list">
                    {paginatedObservations.map((obs) => (
                        <li
                            key={obs.id}
                            className="listItem"
                            onClick={() => navigate(`/observations/${obs.id}`)}
                            onMouseEnter={() => setHoveredId(obs.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {hoveredId === obs.id && (
                                <button
                                    className="deleteButton"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setObservationToDelete(obs);
                                    }}
                                >
                                    🗑
                                </button>
                            )}

                            <h3>{obs.name}</h3>

                            <div className="meta">
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
                <div className="pagination">
                    <button disabled={page === 0} onClick={() => goToPage(page - 1)}>
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
                <div className="modalOverlay">
                    <div className="filterBox">
                        <h3>Confirmation</h3>

                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{observationToDelete.name}</strong>?
                        </p>

                        {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button onClick={() => setObservationToDelete(null)}>
                                Cancel
                            </button>
                            <button className="primaryButton" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toastMessage && <div className="toast">{toastMessage}</div>}
        </div>
    );
}

export default ObservationsListPage;
