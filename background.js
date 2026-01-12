chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "openCroxy") {
        const urlDaAprire = message.url;

        // crea una tab "in background"
        chrome.tabs.create({ url: "https://www.croxyproxy.com/", active: false }, (tab) => {

            // aspetta il caricamento della tab
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (tabId === tab.id && info.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener);

                    // inietta content.js
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ["content.js"]
                    }, () => {
                        // manda URL al content script
                        chrome.tabs.sendMessage(tab.id, { url: urlDaAprire });
                    });
                }
            });
        });
    }
});
