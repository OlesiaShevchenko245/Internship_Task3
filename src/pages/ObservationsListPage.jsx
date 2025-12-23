import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { listObservations, deleteObservation } from "../services/observationApi";
import { getAuthors } from "../services/authorApi";
import "./ObservationsListPage.css";

function ObservationsListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1); // BE is 1-based
  const size = Number(searchParams.get("size") ?? 10);
  const authorId = searchParams.get("authorId");
  const name = searchParams.get("name");
  const startTime = searchParams.get("startTime");

  const [filterAuthorId, setFilterAuthorId] = useState(authorId || "");
  const [filterName, setFilterName] = useState(name || "");
  const [filterStartTime, setFilterStartTime] = useState(startTime || "");

  const [observations, setObservations] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [hoveredId, setHoveredId] = useState(null);
  const [observationToDelete, setObservationToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    getAuthors().then(setAuthors);
  }, []);

  const loadObservations = () => {
    setLoading(true);

    listObservations({
      page,
      size,
      authorId: authorId ? Number(authorId) : null,
      name: name || null,
      startTime: startTime ? `${startTime}:00` : null,
    })
      .then((res) => {
        setObservations(res.list);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        setToastMessage("Failed to load observations");
        setTimeout(() => setToastMessage(null), 3000);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadObservations, [page, size, authorId, name, startTime]);

  const applyFilters = () => {
    const params = {};

    if (filterAuthorId) params.authorId = filterAuthorId;
    if (filterName) params.name = filterName;
    if (filterStartTime) params.startTime = filterStartTime;

    params.page = 1;
    params.size = size;

    setSearchParams(params);
  };

  const goToPage = (newPage) => {
    const params = Object.fromEntries(searchParams.entries());
    params.page = newPage;
    setSearchParams(params);
  };

  const handleDelete = async () => {
    try {
      setDeleteError(null);
      await deleteObservation(observationToDelete.id);
      setObservationToDelete(null);
      setToastMessage("Observation deleted successfully");
      setTimeout(() => setToastMessage(null), 3000);
      loadObservations();
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
            <label>Author</label>
            <select
              value={filterAuthorId}
              onChange={(e) => setFilterAuthorId(e.target.value)}
            >
              <option value="">All</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.firstName} {a.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Name</label>
            <input
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>

          <div>
            <label>Start time</label>
            <input
              type="datetime-local"
              value={filterStartTime}
              onChange={(e) => setFilterStartTime(e.target.value)}
            />
          </div>

          <button className="primaryButton" onClick={applyFilters}>
            Apply
          </button>
        </div>
      </div>

      <button
        className="primaryButton"
        onClick={() => navigate(`/observations/new${location.search}`)}
      >
        Add new entity
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : observations.length === 0 ? (
        <p>The list is empty</p>
      ) : (
        <ul className="list">
          {observations.map((obs) => (
            <li
              key={obs.id}
              className="listItem"
              onClick={() =>
                navigate(`/observations/${obs.id}${location.search}`)
              }
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
                  <strong>Author:</strong> {obs.authorName}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => goToPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
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
            {deleteError && <p className="errorText">{deleteError}</p>}
            <div className="actions">
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
