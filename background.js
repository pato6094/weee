chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action !== "croxyGhost") return;

    chrome.tabs.create({
        url: "https://proxyium.com/",
        active: true
    }, (tab) => {
        if (!tab) return;

        const tabId = tab.id;

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
