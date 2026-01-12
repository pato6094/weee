console.log("Content script loaded on:", window.location.href);

chrome.runtime.onMessage.addListener((message) => {
    console.log("Message received:", message);
    const urlDaAprire = message.url;

    const inputXPath = "/html/body/main/div/div/div[2]/div/div[2]/form/div[2]/input";
    const buttonXPath = "/html/body/main/div/div/div[2]/div/div[2]/form/div[2]/button";

    const input = document.evaluate(
        inputXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    const button = document.evaluate(
        buttonXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    console.log("Input found:", !!input, "Button found:", !!button);

    if (!input || !button) {
        console.error("Elements not found!");
        return;
    }

    input.value = urlDaAprire;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    console.log("URL set to:", urlDaAprire);

    setTimeout(() => {
        console.log("Clicking button...");
        button.click();
    }, 300);
});
