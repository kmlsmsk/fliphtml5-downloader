# FlipHTML5 to PDF Downloader (Chrome Extension)

Bu Chrome eklentisi, FlipHTML5 platformunda yayınlanan kitapları, dergileri ve broşürleri sayfa sayfa işleyerek yüksek kalitede PDF formatına dönüştürür.

Şifreli (hash) dosya isimlerini ve `.webp` formatlarını otomatik olarak algılar ve çözer.

## 🚀 Özellikler

- **Tek Tıkla İndirme:** Karmaşık ayarlarla uğraşmanıza gerek yok.
- **Yüksek Kalite:** Sayfaları orijinal çözünürlüğünde (files/large) çeker.
- **Akıllı Algılama:** Sayfa yapısını ve dosya yollarını otomatik bulur.
- **İlerleme Çubuğu:** İndirme durumunu ekranda canlı gösterir.
- **CORS ve Format Desteği:** WebP ve JPG formatlarını Canvas kullanarak PDF uyumlu hale getirir.

## 🛠️ Kurulum (Geliştirici Modu)

Bu eklenti henüz Chrome Web Store'da yayınlanmamıştır. Tarayıcınıza manuel olarak yükleyebilirsiniz:

1. Bu repoyu bilgisayarınıza indirin (Code -> Download ZIP) ve bir klasöre çıkartın.
2. Google Chrome'u açın ve adres çubuğuna şunu yazın: `chrome://extensions/`
3. Sağ üst köşedeki **Geliştirici modu (Developer mode)** anahtarını açın.
4. Sol üstte beliren **Paketlenmemiş öğe yükle (Load unpacked)** butonuna tıklayın.
5. İndirdiğiniz klasörü seçin (`manifest.json` dosyasının olduğu klasör).
6. Eklenti tarayıcınıza yüklendi! FlipHTML5 sayfasına gidip eklenti ikonuna tıklayabilirsiniz.

## 📖 Kullanım

1. İndirmek istediğiniz FlipHTML5 kitabını açın.
2. Kitabın tamamen yüklenmesini bekleyin.
3. Tarayıcınızın sağ üst köşesindeki **Extensions (Yapboz)** menüsünden bu eklentiyi bulun ve tıklayın.
4. Ekranın sağ üst köşesinde "PDF Hazırlanıyor..." kutucuğu belirecektir.
5. İşlem bitince PDF otomatik olarak inecektir.

## ⚠️ Yasal Uyarı

Bu araç sadece eğitim amaçlıdır ve **kendi dökümanlarınızı** yedeklemeniz veya **erişim izniniz olan** materyalleri çevrimdışı okumanız için tasarlanmıştır. Telif hakkı ile korunan içeriklerin izinsiz indirilmesi ve dağıtılması yasal sorumluluk doğurabilir. Kullanıcı, aracı kullanırken tüm sorumluluğu kabul eder.

## 🤝 Katkıda Bulunma

Hata düzeltmeleri veya yeni özellikler için Pull Request gönderebilirsiniz.

---
**Lisans:** MIT License


fliphtml5-pdf-extension/
│
├── manifest.json         (Ayar dosyası)
├── background.js         (İkon tıklamasını dinleyen servis)
├── content.js            (Enjeksiyonu yapan köprü)
├── injected.js           (Sayfada çalışacak ana kod)
├── jspdf.umd.min.js      (PDF Kütüphanesi - Bunu indireceğiz)
├── icon.png              (Herhangi bir 128x128 png dosyası)
└── README.md             (Github açıklaması)
