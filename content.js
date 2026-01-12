chrome.runtime.onMessage.addListener((message) => {
    const urlDaAprire = message.url;

    // XPath dei campi
    const inputXPath = "/html/body/div[2]/div/div/div/div[2]/div[2]/form/div/div/div/div/input";
    const buttonXPath = "/html/body/div[2]/div/div/div/div[2]/div[2]/form/div/span/button";

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
        console.error("Input o bottone non trovati");
        return;
    }

    // inserisci URL e trigger input event
    input.value = urlDaAprire;
    input.dispatchEvent(new Event("input", { bubbles: true }));

    // clicca Go
    setTimeout(() => {
        button.click();

        // opzionale: stampa HTML finale dopo 2 secondi
        setTimeout(() => {
            console.log("📄 Pagina proxyata HTML:");
            console.log(document.documentElement.outerHTML);
        }, 2000);

    }, 300);
});
