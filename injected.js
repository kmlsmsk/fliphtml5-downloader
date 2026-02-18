/**
 * FlipHTML5 In-Page PDF Generator
 * Bu kod sayfa bağlamında (Main World) çalışır.
 */
(async function () {

    // --- 1. UI: Bilgi Kutusu Oluştur ---
    const statusId = "fliphtml5-downloader-ui";
    if (document.getElementById(statusId)) return; // Zaten çalışıyorsa durdur

    const ui = document.createElement('div');
    ui.id = statusId;
    ui.style.cssText = "position:fixed; top:20px; right:20px; width:300px; background:rgba(0,0,0,0.9); color:#fff; padding:20px; z-index:2147483647; border-radius:8px; font-family:sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.5); text-align:left;";
    ui.innerHTML = `
        <h3 style="margin:0 0 10px; color:#00e5ff; font-size:16px;">PDF Oluşturucu</h3>
        <div id="status-text" style="font-size:13px; margin-bottom:10px;">Hazırlanıyor...</div>
        <div style="width:100%; background:#444; height:6px; border-radius:3px; overflow:hidden;">
            <div id="status-bar" style="width:0%; height:100%; background:#00e5ff; transition:width 0.2s;"></div>
        </div>
    `;
    document.body.appendChild(ui);

    const updateStatus = (text, percent) => {
        const txt = document.getElementById('status-text');
        const bar = document.getElementById('status-bar');
        if (txt) txt.innerText = text;
        if (bar && percent !== undefined) bar.style.width = percent + "%";
    };

    // --- 2. Hazırlık ve Kontroller ---
    
    // jsPDF'in yüklenmesini bekle (content.js tarafından enjekte edildi ama asenkron olabilir)
    const waitForJsPDF = () => {
        return new Promise(resolve => {
            const check = setInterval(() => {
                if (window.jspdf) {
                    clearInterval(check);
                    resolve(window.jspdf);
                }
            }, 100);
        });
    };

    updateStatus("Kütüphane bekleniyor...", 5);
    const { jsPDF } = await waitForJsPDF();

    // Sayfa verilerini bul
    let pageList = [];
    if (window.fliphtml5_pages && Array.isArray(window.fliphtml5_pages)) {
        pageList = window.fliphtml5_pages;
    } else if (window.config && window.config.pages) {
        pageList = window.config.pages;
    } else {
        updateStatus("HATA: Kitap verisi bulunamadı! Sayfa tam yüklenmemiş olabilir.", 0);
        setTimeout(() => ui.remove(), 4000);
        return;
    }

    const totalPages = pageList.length;
    updateStatus(`${totalPages} sayfa bulundu. Başlıyor...`, 10);

    // Kök URL'yi al (Hash (#) ve Query (?) kısımlarını temizle)
    let rootUrl = window.location.href.split('#')[0].split('?')[0];
    if (!rootUrl.endsWith('/')) rootUrl += '/';

    // --- 3. Resim İşleyici (Canvas) ---
    const getImageData = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                // Arkaplanı beyaz yap (PNG transparanlığı için)
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                resolve({
                    data: canvas.toDataURL('image/jpeg', 0.85),
                    width: img.width,
                    height: img.height
                });
            };
            img.onerror = () => reject(new Error("Yükleme başarısız"));
            img.src = url;
        });
    };

    // --- 4. Ana Döngü ---
    const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
    doc.deletePage(1);

    for (let i = 0; i < totalPages; i++) {
        const pageData = pageList[i];
        
        // URL Oluşturma Mantığı (DÜZELTİLMİŞ)
        // pageData.n genellikle "files/large/hash" şeklindedir veya sadece "hash"tir.
        let imagePath = pageData.n;
        
        // Eğer path "files/" içermiyorsa ekle
        if (!imagePath.includes("files/")) {
            imagePath = "files/large/" + imagePath;
        }

        // Uzantı kontrolü (Zaten varsa ekleme, yoksa .jpg ekle)
        // FlipHTML5 bazen uzantısız verir, bazen uzantılı.
        if (!imagePath.match(/\.(jpg|jpeg|png|webp)$/i)) {
             imagePath += ".jpg";
        }

        const fullUrl = rootUrl + imagePath;
        
        // İlerleme yüzdesi
        const percent = Math.round(((i + 1) / totalPages) * 100);
        updateStatus(`Sayfa işleniyor: ${i + 1}/${totalPages}`, percent);

        try {
            const imgInfo = await getImageData(fullUrl);
            doc.addPage([imgInfo.width, imgInfo.height]);
            doc.addImage(imgInfo.data, 'JPEG', 0, 0, imgInfo.width, imgInfo.height);
        } catch (err) {
            console.warn(`Sayfa ${i + 1} atlandı: ${fullUrl}`);
            // Hatalı sayfa yerine boş sayfa ekle ki sıra kaymasın
            doc.addPage(); 
            doc.text(`Sayfa ${i+1} yüklenemedi`, 20, 20);
        }
    }

    // --- 5. Kaydetme ---
    updateStatus("PDF oluşturuluyor, lütfen bekleyin...", 100);
    
    // Dosya adını temizle
    const title = document.title || "flipbook";
    const safeName = title.replace(/[^a-z0-9]/gi, '_').substring(0, 30) + ".pdf";
    
    doc.save(safeName);

    setTimeout(() => {
        ui.innerHTML = '<h3 style="color:#0f0; margin:0;">Tamamlandı!</h3><div>Dosya indiriliyor.</div>';
        setTimeout(() => ui.remove(), 3000);
    }, 1500);

})();