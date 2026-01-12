chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "openCroxy") {
        const urlDaAprire = message.url;

        chrome.tabs.create({ url: chrome.runtime.getURL("loading.html"), active: true }, (loadingTab) => {
            chrome.tabs.create({ url: "https://www.croxyproxy.com/", active: false }, (proxyTab) => {
                let scriptInjected = false;
                let proxyReady = false;

                chrome.tabs.onUpdated.addListener(function listener(tabId, info, tab) {
                    if (tabId !== proxyTab.id) return;

                    if (info.status === "complete") {
                        const isMainPage = tab.url === "https://www.croxyproxy.com/" ||
                                          tab.url === "https://www.croxyproxy.com";

                        if (!scriptInjected && isMainPage) {
                            scriptInjected = true;
                            chrome.scripting.executeScript({
                                target: { tabId: proxyTab.id },
                                files: ["content.js"]
                            }, () => {
                                chrome.tabs.sendMessage(proxyTab.id, { url: urlDaAprire });
                            });
                        }

                        if (scriptInjected && !proxyReady && !isMainPage) {
                            proxyReady = true;
                            chrome.tabs.onUpdated.removeListener(listener);

                            chrome.tabs.remove(loadingTab.id);
                            chrome.tabs.update(proxyTab.id, { active: true });
                        }
                    }
                });
            });
        });
    }
});
