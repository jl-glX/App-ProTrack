export function apiUrl(path: string) {
  const isElectron = window.location.protocol === "file:";

  if (isElectron) {
    return `http://localhost:3001${path}`;
  }

  return path;
}