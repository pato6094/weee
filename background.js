chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action !== "croxyGhost") return;

    const targetUrl = msg.url;

    chrome.tabs.create({
        url: "https://proxyium.com/",
        active: true
    }, (tab) => {
        if (!tab) return;

        const tabId = tab.id;

        const showOverlay = `
            const overlay = document.createElement("div");
            overlay.id = "proxy-loading-overlay";
            overlay.innerHTML = \`
                <style>
                    #proxy-loading-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        background: rgba(0, 0, 0, 0.7);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        z-index: 999999;
                    }
                    #proxy-loading-overlay .spinner {
                        width: 50px;
                        height: 50px;
                        border: 4px solid rgba(255, 255, 255, 0.3);
                        border-top-color: #fff;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-bottom: 20px;
                    }
                    #proxy-loading-overlay .text {
                        color: #fff;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                        font-size: 24px;
                        font-weight: 500;
                        letter-spacing: 2px;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
                <div class="spinner"></div>
                <div class="text">Loading...</div>
            \`;
            document.documentElement.appendChild(overlay);
        `;

        chrome.tabs.onUpdated.addListener(function listener(id, info) {
            if (id !== tabId) return;

            if (info.status === "loading") {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: new Function(showOverlay)
                }).catch(() => {});
            }

            if (info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);

                chrome.scripting.executeScript({
                    target: { tabId },
                    func: new Function(showOverlay)
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
