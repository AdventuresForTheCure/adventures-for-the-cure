export async function getJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

export async function getHtml(url) {
  const response = await fetch(url, { headers: { Accept: 'text/html' } });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.text();
}
