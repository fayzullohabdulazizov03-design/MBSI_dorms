# MBSI yotoqxona davomat tizimi

Maktab yotoqxonasi uchun o'quvchilar davomatini yuritish tizimi. Statik sayt (Vercel) + Supabase bulut bazasi.

## Fayllar

- `index.html` — butun ilova (UI + logika)
- `supabase-config.js` — Supabase URL va anon key
- `supabase-setup.sql` — bulut jadvali, RLS va realtime sozlamalari
- `vercel.json` — Vercel statik hosting sozlamasi

## Nega Supabase kerak?

Supabase ulanmagan bo'lsa, ma'lumot faqat brauzer xotirasida (IndexedDB/localStorage) saqlanadi:

- har bir qurilma/brauzerda alohida baza;
- link orqali kirgan boshqa odam siz kiritgan ma'lumotni ko'rmaydi;
- sayt boshqa domenda ochilsa yoki brauzer xotirasi tozalansa, ma'lumot yo'qoladi.

Supabase ulangach barcha xodimlar bitta umumiy bazani ko'radi va o'zgarishlar real vaqtda tarqaladi.

## Sozlash (bir marta)

### 1. Supabase loyihasi yaratish

1. https://supabase.com saytiga kirib ro'yxatdan o'ting.
2. **New project** → nomi: `mbsi-dorm`, hudud: O'zbekistonga yaqinini tanlang (masalan Frankfurt).
3. Baza parolini saqlab qo'ying va loyiha tayyor bo'lishini kuting.

### 2. Jadvalni yaratish

1. Supabase chap menyusidan **SQL Editor** → **New query**.
2. `supabase-setup.sql` faylining butun matnini joylashtiring.
3. **Run** tugmasini bosing.

Bu quyidagilarni yaratadi:

- `public.dormitory_state` jadvali (butun baza bitta JSON qatorda, `id = 1`);
- RLS: faqat tizimga kirgan (`authenticated`) xodimlar o'qiy va yozadi;
- realtime: o'zgarishlar boshqa qurilmalarga darhol tarqaladi.

### 3. Xodim akkaunti yaratish

1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email va kuchli parol kiriting.
3. **Auto Confirm User** belgisini yoqing (aks holda login ishlamaydi).
4. **Create user**.

Bu bitta umumiy xodim akkaunti. Keyinchalik har bir xodimga alohida akkaunt ham ochish mumkin.

### 4. URL va kalitni olish

1. **Project Settings** → **API** (yoki **API Keys**).
2. Quyidagilarni nusxalang:
   - **Project URL** — `https://xxxxx.supabase.co`
   - **anon public** yoki **publishable** key — `eyJ...` / `sb_publishable_...`

Bu ikkalasini `supabase-config.js` ga yozing:

```js
window.DORM_SUPABASE_URL = "https://xxxxx.supabase.co";
window.DORM_SUPABASE_ANON_KEY = "eyJ...";
```

> ⚠️ **service_role** kalitini hech qachon saytga qo'ymang va hech kimga bermang. Faqat anon/publishable kalit ishlatiladi — u ochiq bo'lishi normal, xavfsizlikni RLS ta'minlaydi.

### 5. Deploy

O'zgarishlarni GitHub'ga push qiling — Vercel avtomatik qayta deploy qiladi. Sayt ochilganda login oynasi chiqadi.

## Muhim: eski lokal ma'lumotni ko'chirish

Agar siz allaqachon saytda o'quvchilar qo'shgan bo'lsangiz, ular faqat shu brauzerda saqlangan. Bulutga ko'chirish uchun:

1. O'sha brauzerda (ma'lumot bor qurilmada) birinchi bo'lib login qiling.
2. Bulut hali bo'sh bo'lsa, ilova joriy lokal ma'lumotni avtomatik bulutga yuklaydi.
3. Keyin boshqa qurilmalarda login qilsangiz, hamma bir xil ma'lumotni ko'radi.

Agar bulutda allaqachon ma'lumot bo'lsa, login paytida bulutdagi ma'lumot ustun bo'ladi (lokal ma'lumot almashtiriladi). Shuning uchun birinchi login ma'lumot bor qurilmada bo'lishi kerak.

## Zaxira

Sidebar pastida:

- **Zaxira olish** — barcha o'quvchilar va davomatni JSON faylga yuklaydi;
- **Bulutga ko'chirish** — JSON zaxirani bulutga yuklaydi (login talab qilinadi).

## Excel

- Oylik davomat → **Excelga yuklash**
- Hisobotlar → **Hisobotni Excelga yuklash**

Hisobotlarda ota-ona telefon raqamlari chiqarilmaydi.
