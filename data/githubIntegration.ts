
export const GITHUB_REPO_RAW = "https://raw.githubusercontent.com/professorlbt/Sovereign-BTC/main";

export async function fetchRemoteData(filename: string) {
  try {
    const response = await fetch(`${GITHUB_REPO_RAW}/data/${filename}`);
    if (!response.ok) throw new Error("File not found");
    return await response.json();
  } catch (err) {
    console.warn(`External data fetch failed for ${filename}:`, err);
    return null;
  }
}
