const BASE_URL = "http://localhost:8080/api/author";

export async function getAuthors() {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error("Failed to load authors");
  }
  return res.json();
}
