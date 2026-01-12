chrome.runtime.onMessage.addListener((message) => {
    const urlDaAprire = message.url;

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
    document.body.appendChild(overlay);

    const input = document.querySelector('input[name="url"]');
    const button = document.querySelector('button[type="submit"]');

    if (!input || !button) {
        console.error("Elements not found!");
        overlay.remove();
        return;
    }

    input.value = urlDaAprire;
    input.dispatchEvent(new Event("input", { bubbles: true }));

    setTimeout(() => {
        button.click();
    }, 300);
});
