(function () {
    console.log("FlipHTML5 Downloader Başlatılıyor...");

    function injectScript(fileName) {
        const s = document.createElement('script');
        s.src = chrome.runtime.getURL(fileName);
        s.onload = function () {
            this.remove(); // Yüklendikten sonra script tagini temizle
        };
        (document.head || document.documentElement).appendChild(s);
    }

    // Önce Kütüphaneyi, sonra kendi kodumuzu enjekte et
    injectScript('jspdf.umd.min.js');
    
    // Kütüphanenin yüklenmesi için minik bir gecikme ile ana kodu yükle
    setTimeout(() => {
        injectScript('injected.js');
    }, 500);
})();