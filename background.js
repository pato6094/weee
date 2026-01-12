let popupPort = null;

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popup") {
        popupPort = port;
        port.onDisconnect.addListener(() => {
            popupPort = null;
        });
    }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.action === "destinationResolved") {
        chrome.runtime.sendMessage({
            action: "linkResolved",
            destinationUrl: msg.destinationUrl,
            title: msg.title,
            description: msg.description
        });
        return;
    }

    if (msg.action !== "croxyGhost") return;

    const targetUrl = msg.url;

    chrome.tabs.create({
        url: "https://proxyium.com/",
        active: true
    }, (tab) => {
        if (!tab) return;

        const tabId = tab.id;

        chrome.tabs.onUpdated.addListener(function listener(id, info) {
            if (id !== tabId) return;

            if (info.status === "loading") {
                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ["overlay.js"]
                }).catch(() => {});
            }

            if (info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);

                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ["overlay.js"]
                }).catch(() => {});

                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ["content.js"]
                }, () => {
                    if (chrome.runtime.lastError) return;
                    chrome.tabs.sendMessage(tabId, { url: targetUrl });
                });
            }
        });
    });
});
