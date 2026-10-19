// Dars ma'lumotlari: mavzular, gaplar va grammatika
window.TOPICS = [
  {
    id: 'salom', emoji: '👋', title: 'Salomlashish',
    words: [
      { en: 'hello', uz: 'salom' },
      { en: 'goodbye', uz: 'xayr' },
      { en: 'please', uz: 'iltimos' },
      { en: 'thank you', uz: 'rahmat' },
      { en: 'sorry', uz: 'kechirasiz' },
      { en: 'yes', uz: 'ha' },
      { en: 'no', uz: "yo'q" },
      { en: 'good morning', uz: 'xayrli tong' },
      { en: 'how are you', uz: 'qalaysiz' },
      { en: 'nice to meet you', uz: 'tanishganimdan xursandman' },
      { en: 'good afternoon', uz: 'xayrli kun' }
    ]
  },
  {
    id: 'oila', emoji: '👨‍👩‍👧', title: 'Oila',
    words: [
      { en: 'mother', uz: 'ona' },
      { en: 'father', uz: 'ota' },
      { en: 'brother', uz: 'aka-uka' },
      { en: 'sister', uz: 'opa-singil' },
      { en: 'son', uz: "o'g'il" },
      { en: 'daughter', uz: 'qiz farzand' },
      { en: 'grandmother', uz: 'buvi' },
      { en: 'grandfather', uz: 'bobo' },
      { en: 'family', uz: 'oila' },
      { en: 'friend', uz: "do'st" }
    ]
  },
  {
    id: 'ovqat', emoji: '🍽️', title: 'Ovqat',
    words: [
      { en: 'bread', uz: 'non' },
      { en: 'water', uz: 'suv' },
      { en: 'apple', uz: 'olma' },
      { en: 'rice', uz: 'guruch' },
      { en: 'meat', uz: "go'sht" },
      { en: 'tea', uz: 'choy' },
      { en: 'milk', uz: 'sut' },
      { en: 'egg', uz: 'tuxum' },
      { en: 'soup', uz: "sho'rva" },
      { en: 'delicious', uz: 'mazali' }
    ]
  },
  {
    id: 'sayohat', emoji: '✈️', title: 'Sayohat',
    words: [
      { en: 'ticket', uz: 'chipta' },
      { en: 'airport', uz: 'aeroport' },
      { en: 'hotel', uz: 'mehmonxona' },
      { en: 'passport', uz: 'pasport' },
      { en: 'map', uz: 'xarita' },
      { en: 'bus', uz: 'avtobus' },
      { en: 'train', uz: 'poyezd' },
      { en: 'street', uz: "ko'cha" },
      { en: 'left', uz: 'chap' },
      { en: 'right', uz: "o'ng" }
    ]
  },
  {
    id: 'ish', emoji: '💻', title: 'Ish va IT',
    words: [
      { en: 'computer', uz: 'kompyuter' },
      { en: 'program', uz: 'dastur' },
      { en: 'work', uz: 'ish' },
      { en: 'office', uz: 'ofis' },
      { en: 'meeting', uz: "yig'ilish" },
      { en: 'customer', uz: 'mijoz' },
      { en: 'problem', uz: 'muammo' },
      { en: 'solution', uz: 'yechim' },
      { en: 'install', uz: "o'rnatmoq" },
      { en: 'support', uz: "qo'llab-quvvatlash" }
    ]
  }
];

// Gap tuzish va gapirish mashqlari uchun gaplar (tinish belgisiz)
window.SENTENCES = [
  { en: 'Hello my name is Ali', uz: 'Salom, mening ismim Ali' },
  { en: 'Nice to meet you', uz: 'Tanishganimdan xursandman' },
  { en: 'How are you today', uz: 'Bugun qalaysiz' },
  { en: 'Thank you very much', uz: 'Katta rahmat' },
  { en: 'My mother is a teacher', uz: "Onam o'qituvchi" },
  { en: 'I have two brothers', uz: 'Mening ikkita akam bor' },
  { en: 'My family lives in Tashkent', uz: 'Mening oilam Toshkentda yashaydi' },
  { en: 'I want a cup of tea', uz: 'Men bir piyola choy xohlayman' },
  { en: 'The soup is very delicious', uz: "Sho'rva juda mazali" },
  { en: 'Do you like bread', uz: 'Sen nonni yoqtirasanmi' },
  { en: 'Where is the airport', uz: 'Aeroport qayerda' },
  { en: 'I need a ticket to London', uz: 'Menga Londonga chipta kerak' },
  { en: 'Turn left at the street', uz: "Ko'chada chapga buriling" },
  { en: 'I work in an office', uz: 'Men ofisda ishlayman' },
  { en: 'We have a meeting at ten', uz: "Soat o'nda yig'ilishimiz bor" },
  { en: 'The customer has a problem', uz: 'Mijozda muammo bor' },
  { en: 'I can install the program', uz: "Men dasturni o'rnata olaman" }
];

