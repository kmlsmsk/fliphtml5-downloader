/**
 * FlipHTML5 Ultimate PDF Converter (v4 - Path Fix)
 * Sorun: Çift dosya yolu ve yanlış uzantı ekleme hatası giderildi.
 */

(async function () {
    console.clear();
    console.log("%cPDF İndirici v4 Başlatılıyor...", "color: cyan; font-size: 16px; font-weight: bold;");

    // 1. jsPDF Kütüphanesini Yükle
    if (!window.jspdf) {
        console.log("jsPDF kütüphanesi yükleniyor...");
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    const { jsPDF } = window.jspdf;

    // 2. Sayfa Listesini Al
    let pageList = [];
    if (window.fliphtml5_pages && Array.isArray(window.fliphtml5_pages)) {
        pageList = window.fliphtml5_pages;
    } else if (window.config && window.config.pages) {
        pageList = window.config.pages;
    } else {
        alert("Sayfa listesi okunamadı. Sayfayı yenileyip tekrar deneyin.");
        return;
    }

    const totalPages = pageList.length;
    console.log(`%cToplam ${totalPages} sayfa bulundu.`, "color: yellow");

    // 3. Temel URL'yi Belirle (Kitap Kök Dizini)
    // Örnek: https://online.fliphtml5.com/jhbsc/fvlh/
    let rootUrl = window.location.href.split('#')[0].split('?')[0];
    if (!rootUrl.endsWith('/')) rootUrl += '/';

    // 4. Resim İndirme ve Jpeg'e Çevirme Fonksiyonu
    // WebP formatını jsPDF doğrudan desteklemez, Canvas ile JPEG'e çeviriyoruz.
    const getImageData = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // CORS hatasını önle
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                
                // Arka planı beyaz yap (şeffaflık varsa siyah çıkmasın diye)
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                
                resolve({
                    data: canvas.toDataURL('image/jpeg', 0.90), // %90 Kalite
                    width: img.width,
                    height: img.height
                });
            };

            img.onerror = () => reject(new Error(`Yükleme hatası: ${url}`));
            img.src = url;
        });
    };

    // 5. PDF Oluşturma Döngüsü
    const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
    doc.deletePage(1);

    console.log("İşlem başlıyor...");

    for (let i = 0; i < totalPages; i++) {
        const pageData = pageList[i];
        
        // --- KRİTİK DÜZELTME KISMI ---
        // Gelen veri genellikle şöyledir: "files/large/hash.webp"
        // Bizim yapmamız gereken sadece kök url ile bunu birleştirmek.
        
        let imagePath = pageData.n; // Veritabanındaki dosya yolu

        // Eğer yol "files/" ile başlamıyorsa, başına ekle (eski versiyonlar için önlem)
        if (!imagePath.includes("files/")) {
            imagePath = "files/large/" + imagePath;
        }

        // Eğer uzantısı yoksa varsayılan jpg ekle, varsa dokunma (Hata kaynağı burasıydı)
        if (!imagePath.includes(".jpg") && !imagePath.includes(".webp") && !imagePath.includes(".png")) {
            imagePath += ".jpg";
        }

        // Tam URL'yi oluştur
        const fullUrl = rootUrl + imagePath;

        console.log(`İşleniyor (${i + 1}/${totalPages}): ...${imagePath.slice(-20)}`);

        try {
            const imgInfo = await getImageData(fullUrl);
            doc.addPage([imgInfo.width, imgInfo.height]);
            doc.addImage(imgInfo.data, 'JPEG', 0, 0, imgInfo.width, imgInfo.height);
        } catch (err) {
            console.error(`Sayfa ${i + 1} atlandı. URL Hatalı olabilir: ${fullUrl}`);
            // Hata olsa da PDF sırası bozulmasın diye boş sayfa ekle
            doc.addPage();
            doc.text(`Sayfa ${i + 1} Yüklenemedi`, 20, 20);
        }
    }

    // 6. Kaydet
    doc.save("FlipBook_Düzeltilmiş.pdf");
    console.log("%cBAŞARIYLA TAMAMLANDI!", "color: lime; font-size: 20px;");

})();
