document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  document.getElementById("url").value = tab.url;

  document.getElementById("shorten").addEventListener("click", async () => {
    const url = document.getElementById("url").value;

    const res = await fetch("https://shortlllyyy.vercel.app/api/short", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    document.getElementById("result").innerHTML =
      `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
  });
});