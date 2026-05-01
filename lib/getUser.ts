export async function getUser() {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();

    return data?.authenticated ? data : null;
    
  } catch {
    return null;
  }
}