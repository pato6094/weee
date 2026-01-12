chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action !== "croxyGhost") return;

    const targetUrl = msg.url;

    resolveShortUrl(targetUrl).then(result => {
        chrome.runtime.sendMessage({
            action: "linkResolved",
            destinationUrl: result.destinationUrl,
            title: result.title,
            description: result.description
        });
    }).catch(error => {
        chrome.runtime.sendMessage({
            action: "linkResolved",
            destinationUrl: targetUrl,
            title: "",
            description: "Could not resolve link"
        });
    });
});

async function resolveShortUrl(url) {
    const formData = new FormData();
    formData.append("url", url);
    formData.append("server", "eu1");

    const response = await fetch("https://cdn.proxyium.com/proxyrequest.php", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    if (data.status === "success" && data.data) {
        const proxyUrl = data.data;
        const pageResponse = await fetch(proxyUrl, {
            redirect: "follow"
        });

        const html = await pageResponse.text();

        let destinationUrl = url;
        const urlMatch = html.match(/id="__cpsUrl"[^>]*value="([^"]+)"/);
        if (urlMatch && urlMatch[1]) {
            destinationUrl = urlMatch[1];
        }

        let title = "";
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
            title = titleMatch[1].trim();
        }

        let description = "";
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        if (descMatch && descMatch[1]) {
            description = descMatch[1];
        } else {
            const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
            if (ogDescMatch && ogDescMatch[1]) {
                description = ogDescMatch[1];
            }
        }

        return { destinationUrl, title, description };
    }

    throw new Error("Failed to resolve URL");
}
