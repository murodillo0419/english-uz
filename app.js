(() => {
  'use strict';

  const KEY = 'englishUz.v1';
  const T = window.TOPICS, SENT = window.SENTENCES, GR = window.GRAMMAR;
  const app = document.getElementById('app');

  // ---------- Yordamchi funksiyalar ----------
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a, n) => shuffle(a).slice(0, n);
  const norm = s => String(s).toLowerCase().replace(/[.,!?'’"]/g, '').replace(/\s+/g, ' ').trim();
  const dayNum = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); };

  function speak(text) {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 0.9;
      speechSynthesis.speak(u);
    } catch (e) { /* ovoz yo'q bo'lsa jim */ }
  }

  // ---------- Saqlash (localStorage) ----------
  const defaults = () => ({ xp: 0, streak: 0, lastDay: null, today: { day: 0, xp: 0 }, goal: 20, cards: {}, custom: [], done: {} });
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) return Object.assign(defaults(), s); } catch (e) { }
    return defaults();
  }
  let S = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };

  const todayXp = () => (S.today.day === dayNum() ? S.today.xp : 0);
  const streakNow = () => (S.lastDay !== null && S.lastDay >= dayNum() - 1 ? S.streak : 0);
  const level = () => Math.floor(S.xp / 100) + 1;

  function addXp(n) {
    const d = dayNum();
    if (S.today.day !== d) S.today = { day: d, xp: 0 };
    if (S.lastDay !== d) { S.streak = S.lastDay === d - 1 ? S.streak + 1 : 1; S.lastDay = d; }
    S.today.xp += n; S.xp += n;
    save(); renderStats();
  }
  function renderStats() {
    document.getElementById('stats').innerHTML =
      `<span>🔥 ${streakNow()}</span><span>⭐ ${S.xp}</span><span>Lv ${level()}</span>`;
  }

  // ---------- So'zlar va kartochkalar ----------
  function allWords() {
    const a = [];
    T.forEach(t => t.words.forEach(w => a.push({ id: t.id + ':' + w.en, en: w.en, uz: w.uz, topic: t.id })));
    S.custom.forEach(w => a.push({ id: 'c:' + w.id, en: w.en, uz: w.uz, topic: 'custom' }));
    return a;
  }
  const wordById = id => allWords().find(w => w.id === id);
  function ensureCard(id) {
    if (!S.cards[id]) S.cards[id] = { ef: 2.5, rep: 0, int: 0, due: dayNum() };
  }
  const dueIds = () => Object.keys(S.cards).filter(id => S.cards[id].due <= dayNum() && wordById(id));

  // SM-2 algoritmi: q = 1 (qiyin), 4 (yaxshi), 5 (oson)
  function grade(id, q) {
    const c = S.cards[id]; if (!c) return;
    if (q < 3) { c.rep = 0; c.int = 0; c.due = dayNum(); }
    else {
      c.int = c.rep === 0 ? 1 : c.rep === 1 ? 6 : Math.round(c.int * c.ef);
      c.rep += 1;
      c.due = dayNum() + c.int;
    }
    c.ef = Math.max(1.3, c.ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    save();
  }

  // ---------- Router ----------
  const routes = {
    '': viewHome, lessons: viewLessons, lesson: viewLesson, review: viewReview,
    builder: viewBuilder, speak: viewSpeak, grammar: viewGrammar, words: viewWords
  };
  const routeName = () => location.hash.replace(/^#\/?/, '').split('/')[0];
  function route() {
    try { speechSynthesis.cancel(); } catch (e) { }
    const name = routeName();
    (routes[name] || viewHome)();
    const active = name === 'lesson' ? 'lessons' : name;
    document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', a.dataset.r === active));
    window.scrollTo(0, 0);
  }

  // ---------- Bosh sahifa ----------
  function ring(p) {
    const r = 44, c = 2 * Math.PI * r, q = Math.min(1, p);
    return `<svg class="ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="${r}" class="ring-bg"/>
      <circle cx="50" cy="50" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - q)}" transform="rotate(-90 50 50)"/>
      <text x="50" y="57" text-anchor="middle" class="ring-t">${Math.round(q * 100)}%</text></svg>`;
  }
  function viewHome() {
    const due = dueIds().length;
    const known = Object.values(S.cards).filter(c => c.int >= 21).length;
    const next = T.find(t => S.done[t.id] === undefined);
    const tx = todayXp();
    app.innerHTML = `
      <div class="card hero">
        ${ring(tx / S.goal)}
        <div>
          <h3>Bugungi maqsad</h3>
          <div class="muted">${tx} / ${S.goal} XP</div>
          <div class="muted">${tx >= S.goal ? 'Maqsad bajarildi! 🎉' : 'Har kuni oz-ozdan, shunda streak uzilmaydi.'}</div>
        </div>
      </div>
      <div class="grid">
        <div class="card stat"><b>🔥 ${streakNow()}</b>kun ketma-ket</div>
        <div class="card stat"><b>⭐ ${S.xp}</b>jami XP (Lv ${level()})</div>
        <div class="card stat"><b>🔁 ${due}</b>takrorlash kerak</div>
        <div class="card stat"><b>🧠 ${known}</b>mustahkam so'z</div>
      </div>
      ${next
        ? `<a class="btn big" href="#/lessons">Davom etish: ${next.emoji} ${esc(next.title)}</a>`
        : `<a class="btn big" href="#/lessons">Darslarni qayta ko'rish</a>`}
      ${due ? `<a class="btn big alt" href="#/review">Takrorlash (${due})</a>` : ''}
      <div class="card" style="margin-top:16px">
        <h3>Sozlamalar</h3>
        <label class="muted">Kunlik maqsad</label>
        <select data-a="goal">${[10, 20, 50, 100].map(g => `<option value="${g}" ${g === S.goal ? 'selected' : ''}>${g} XP</option>`).join('')}</select>
        <p><button class="btn danger" data-a="reset">Progressni tozalash</button></p>
        <p class="muted" style="font-size:13px">Hamma ma'lumot faqat shu brauzerda (telefon yoki kompyuteringda) saqlanadi.</p>
      </div>`;
  }

  // ---------- Darslar ----------
  function viewLessons() {
    app.innerHTML = `<h2>Darslar</h2><p class="muted">Mavzuni tanla. Har darsda 10 ta yangi so'z va mashqlar bor.</p>` +
      T.map(t => {
        const best = S.done[t.id];
        return `<div class="card topic">
          <div class="em">${t.emoji}</div>
          <div class="grow"><h3>${esc(t.title)}</h3>
            <span class="badge ${best !== undefined ? 'good' : ''}">${best !== undefined ? "Eng yaxshi: " + best + '%' : 'Yangi'}</span></div>
          <button class="btn" data-a="startLesson" data-id="${t.id}">${best !== undefined ? 'Qayta' : 'Boshlash'}</button>
        </div>`;
      }).join('');
  }

  let run = null;
  function startLesson(id) {
    const t = T.find(x => x.id === id);
    run = { t, phase: 'intro', queue: [], idx: 0, locked: false, last: null, first: 0, firstOk: 0 };
    location.hash = '#/lesson';
  }
  function viewLesson() {
    if (!run) { location.hash = '#/lessons'; return; }
    renderLesson();
  }
  function mkOpts(word, key, pool) {
    const others = pool.filter(x => x[key] !== word[key] && x.id !== word.id);
    return shuffle([word, ...pick(others, 3)]);
  }
  function beginQuestions() {
    const pool = allWords();
    const qs = [];
    run.t.words.forEach((w, i) => {
      const word = { id: run.t.id + ':' + w.en, en: w.en, uz: w.uz };
      qs.push({ type: 'choose', w: word, opts: mkOpts(word, 'uz', pool) });
      qs.push(i % 2 ? { type: 'listen', w: word, opts: mkOpts(word, 'en', pool) } : { type: 'type', w: word });
    });
    run.queue = shuffle(qs); run.idx = 0; run.phase = 'q';
    renderLesson();
  }
  function renderLesson() {
    const r = run;
    if (r.phase === 'intro') {
      app.innerHTML = `<h2>${r.t.emoji} ${esc(r.t.title)}</h2>
        <p class="muted">Yangi so'zlar. Bosib, talaffuzini eshit, keyin mashqni boshla.</p>
        ${r.t.words.map(w => `<button class="row" data-a="say" data-t="${esc(w.en)}"><b>${esc(w.en)}</b><span>${esc(w.uz)}</span><i>🔊</i></button>`).join('')}
        <button class="btn big" data-a="beginQ">Mashqni boshlash</button>`;
      return;
    }
    if (r.phase === 'done') {
      app.innerHTML = `<div class="card center">
        <div style="font-size:56px">🎉</div><h2>Dars tugadi!</h2>
        <div class="score">${r.acc}%</div>
        <p class="muted">Birinchi urinishda to'g'ri javoblar. +10 XP bonus oldingiz.</p>
        <p class="muted">So'zlar takrorlash ro'yxatiga qo'shildi.</p>
      </div>
      <div class="two"><a class="btn" href="#/review">Takrorlash</a><a class="btn alt" href="#/lessons">Darslar</a></div>`;
      return;
    }
    const q = r.queue[r.idx];
    if (!q) return finishLesson();
    const w = q.w;
    const pct = Math.round((r.idx / r.queue.length) * 100);
    let body = '';
    if (q.type === 'choose') {
      body = `<p class="q">«${esc(w.en)}» o'zbekchada nima?</p><p><button class="say" data-a="say" data-t="${esc(w.en)}">🔊</button></p>` + optsHtml(q, 'uz');
    } else if (q.type === 'listen') {
      body = `<p class="q">Eshit va to'g'ri so'zni tanla</p><p><button class="say" data-a="say" data-t="${esc(w.en)}">🔊</button></p>` + optsHtml(q, 'en');
    } else {
      body = `<p class="q">«${esc(w.uz)}» inglizchada?</p>
        <form data-form="typed"><input type="text" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" ${r.locked ? 'disabled value="' + esc(r.last.given) + '"' : ''} placeholder="Inglizcha yoz...">
        ${r.locked ? '' : '<button class="btn big" type="submit">Tekshirish</button>'}</form>`;
    }
    const fb = r.locked
      ? `<div class="feedback ${r.last.ok ? 'ok' : 'bad'}">${r.last.ok ? "✅ To'g'ri!" : "❌ To'g'ri javob: <b>" + esc(w.en) + '</b> (' + esc(w.uz) + ')'}</div>
         <button class="btn big" data-a="next">Davom etish</button>` : '';
    app.innerHTML = `<div class="bar"><i style="width:${pct}%"></i></div>${body}${fb}`;
    if (q.type === 'listen' && !r.locked) setTimeout(() => speak(w.en), 200);
    if (q.type === 'type' && !r.locked) { const i = document.getElementById('ans'); if (i) i.focus(); }
  }
  function optsHtml(q, key) {
    const r = run;
    return q.opts.map((o, i) => {
      let cls = '';
      if (r.locked) { if (o.id === q.w.id) cls = 'ok'; else if (i === r.last.i) cls = 'bad'; }
      return `<button class="opt ${cls}" data-a="opt" data-i="${i}" ${r.locked ? 'disabled' : ''}>${esc(o[key])}</button>`;
    }).join('');
  }
  function answerQ(ok, given, i) {
    const r = run, q = r.queue[r.idx];
    r.locked = true; r.last = { ok, given, i };
    if (!q.retried) { r.first++; if (ok) r.firstOk++; }
    if (ok) { addXp(q.retried ? 1 : 2); if (q.type !== 'listen') speak(q.w.en); }
    else if (!q.retried) r.queue.push(Object.assign({}, q, { retried: true, opts: q.opts ? shuffle(q.opts) : undefined }));
    renderLesson();
  }
  function finishLesson() {
    const r = run;
    r.t.words.forEach(w => ensureCard(r.t.id + ':' + w.en));
    r.acc = r.first ? Math.round((100 * r.firstOk) / r.first) : 100;
    S.done[r.t.id] = Math.max(S.done[r.t.id] || 0, r.acc);
    r.phase = 'done';
    save(); addXp(10);
    renderLesson();
  }

  // ---------- Takrorlash (Anki kabi) ----------
  let rv = null;
  function viewReview() {
    const ids = shuffle(dueIds()).slice(0, 20);
    if (!Object.keys(S.cards).length) {
      app.innerHTML = `<h2>Takrorlash</h2><div class="card center"><p>Hali kartochka yo'q.</p><p class="muted">Avval darsni tugat yoki «So'zlar» bo'limida o'z so'zingni qo'sh.</p><a class="btn" href="#/lessons">Darslarga o'tish</a></div>`;
      return;
    }
    if (!ids.length) {
      const next = Math.min(...Object.values(S.cards).map(c => c.due)) - dayNum();
      app.innerHTML = `<h2>Takrorlash</h2><div class="card center"><div style="font-size:48px">🎉</div><p><b>Bugungi takrorlash tugadi!</b></p><p class="muted">Keyingi takrorlash ${next <= 1 ? 'ertaga' : next + ' kundan keyin'}.</p></div>`;
      return;
    }
    rv = { queue: ids, idx: 0, shown: false, total: ids.length };
    renderReview();
  }
  function renderReview() {
    if (routeName() !== 'review') return;
    const id = rv.queue[rv.idx];
    if (!id) {
      app.innerHTML = `<div class="card center"><div style="font-size:56px">✅</div><h2>Zo'r!</h2><p class="muted">${rv.total} ta kartochka takrorlandi.</p><a class="btn" href="#/review">Yana tekshirish</a></div>`;
      return;
    }
    const w = wordById(id);
    const pct = Math.round((rv.idx / rv.queue.length) * 100);
    app.innerHTML = `<div class="bar"><i style="width:${pct}%"></i></div>
      <div class="card center">
        <div class="big-word">${esc(w.en)}</div>
        <p><button class="say" data-a="say" data-t="${esc(w.en)}">🔊</button></p>
        ${rv.shown ? `<div class="big-word" style="color:var(--brand)">${esc(w.uz)}</div>` : ''}
      </div>
      ${rv.shown
        ? `<div class="two"><button class="btn danger" data-a="grade" data-q="1">Qiyin</button><button class="btn" data-a="grade" data-q="4">Yaxshi</button><button class="btn alt" data-a="grade" data-q="5">Oson</button></div>`
        : `<button class="btn big" data-a="show">Javobni ko'rsat</button>`}`;
    if (!rv.shown) speak(w.en);
  }

  // ---------- Gap tuzish ----------
  let bd = null;
  function newBuilder() {
    const s = SENT[Math.floor(Math.random() * SENT.length)];
    bd = { s, pool: shuffle(s.en.split(' ').map((t, i) => ({ t, i }))), ans: [], res: null };
  }
  function viewBuilder() { if (!bd || bd.res === 'ok') newBuilder(); renderBuilder(); }
  function renderBuilder() {
    if (routeName() !== 'builder') return;
    const inAns = new Set(bd.ans.map(x => x.i));
    app.innerHTML = `<h2>Gap tuz</h2><p class="muted">Inglizchasini so'zlarni bosib tartib bilan yig'.</p>
      <div class="card"><b>${esc(bd.s.uz)}</b></div>
      <div class="chips">${bd.ans.map(x => `<button class="chip in" data-a="unpick" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div>
      <div class="chips" style="border:0;padding:0">${bd.pool.filter(x => !inAns.has(x.i)).map(x => `<button class="chip" data-a="pick" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div>
      ${bd.res === 'bad' ? `<div class="feedback bad">❌ To'g'ri javob: <b>${esc(bd.s.en)}</b></div>` : ''}
      ${bd.res === 'ok' ? `<div class="feedback ok">✅ To'g'ri! +5 XP</div>` : ''}
      ${bd.res === 'ok'
        ? `<button class="btn big" data-a="bnext">Keyingi gap</button>`
        : `<div class="two"><button class="btn" data-a="check" ${bd.ans.length ? '' : 'disabled'}>Tekshirish</button><button class="btn alt" data-a="bclear">Tozalash</button></div>
           ${bd.res === 'bad' ? '<button class="btn big alt" data-a="bnext">Boshqa gap</button>' : ''}`}`;
  }

  // ---------- Gapirish ----------
  let sp = null;
  const onSpeak = () => routeName() === 'speak';
  function newSpeak() {
    const pool = [...SENT.map(s => s.en), ...pick(allWords().map(w => w.en), 6)];
    sp = { text: pool[Math.floor(Math.random() * pool.length)], heard: null, score: null, err: null, listening: false };
  }
  function viewSpeak() { if (!sp) newSpeak(); renderSpeak(); }
  function similarity(target, heard) {
    const t = norm(target).split(' '), h = new Set(norm(heard).split(' '));
    return t.filter(x => h.has(x)).length / t.length;
  }
  function renderSpeak() {
    if (!onSpeak()) return;
    app.innerHTML = `<h2>Gapir</h2><p class="muted">Gapni eshit, keyin mikrofonni bosib o'zing ayt.</p>
      <div class="card center"><div class="q">${esc(sp.text)}</div>
        <button class="say" data-a="say" data-t="${esc(sp.text)}">🔊 Eshit</button></div>
      <button class="btn big" data-a="mic" ${sp.listening ? 'disabled' : ''}>${sp.listening ? '🎙️ Eshityapman...' : '🎤 Gapirish'}</button>
      ${sp.err ? `<div class="feedback bad">${esc(sp.err)}</div>` : ''}
      ${sp.heard !== null ? `<div class="feedback ${sp.score >= 0.8 ? 'ok' : 'bad'}">Eshitdim: «${esc(sp.heard)}»<br>Moslik: ${Math.round(sp.score * 100)}% ${sp.score >= 0.8 ? '✅ +5 XP' : "— yana urinib ko'r"}</div>` : ''}
      <button class="btn big alt" data-a="snext">Boshqa gap</button>`;
  }
  function startMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { sp.err = "Brauzering ovoz tanishni qo'llamaydi. Chrome (telefon yoki kompyuter) yoki Safari ishlat."; return renderSpeak(); }
    const rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = false;
    sp.listening = true; sp.err = null; sp.heard = null; renderSpeak();
    rec.onresult = e => {
      sp.heard = e.results[0][0].transcript;
      sp.score = similarity(sp.text, sp.heard);
      sp.listening = false;
      if (sp.score >= 0.8) addXp(5);
      renderSpeak();
    };
    rec.onerror = e => {
      sp.listening = false;
      sp.err = e.error === 'not-allowed' ? 'Mikrofonga ruxsat ber.' : e.error === 'no-speech' ? "Ovoz eshitilmadi, qayta urinib ko'r." : 'Xatolik: ' + e.error;
      renderSpeak();
    };
    rec.onend = () => { if (sp.listening) { sp.listening = false; renderSpeak(); } };
    try { rec.start(); } catch (e) { sp.listening = false; renderSpeak(); }
  }

  // ---------- Grammatika ----------
  function viewGrammar() {
    app.innerHTML = `<h2>Grammatika</h2><p class="muted">Qisqa tushuntirishlar va misollar.</p>` +
      GR.map(g => `<details class="card gr"><summary>${esc(g.title)}</summary>
        <p>${esc(g.intro)}</p>
        <ul>${g.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        ${g.examples.map(e => `<div class="ex"><button class="say" style="font-size:16px;padding:2px 10px" data-a="say" data-t="${esc(e.en)}">🔊</button> <b>${esc(e.en)}</b><small>${esc(e.uz)}</small></div>`).join('')}
      </details>`).join('');
  }

  // ---------- So'zlar ----------
  let query = '';
  function viewWords() {
    app.innerHTML = `<h2>So'zlar</h2>
      <div class="card"><h3>O'z so'zingni qo'sh</h3>
        <form data-form="addword">
          <input type="text" id="w-en" placeholder="Inglizcha (masalan: invoice)" autocomplete="off" style="margin-bottom:8px">
          <input type="text" id="w-uz" placeholder="O'zbekcha (masalan: hisob-faktura)" autocomplete="off" style="margin-bottom:8px">
          <button class="btn big" type="submit" style="margin-top:0">Qo'shish</button>
        </form></div>
      <input type="text" data-a="search" placeholder="🔎 Qidirish..." value="${esc(query)}" style="margin-bottom:12px">
      <div id="wl"></div>`;
    renderWordList();
  }
  function renderWordList() {
    const q = query.trim().toLowerCase();
    const list = allWords().filter(w => !q || w.en.toLowerCase().includes(q) || w.uz.toLowerCase().includes(q));
    const el = document.getElementById('wl'); if (!el) return;
    el.innerHTML = list.map(w => {
      const c = S.cards[w.id];
      const st = !c ? ['yangi', ''] : c.int >= 21 ? ['mustahkam', 'good'] : ["o'rganilmoqda", ''];
      return `<div class="row static"><button class="say" style="font-size:16px;padding:2px 10px" data-a="say" data-t="${esc(w.en)}">🔊</button>
        <b style="flex:1;margin-left:8px">${esc(w.en)}</b><span>${esc(w.uz)}</span>
        <span class="badge ${st[1]}" style="flex:none">${st[0]}</span>
        ${w.topic === 'custom' ? `<button class="say" style="font-size:14px;padding:2px 10px" data-a="del" data-id="${esc(w.id)}">🗑</button>` : ''}</div>`;
    }).join('') || '<p class="muted">Hech narsa topilmadi.</p>';
  }

  // ---------- Hodisalar ----------
  const A = {
    say: el => speak(el.dataset.t),
    startLesson: el => startLesson(el.dataset.id),
    beginQ: () => beginQuestions(),
    opt: el => {
      if (run.locked) return;
      const q = run.queue[run.idx], i = +el.dataset.i;
      answerQ(q.opts[i].id === q.w.id, q.opts[i].id, i);
    },
    next: () => { run.idx++; run.locked = false; run.last = null; renderLesson(); },
    show: () => { rv.shown = true; renderReview(); },
    grade: el => {
      const q = +el.dataset.q, id = rv.queue[rv.idx];
      grade(id, q);
      addXp(q === 5 ? 2 : q === 4 ? 1 : 0);
      if (q < 3) rv.queue.push(id);
      rv.idx++; rv.shown = false; renderReview();
    },
    pick: el => { const t = bd.pool.find(x => x.i === +el.dataset.i); if (t && !bd.ans.includes(t)) { bd.ans.push(t); bd.res = null; renderBuilder(); } },
    unpick: el => { bd.ans = bd.ans.filter(x => x.i !== +el.dataset.i); bd.res = null; renderBuilder(); },
    check: () => {
      const ok = norm(bd.ans.map(x => x.t).join(' ')) === norm(bd.s.en);
      bd.res = ok ? 'ok' : 'bad';
      if (ok) { addXp(5); speak(bd.s.en); }
      renderBuilder();
    },
    bclear: () => { bd.ans = []; bd.res = null; renderBuilder(); },
    bnext: () => { newBuilder(); renderBuilder(); },
    mic: () => startMic(),
    snext: () => { newSpeak(); renderSpeak(); },
    del: el => {
      if (!confirm("Bu so'zni o'chirasanmi?")) return;
      const id = el.dataset.id;
      S.custom = S.custom.filter(w => 'c:' + w.id !== id);
      delete S.cards[id]; save(); renderWordList();
    },
    reset: () => {
      if (!confirm("Hamma progress o'chib ketadi. Ishonchingiz komilmi?")) return;
      S = defaults(); save(); renderStats(); viewHome();
    }
  };

  app.addEventListener('click', e => {
    const el = e.target.closest('[data-a]');
    if (el && A[el.dataset.a] && el.tagName !== 'SELECT' && el.tagName !== 'INPUT') A[el.dataset.a](el);
  });
  app.addEventListener('change', e => {
    if (e.target.dataset.a === 'goal') { S.goal = +e.target.value; save(); viewHome(); }
  });
  app.addEventListener('input', e => {
    if (e.target.dataset.a === 'search') { query = e.target.value; renderWordList(); }
  });
  app.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target.dataset.form;
    if (f === 'typed') {
      if (run.locked) return;
      const val = document.getElementById('ans').value;
      if (!val.trim()) return;
      answerQ(norm(val) === norm(run.queue[run.idx].w.en), val.trim());
    } else if (f === 'addword') {
      const en = document.getElementById('w-en').value.trim();
      const uz = document.getElementById('w-uz').value.trim();
      if (!en || !uz) return;
      const id = Date.now().toString(36);
      S.custom.push({ id, en, uz });
      ensureCard('c:' + id);
      save(); viewWords();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const n = app.querySelector('[data-a="next"]');
    if (n && document.activeElement && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); n.click(); }
    else if (n && run && run.locked) { e.preventDefault(); n.click(); }
  });

  window.addEventListener('hashchange', route);
  renderStats();
  route();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('sw.js').catch(() => { });
  }
})();
