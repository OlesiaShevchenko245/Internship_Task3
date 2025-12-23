const BASE_URL = "http://localhost:8080/api/observation";

export async function getObservationById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch observation");
  }
  return res.json();
}

export async function createObservation(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create observation");
  }

  return res.json();
}

export async function updateObservation(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update observation");
  }

  return res.json();
}

export async function deleteObservation(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete observation");
  }
}

export async function listObservations(filterRequest) {
  const res = await fetch(`${BASE_URL}/_list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filterRequest),
  });

  if (!res.ok) {
    throw new Error("Failed to load observations");
  }

  return res.json();
}
