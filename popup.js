document.getElementById("go").addEventListener("click", () => {
    const url = document.getElementById("url").value.trim();
    if (!url) return;

    // invia URL al background
    chrome.runtime.sendMessage({ action: "openCroxy", url });
});
