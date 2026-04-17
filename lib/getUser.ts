export async function getUser() {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (!data?.authenticated) return null;

    return data;
    
  } catch (err) {
    return null;
  }
}