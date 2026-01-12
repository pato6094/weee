(async function() {
    const params = new URLSearchParams(window.location.search);
    const targetUrl = params.get('url');

    if (!targetUrl) {
        showError('No URL provided');
        return;
    }

    try {
        const SUPABASE_URL = 'https://zvuxdphglfwcqmalyvgc.supabase.co';
        const proxyUrl = `${SUPABASE_URL}/functions/v1/proxy`;

        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'X-Target-Url': targetUrl
            }
        });

        if (!response.ok) {
            throw new Error('Proxy request failed');
        }

        const html = await response.text();

        // Write the proxied content to the page
        document.open();
        document.write(html);
        document.close();

    } catch (err) {
        showError('Connection failed: ' + err.message);
    }

    function showError(msg) {
        document.getElementById('error').textContent = msg;
        document.getElementById('error').style.display = 'block';
        document.querySelector('.spinner').style.display = 'none';
    }
})();
