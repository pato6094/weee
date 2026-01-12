chrome.runtime.onMessage.addListener((message) => {
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

    if (!input || !button) {
        return;
    }

    input.value = urlDaAprire;
    input.dispatchEvent(new Event("input", { bubbles: true }));

    setTimeout(() => {
        button.click();
    }, 300);
});
