import { useParams } from "react-router-dom";

function ObservationDetailsPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Details:</h1>
      <p>Observation ID: {id}</p>
    </div>
  );
}

export default ObservationDetailsPage;