window.GRAMMAR = [
  {
    title: 'To be: am / is / are',
    intro: "«Bo'lmoq» fe'li. O'zbekchada ko'pincha tushirib qoldiriladi, inglizchada esa gapda doim bo'lishi kerak.",
    rules: [
      'I → am (I am a student)',
      'He / She / It → is (She is a teacher)',
      'You / We / They → are (They are friends)',
      "Inkor: am not / is not (isn't) / are not (aren't)",
      "Savol: fe'lni gap boshiga chiqaramiz: Are you ready?"
    ],
    examples: [
      { en: 'I am from Uzbekistan.', uz: "Men O'zbekistonlikman." },
      { en: 'He is not at home.', uz: 'U uyda emas.' },
      { en: 'Are you a student?', uz: 'Sen talabamisan?' }
    ]
  },
  {
    title: 'Present Simple (hozirgi oddiy zamon)',
    intro: 'Odat, doimiy ishlar va umumiy haqiqatlar uchun: har kuni nima qilasan.',
    rules: [
      "I / You / We / They + fe'l (I work)",
      "He / She / It + fe'l + s (She works)",
      "Inkor: do not (don't) / does not (doesn't) + fe'lning oddiy shakli",
      "Savol: Do / Does + ega + fe'l? (Does he work?)",
      "Does dan keyin fe'lga -s qo'shilmaydi!"
    ],
    examples: [
      { en: 'I work in an office.', uz: 'Men ofisda ishlayman.' },
      { en: 'She drinks tea every day.', uz: 'U har kuni choy ichadi.' },
      { en: "He doesn't like coffee.", uz: 'U qahvani yoqtirmaydi.' }
    ]
  },
  {
    title: 'Artikllar: a / an / the',
    intro: "Inglizchada ot oldidan artikl qo'yiladi. O'zbek tilida bunday narsa yo'q, shuning uchun e'tibor ber.",
    rules: [
      "a — undosh tovush bilan boshlangan sanaladigan ot oldida: a book, a car",
      "an — unli tovush bilan boshlangan ot oldida: an apple, an hour",
      'the — aniq, ma\'lum narsa oldida: The book on the table',
      "Umumiy gapda ko'plik otlarga artikl qo'yilmaydi: I like apples"
    ],
    examples: [
      { en: 'I have a computer.', uz: 'Mening kompyuterim bor.' },
      { en: 'She eats an apple.', uz: 'U olma yeydi.' },
      { en: 'The meeting is at ten.', uz: "Yig'ilish soat o'nda." }
    ]
  },
  {
    title: "Ko'plik (plurals)",
    intro: "Otning ko'pligi oxiriga qo'shimcha qo'shib yasaladi.",
    rules: [
      'Ko\'pchilik otlar: + s (book → books)',
      's, x, ch, sh bilan tugasa: + es (box → boxes)',
      'Undoshdan keyin y bo\'lsa: y → ies (city → cities)',
      "Qoidasiz: man → men, woman → women, child → children, foot → feet"
    ],
    examples: [
      { en: 'two brothers', uz: 'ikkita aka-uka' },
      { en: 'three boxes', uz: 'uchta quti' },
      { en: 'many children', uz: 'ko\'p bolalar' }
    ]
  },
  {
    title: "Past Simple (o'tgan oddiy zamon)",
    intro: "O'tmishda tugagan ish-harakat: kecha, o'tgan hafta, 2020-yilda.",
    rules: [
      "Oddiy fe'llar: + ed (work → worked, play → played)",
      "Qoidasiz fe'llar yodlanadi: go → went, see → saw, have → had, eat → ate",
      "Inkor: did not (didn't) + fe'lning oddiy shakli",
      "Savol: Did + ega + fe'l? (Did you go?)",
      "Did dan keyin fe'l o'tgan shaklga o'tmaydi!"
    ],
    examples: [
      { en: 'I worked yesterday.', uz: 'Men kecha ishladim.' },
      { en: 'She went to the airport.', uz: 'U aeroportga bordi.' },
      { en: "We didn't see him.", uz: "Biz uni ko'rmadik." }
    ]
  },
  {
    title: 'Can / Can\'t (qila olish)',
    intro: "Qobiliyat yoki ruxsat haqida gapirish uchun. «Can» dan keyin fe'l oddiy shaklda keladi.",
    rules: [
      "Darak: ega + can + fe'l (I can swim)",
      "Inkor: cannot / can't (He can't drive)",
      "Savol: Can + ega + fe'l? (Can you help me?)",
      "Can ga hech qachon -s yoki -ing qo'shilmaydi"
    ],
    examples: [
      { en: 'I can install the program.', uz: "Men dasturni o'rnata olaman." },
      { en: "She can't speak French.", uz: 'U fransuzcha gapira olmaydi.' },
      { en: 'Can you help me?', uz: 'Menga yordam bera olasanmi?' }
    ]
  }
];
