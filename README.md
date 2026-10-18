# 🇬🇧 Inglizcha: ingliz tilini o'rganish sayti

O'zbek tilida ingliz tilini o'rganish uchun oddiy sayt. Server ham, o'rnatish ham kerak emas, faqat HTML, CSS va JavaScript.

## Imkoniyatlari

- 📚 **Darslar**: 5 mavzu (salomlashish, oila, ovqat, sayohat, ish va IT), har birida 10 ta so'z. Mashqlar: tarjimani tanlash, eshitib topish, inglizcha yozish.
- 🔁 **Takrorlash**: Anki kabi kartochkalar. SM-2 algoritmi so'zni unutish arafasida qayta ko'rsatadi.
- 🧩 **Gap tuz**: so'zlarni tartib bilan yig'ib gap yasaysan.
- 🎤 **Gapir**: gapni eshitasan, mikrofonga aytasan, sayt moslikni tekshiradi.
- 📖 **Grammatika**: 6 ta mavzu, o'zbekcha tushuntirishlar bilan.
- 🔤 **So'zlar**: o'z so'zlaringni qo'shasan, ular ham takrorlashga tushadi.
- 🔥 XP, streak (kunma-kun ketma-ketlik), kunlik maqsad va darajalar.
- Ma'lumotlar faqat brauzeringda saqlanadi (`localStorage`), sayt oflayn ham ochiladi.

## Fayllar

| Fayl | Nima qiladi |
|------|-------------|
| `index.html` | Sahifaning asosi |
| `style.css` | Dizayn (yorug va qorong'i rejim) |
| `data.js` | Darslar, gaplar, grammatika. Yangi so'z qo'shish shu yerda |
| `app.js` | Hamma mantiq: mashqlar, takrorlash, XP |
| `sw.js` | Oflayn ishlashi uchun |

## Kompyuteringda ochish

`index.html` ni brauzerda ochsang bo'ldi. Mikrofon (gapirish bo'limi) esa `https` yoki `localhost` da ishlaydi, shuning uchun lokal sinash uchun:

```bash
python3 -m http.server 8000
# keyin brauzerda: http://localhost:8000
```

## GitHub ga joylash (GitHub Pages)

1. github.com da yangi repository och. Nomi masalan `english-uz`, **Public**.
2. Papkadagi 6 ta faylni yukla. Yo'li: **Add file → Upload files**, keyin **Commit changes**.
3. Repository ichida **Settings → Pages** ga kir.
4. **Source** da **Deploy from a branch** ni tanla, branch: **main**, papka: **/ (root)**, **Save** bos.
5. 1–2 daqiqadan keyin sayting shu manzilda ochiladi: `https://SENING-USERNAME.github.io/english-uz/`

Yoki terminal orqali:

```bash
git init
git add .
git commit -m "Inglizcha sayti"
git branch -M main
git remote add origin https://github.com/SENING-USERNAME/english-uz.git
git push -u origin main
```

## Yangi so'z yoki mavzu qo'shish

`data.js` faylini och va `window.TOPICS` ichiga yangi blok qo'sh:

```js
{
  id: 'rang', emoji: '🎨', title: 'Ranglar',
  words: [
    { en: 'red', uz: 'qizil' },
    { en: 'blue', uz: 'ko\'k' }
  ]
}
```

Sayt o'zi hammasini mashqlarga aylantiradi. Mashq tuzishi uchun mavzuda kamida 4 ta so'z bo'lishi kerak.

## Eslatma

- Eshitish va gapirish brauzerning o'z imkoniyatlariga tayanadi. Eng yaxshi ishlaydigani Chrome va Safari.
- Telegram yoki Instagram ichidagi brauzerlarda mikrofon ishlamasligi mumkin. Oddiy brauzerda och.
