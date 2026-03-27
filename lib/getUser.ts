

export async function getUser() {

  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;

    return await res.json();

  } catch (err) {
    return null;
  }

}