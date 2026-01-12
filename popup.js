document.getElementById("go").addEventListener("click", () => {
    const url = document.getElementById("url").value.trim();
    if (!url) return;

    chrome.runtime.sendMessage({ action: "croxyGhost", url });
});
