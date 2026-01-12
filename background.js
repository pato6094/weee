chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "openCroxy") {
        const urlDaAprire = message.url;

        chrome.tabs.create({ url: chrome.runtime.getURL("loading.html"), active: true }, (loadingTab) => {
            chrome.windows.create({
                url: "https://proxyium.com/",
                type: "popup",
                width: 400,
                height: 300,
                left: 0,
                top: 0,
                focused: false,
                state: "minimized"
            }, (proxyWindow) => {
                if (!proxyWindow || !proxyWindow.tabs || !proxyWindow.tabs[0]) {
                    console.error("Failed to create proxy window");
                    return;
                }

                const proxyTabId = proxyWindow.tabs[0].id;
                let scriptInjected = false;

                console.log("Proxy window created, tabId:", proxyTabId);

                chrome.tabs.onUpdated.addListener(function listener(tabId, info, tab) {
                    if (tabId !== proxyTabId) return;

                    console.log("Tab updated:", tabId, "status:", info.status, "url:", tab?.url);

                    if (info.status === "complete" && tab && tab.url) {
                        const currentUrl = tab.url;
                        console.log("Page complete, URL:", currentUrl);

                        const isMainPage = currentUrl.includes("proxyium.com") &&
                                          !currentUrl.includes("/proxy");

                        const isProxiedPage = currentUrl.includes("proxyium.com/proxy") ||
                                             currentUrl.includes("proxyium.com/?");

                        console.log("isMainPage:", isMainPage, "isProxiedPage:", isProxiedPage, "scriptInjected:", scriptInjected);

                        if (!scriptInjected && isMainPage) {
                            scriptInjected = true;
                            console.log("Injecting content script...");

                            chrome.scripting.executeScript({
                                target: { tabId: proxyTabId },
                                files: ["content.js"]
                            }, () => {
                                if (chrome.runtime.lastError) {
                                    console.error("Script injection error:", chrome.runtime.lastError);
                                    return;
                                }
                                console.log("Script injected, sending URL:", urlDaAprire);
                                chrome.tabs.sendMessage(proxyTabId, { url: urlDaAprire });
                            });
                        }

                        if (scriptInjected && isProxiedPage) {
                            console.log("Proxied page detected, redirecting loading tab...");
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
