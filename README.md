# AgroNext - Web tabanlı Akıllı Sera Paneli

Teknofest Tarım Teknolojileri yarışması için geliştirilen akıllı sera izleme web arayüzü.
-# Bu bir Prototip versiyonudur. Bu site şuanlık Neon Postgres data sunucusuna bağlıdır ve tüm değerler tahminidir.

## Özellikler

- **Dashboard**: Sıcaklık, nem, toprak nemi, pH, CO₂, ışık, mineral sensörleri
<img width="1176" height="499" alt="Screenshot 2026-03-10 at 11 34 01" src="https://github.com/user-attachments/assets/39cc49dc-4ef1-4db8-994d-ebec6d40f093" />

- **I/O Durumları**: Sulama pompası, biyopestisit püskürtme, ısıtıcı/soğutucu
<img width="1174" height="321" alt="Screenshot 2026-03-10 at 11 34 19" src="https://github.com/user-attachments/assets/17bec1ad-98c1-45b7-80ab-d411fa0dcb0b" />

- **Günlük Karşılaştırma**: Son 14 günün ortalama değerleri grafiklerle
 <img width="1181" height="1143" alt="Screenshot 2026-03-10 at 11 35 00" src="https://github.com/user-attachments/assets/3d823ec0-5dac-4eac-b571-9870de2f0825" />


## Kurulum
- Kurulum için Cursor yazılım uygulaması kullanılması önerilir.

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

`http://localhost:3000` adresinde çalışır. **DATABASE_URL** yoksa örnek verilerle çalışır.

## Neon PostgreSQL

1. [Neon.tech](https://neon.tech) üzerinde proje oluşturun
2. `.env.local` dosyasına ekleyin:
   ```
   DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
   ```
3. Veritabanını doldurmak için: `npm run db:seed` (ilk kez) veya `npm run db:seed:force` (verileri yenile)

## Vercel Deploy

1. Projeyi GitHub'a push edin
2. [Vercel](https://vercel.com) üzerinden import edin
3. Environment Variables'a `DATABASE_URL` ekleyin (Neon connection string)
4. Deploy edin
