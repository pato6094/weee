chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "openCroxy") {
        const urlDaAprire = message.url;

        chrome.tabs.create({ url: chrome.runtime.getURL("loading.html"), active: true }, (loadingTab) => {
            chrome.windows.create({
                url: "https://proxyium.com/",
                state: "minimized",
                focused: false
            }, (proxyWindow) => {
                const proxyTabId = proxyWindow.tabs[0].id;
                let scriptInjected = false;

                chrome.tabs.onUpdated.addListener(function listener(tabId, info, tab) {
                    if (tabId !== proxyTabId) return;

                    if (info.status === "complete") {
                        const currentUrl = tab.url || "";

                        const isMainPage = currentUrl === "https://proxyium.com/" ||
                                          currentUrl === "https://proxyium.com" ||
                                          currentUrl === "https://www.proxyium.com/" ||
                                          currentUrl === "https://www.proxyium.com";

                        const isProxyDomain = currentUrl.includes("proxyium.com");
                        const isExtensionPage = currentUrl.startsWith("chrome-extension://");

                        if (!scriptInjected && isMainPage) {
                            scriptInjected = true;
                            chrome.scripting.executeScript({
                                target: { tabId: proxyTabId },
                                files: ["content.js"]
                            }, () => {
                                chrome.tabs.sendMessage(proxyTabId, { url: urlDaAprire });
                            });
                        }

                        if (scriptInjected && !isProxyDomain && !isExtensionPage && currentUrl !== "") {
                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.windows.remove(proxyWindow.id);
                            chrome.tabs.update(loadingTab.id, { url: currentUrl });
                        }
                    }
                });
            });
        });
    }
});
