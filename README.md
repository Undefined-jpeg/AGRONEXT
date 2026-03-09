# AgroNext - Akıllı Sera Prototipi

Teknofest Tarım Teknolojileri yarışması için geliştirilen akıllı sera izleme web arayüzü.

## Özellikler

- **Dashboard**: Sıcaklık, nem, toprak nemi, pH, CO₂, ışık, mineral sensörleri
- **I/O Durumları**: Sulama pompası, biyopestisit püskürtme, ısıtıcı/soğutucu
- **Günlük Karşılaştırma**: Son 14 günün ortalama değerleri grafiklerle

## Kurulum

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
