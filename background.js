chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action !== "croxyGhost") return;

    chrome.windows.create({
        url: "https://www.croxyproxy.com/",
        type: "popup",
        width: 200,
        height: 100,
        left: 5000,
        top: 5000,
        focused: false
    }, (win) => {
        const tabId = win.tabs[0].id;

        chrome.tabs.onUpdated.addListener(function listener(id, info) {
            if (id === tabId && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);

                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ["content.js"]
                }, () => {
                    chrome.tabs.sendMessage(tabId, { url: msg.url });
                });
            }
        });
    });
});
