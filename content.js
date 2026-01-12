chrome.runtime.onMessage.addListener((message) => {
    const urlDaAprire = message.url;

    if (!document.getElementById("proxy-loading-overlay")) {
        const overlay = document.createElement("div");
        overlay.id = "proxy-loading-overlay";
        overlay.innerHTML = `
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
        `;
        document.documentElement.appendChild(overlay);
    }

    const input = document.querySelector('input[name="url"]');
    const button = document.querySelector('button[type="submit"]');

    if (!input || !button) {
        return;
    }

    input.value = urlDaAprire;
    input.dispatchEvent(new Event("input", { bubbles: true }));

    setTimeout(() => {
        button.click();
    }, 300);

    function extractDestinationUrl() {
        const urlInput = document.getElementById("__cpsUrl");
        if (urlInput && urlInput.value) {
            return urlInput.value;
        }
        return null;
    }

    function extractPageMetadata() {
        let title = document.title || "";
        let description = "";

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            description = metaDesc.getAttribute("content") || "";
        }

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (!description && ogDesc) {
            description = ogDesc.getAttribute("content") || "";
        }

        return { title, description };
    }

    function removeProxyHeader() {
        const header = document.getElementById("__cpsHeader");
        if (header) {
            header.remove();
        }
    }

    let destinationSent = false;

    const observer = new MutationObserver(() => {
        const destinationUrl = extractDestinationUrl();

        if (destinationUrl && !destinationSent) {
            destinationSent = true;
            const metadata = extractPageMetadata();

            chrome.runtime.sendMessage({
                action: "destinationResolved",
                destinationUrl: destinationUrl,
                title: metadata.title,
                description: metadata.description
            });
        }

        removeProxyHeader();

        const overlay = document.getElementById("proxy-loading-overlay");
        if (overlay && document.getElementById("__cpsHeader") === null && document.body) {
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    setTimeout(() => {
        const destinationUrl = extractDestinationUrl();
        if (destinationUrl && !destinationSent) {
            destinationSent = true;
            const metadata = extractPageMetadata();

            chrome.runtime.sendMessage({
                action: "destinationResolved",
                destinationUrl: destinationUrl,
                title: metadata.title,
                description: metadata.description
            });
        }
    }, 5000);
});
