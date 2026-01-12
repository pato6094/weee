chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "openCroxy") {
        const urlDaAprire = message.url;

        chrome.tabs.create({ url: chrome.runtime.getURL("loading.html"), active: true }, (loadingTab) => {
            chrome.tabs.create({ url: "https://www.croxyproxy.com/", active: false }, (proxyTab) => {
                let scriptInjected = false;

                chrome.tabs.onUpdated.addListener(function listener(tabId, info, tab) {
                    if (tabId !== proxyTab.id) return;

                    if (info.status === "complete") {
                        const currentUrl = tab.url || "";

                        const isMainPage = currentUrl === "https://www.croxyproxy.com/" ||
                                          currentUrl === "https://www.croxyproxy.com";

                        const isCroxyDomain = currentUrl.includes("croxyproxy.com");
                        const isExtensionPage = currentUrl.startsWith("chrome-extension://");

                        if (!scriptInjected && isMainPage) {
                            scriptInjected = true;
                            chrome.scripting.executeScript({
                                target: { tabId: proxyTab.id },
                                files: ["content.js"]
                            }, () => {
                                chrome.tabs.sendMessage(proxyTab.id, { url: urlDaAprire });
                            });
                        }

                        if (scriptInjected && !isCroxyDomain && !isExtensionPage && currentUrl !== "") {
                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.tabs.remove(proxyTab.id);
                            chrome.tabs.update(loadingTab.id, { url: currentUrl });
                        }
                    }
                });
            });
        });
    }
});
