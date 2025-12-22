import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ObservationsListPage from "./pages/ObservationsListPage";
import ObservationDetailsPage from "./pages/ObservationDetailsPage";
import ObservationCreatePage from "./pages/ObservationCreatePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/observations" />} />

        <Route path="/observations" element={<ObservationsListPage />} />
        <Route path="/observations/new" element={<ObservationCreatePage />} />
        <Route path="/observations/:id" element={<ObservationDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
