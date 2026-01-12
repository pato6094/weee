const scanServices = [
    { name: "Norton Safe Web", url: "https://safeweb.norton.com/report/show?url=" },
    { name: "Link Shield", url: "https://linkshieldapp.com/check?url=" },
    { name: "McAfee Webadvisor", url: "https://www.siteadvisor.com/sitereport.html?url=" },
    { name: "Web of Trust", url: "https://www.mywot.com/scorecard/" },
    { name: "Succuri", url: "https://sitecheck.sucuri.net/results/" },
    { name: "URL Void", url: "https://www.urlvoid.com/scan/" }
];

let currentDestinationUrl = "";
let currentProxyUrl = "";
let currentShortUrl = "";

document.getElementById("go").addEventListener("click", () => {
    const url = document.getElementById("url").value.trim();
    if (!url) return;

    currentShortUrl = url;
    showLoading();
    chrome.runtime.sendMessage({ action: "croxyGhost", url });
});

document.getElementById("url").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("go").click();
    }
});

document.getElementById("openBtn").addEventListener("click", () => {
    const urlToOpen = currentDestinationUrl || currentShortUrl;
    if (urlToOpen) {
        const proxyiumUrl = `https://proxyium.com/?safelink_url=${encodeURIComponent(urlToOpen)}`;
        chrome.tabs.create({ url: proxyiumUrl });
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "linkResolved") {
        currentDestinationUrl = message.destinationUrl;
        currentProxyUrl = message.proxyUrl;
        showResults(message.destinationUrl, message.title, message.description);
    }
});

function showLoading() {
    document.getElementById("promptText").style.display = "none";
    document.getElementById("inputContainer").style.display = "none";
    document.getElementById("results").classList.add("show");
    document.getElementById("loading").style.display = "block";
    document.getElementById("revealedSection").style.display = "none";
    document.getElementById("scanSection").style.display = "none";
    document.getElementById("previewSection").style.display = "none";
    document.getElementById("successSection").style.display = "none";
    document.getElementById("urlBox").style.display = "none";
}

function showResults(destinationUrl, title, description) {
    document.getElementById("loading").style.display = "none";

    document.getElementById("successSection").style.display = "block";
    document.getElementById("urlBox").style.display = "flex";
    document.getElementById("shortUrl").textContent = currentShortUrl;

    document.getElementById("revealedSection").style.display = "block";
    document.getElementById("revealedUrl").textContent = destinationUrl;

    const scanLinksContainer = document.getElementById("scanLinks");
    scanLinksContainer.innerHTML = "";
    scanServices.forEach(service => {
        const link = document.createElement("a");
        link.className = "scan-link";
        link.href = service.url + encodeURIComponent(destinationUrl);
        link.target = "_blank";
        link.innerHTML = `${service.name} <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>`;
        scanLinksContainer.appendChild(link);
    });
    document.getElementById("scanSection").style.display = "block";

    document.getElementById("previewSection").style.display = "block";
    document.getElementById("pageTitle").textContent = title || "-";
    document.getElementById("pageDescription").textContent = description || "-";

    loadPreviewImage(destinationUrl);
}

function loadPreviewImage(url) {
    const previewLoading = document.getElementById("previewLoading");
    const previewImage = document.getElementById("previewImage");

    previewLoading.style.display = "flex";
    previewImage.style.display = "none";

    const screenshotUrl = `https://image.thum.io/get/width/600/crop/400/${url}`;

    previewImage.onload = () => {
        previewLoading.style.display = "none";
        previewImage.style.display = "block";
    };

    previewImage.onerror = () => {
        previewLoading.innerHTML = '<span style="color: #999;">Preview not available</span>';
    };

    previewImage.src = screenshotUrl;
}
