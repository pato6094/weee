(function() {
    const params = new URLSearchParams(window.location.search);
    const targetUrl = params.get('safelink_url');

    if (!targetUrl) return;

    const urlInput = document.querySelector('input[name="url"]');
    const form = document.getElementById('web_proxy_form');

    if (urlInput && form) {
        urlInput.value = decodeURIComponent(targetUrl);

        setTimeout(() => {
            form.submit();
        }, 500);
    }
})();
