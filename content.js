chrome.runtime.onMessage.addListener((message) => {
    const urlDaAprire = message.url;

    const input = document.querySelector('input[name="url"]');
    const button = document.querySelector('button[type="submit"]');

    if (!input || !button) {
        console.error("Elements not found!");
        return;
    }

    input.value = urlDaAprire;
    input.dispatchEvent(new Event("input", { bubbles: true }));

    setTimeout(() => {
        button.click();
    }, 300);
});
