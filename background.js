chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action !== "croxyGhost") return;

    chrome.windows.create({
        url: "https://proxyium.com/",
        type: "popup",
        width: 1024,
        height: 768,
        focused: true
    }, (win) => {
        if (!win || !win.tabs || !win.tabs[0]) return;

        const tabId = win.tabs[0].id;

        chrome.tabs.onUpdated.addListener(function listener(id, info) {
            if (id === tabId && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);

                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ["content.js"]
                }, () => {
                    if (chrome.runtime.lastError) return;
                    chrome.tabs.sendMessage(tabId, { url: msg.url });
                });
            }
        });
    });
});
