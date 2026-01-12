(async function() {
    const params = new URLSearchParams(window.location.search);
    const targetUrl = params.get('url');

    if (!targetUrl) {
        showError('No URL provided');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('url', targetUrl);
        formData.append('server', 'eu1');

        const response = await fetch('https://cdn.proxyium.com/proxyrequest.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.data) {
            window.location.href = data.data;
        } else {
            showError('Could not get proxy URL');
        }
    } catch (err) {
        showError('Connection failed: ' + err.message);
    }

    function showError(msg) {
        document.getElementById('error').textContent = msg;
        document.getElementById('error').style.display = 'block';
        document.querySelector('.spinner').style.display = 'none';
    }
})();
