(async function() {
    const params = new URLSearchParams(window.location.search);
    const targetUrl = params.get('url');

    if (!targetUrl) {
        showError('No URL provided');
        return;
    }

    const encodedUrl = encodeURIComponent(targetUrl);
    window.location.href = 'https://eu1.proxyium.com/proxy?cdURL=' + encodedUrl;

    function showError(msg) {
        document.getElementById('error').textContent = msg;
        document.getElementById('error').style.display = 'block';
        document.querySelector('.spinner').style.display = 'none';
    }
})();
