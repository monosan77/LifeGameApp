// fetchしたデータをjsに変換したものを返却
export async function fetchJSON(url: string, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
