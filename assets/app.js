/* HerCyberWorld site app — no build tools needed. */
(function () {
  "use strict";
  const CFG = window.HCW_CONFIG || {};
  const app = document.getElementById("app");

  /* ---------- taxonomy ---------- */
  const LEARN_PATHS = [
    { id: "fundamentals", code: "01-basics", name: "Cyber Fundamentals" },
    { id: "network", code: "tcp/ip", name: "Network Security" },
    { id: "web", code: "owasp", name: "Web App Security" },
    { id: "ethical-hacking", code: "nmap -sV", name: "Ethical Hacking" },
    { id: "linux", code: "sudo su", name: "Linux & Tools" },
    { id: "crypto", code: "sha256", name: "Cryptography" },
    { id: "ctf", code: "flag{}", name: "CTF Write-ups" },
    { id: "career", code: "~/career", name: "Career & Certs" }
  ];
  const DEFEND_TOPICS = [
    { id: "phishing", code: "!phish", name: "Phishing & Scams" },
    { id: "passwords", code: "2fa:on", name: "Passwords & 2FA" },
    { id: "social", code: "@privacy", name: "Social Media & Privacy" },
    { id: "mobile", code: "apk?", name: "Phone & App Safety" },
    { id: "money", code: "rs.", name: "Online Payments & Fraud" },
    { id: "harassment", code: "block", name: "Online Harassment" },
    { id: "family", code: "kids", name: "Family & Kids Online" }
  ];
  const BOARDS = [
    { id: "community", name: "Community" },
    { id: "beginners", name: "Beginner Q&A" },
    { id: "careers", name: "Careers & Certs" },
    { id: "ctf", name: "CTF & Labs" },
    { id: "scam-alerts", name: "Scam Alerts" },
    { id: "resources", name: "Resources" }
  ];
  const nameOf = (list, id) => (list.find((x) => x.id === id) || { name: "General" }).name;

  /* ---------- helpers ---------- */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const md = (s) => { try { return DOMPurify.sanitize(marked.parse(s || "")); } catch (e) { return "<p>" + esc(s) + "</p>"; } };
  const splitSlides = (s) => (s || "").split(/\n\s*---\s*\n/).map((x) => x.trim()).filter(Boolean);
  const words = (s) => (s || "").split(/\s+/).filter(Boolean).length;
  const fmtDate = (d) => { if (!d) return ""; const t = new Date(d + (String(d).length === 10 ? "T00:00:00" : "")); return isNaN(t) ? "" : t.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); };
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  function parseFM(text) {
    const m = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/.exec(text || "");
    if (!m) return { meta: {}, body: text || "" };
    const meta = {};
    m[1].split(/\r?\n/).forEach((line) => {
      const i = line.indexOf(":");
      if (i < 1) return;
      const k = line.slice(0, i).trim();
      let v = line.slice(i + 1).trim();
      if (/^\[.*\]$/.test(v)) v = v.slice(1, -1).split(",").map((x) => x.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      else v = v.replace(/^["']|["']$/g, "");
      if (v === "true") v = true; else if (v === "false") v = false;
      meta[k] = v;
    });
    return { meta, body: text.slice(m[0].length) };
  }

  /* ---------- data ---------- */
  let DATA = null;
  async function loadManifest() {
    if (DATA) return DATA;
    try {
      const r = await fetch("content/manifest.json?v=" + Date.now());
      if (!r.ok) throw new Error(r.status);
      DATA = await r.json();
    } catch (e) {
      DATA = { learn: [], defend: [], connect: [], error: true };
    }
    ["learn", "defend", "connect"].forEach((k) => { DATA[k] = (DATA[k] || []).slice().sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || String(b.date || "").localeCompare(String(a.date || ""))); });
    return DATA;
  }
  async function loadDoc(section, slug) {
    const file = section === "connect" ? "topic.md" : "lesson.md";
    const r = await fetch(`content/${section}/${encodeURIComponent(slug)}/${file}?v=${Date.now()}`);
    if (!r.ok) throw new Error("not found");
    return parseFM(await r.text());
  }
  const fileUrl = (section, slug, f) => `content/${section}/${encodeURIComponent(slug)}/${encodeURIComponent(f)}`;

  /* ---------- shared UI pieces ---------- */
  const ICONS = {
    learn: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 17l6-5-6-5"/><path d="M12 19h8"/></svg>',
    connect: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>',
    defend: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>'
  };

  function lessonCard(section, p) {
    const cover = p.cover ? fileUrl(section, p.slug, p.cover) : (p.images && p.images.length ? fileUrl(section, p.slug, p.images[0]) : null);
    const taxList = section === "defend" ? DEFEND_TOPICS : LEARN_PATHS;
    const taxId = section === "defend" ? p.topic : p.path;
    const tax = nameOf(taxList, taxId);
    const code = (taxList.find((x) => x.id === taxId) || { code: "" }).code;
    const info = p.type === "slides" ? `${(p.images || []).length + (p.textSlides || 0)} slides${p.pdf ? " · PDF" : ""}` : `${p.minutes || 1} min read`;
    return `<a class="card ${section === "defend" ? "defend" : ""}" href="#/${section}/${encodeURIComponent(p.slug)}">
      <div class="cover">${cover ? `<img src="${esc(cover)}" alt="" loading="lazy">` : `<div class="art"><span class="code">${esc(code)}</span><span class="big">${esc(tax)}</span></div>`}<span class="kind">${p.type === "slides" ? "Slides" : "Article"}</span></div>
      <div class="body"><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>
      <div class="meta"><span class="chip">${esc(tax)}</span>${p.level ? `<span class="chip lvl-${esc(p.level)}">${esc(p.level)}</span>` : ""}<span>${info}${p.exercises ? ` · ${p.exercises} exercise${p.exercises === 1 ? "" : "s"}` : ""}</span></div></div></a>`;
  }
  function threadRow(t) {
    const initials = (nameOf(BOARDS, t.board) || "?").slice(0, 2).toUpperCase();
    return `<a class="thread" href="#/connect/${encodeURIComponent(t.slug)}">
      <span class="av" aria-hidden="true">${esc(initials)}</span>
      <span style="min-width:0"><span class="meta" style="padding:0;margin:0"><span class="chip">${esc(nameOf(BOARDS, t.board))}</span>${t.pinned ? '<span class="pin">Pinned</span>' : ""}<span>${esc(fmtDate(t.date))}</span></span>
      <h3>${esc(t.title)}</h3><p>${esc(t.summary || "")}</p></span><span class="arrow" aria-hidden="true">→</span></a>`;
  }
  const emptyBox = (title, text) => `<div class="empty"><h3>${title}</h3><p>${text}</p></div>`;

  /* ---------- giscus ---------- */
  function giscusReady() { const g = CFG.giscus || {}; return !!(g.repo && g.repoId && g.categoryId && !/YOUR-GITHUB/.test(g.repo)); }
  function mountGiscus(el, term) {
    if (!giscusReady()) {
      el.innerHTML = `<div class="setup-note"><strong>Discussions are not yet configured.</strong> Fill in the <code>giscus</code> settings in <code>config.js</code> (README step 4) and comments will appear here. Visitors sign in with a free GitHub account to post.</div>`;
      return;
    }
    const g = CFG.giscus;
    const s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    const theme = new URL("assets/giscus-pink.css", location.href.split("#")[0]).href;
    const attrs = { repo: g.repo, "repo-id": g.repoId, category: g.category || "Connect", "category-id": g.categoryId, mapping: "specific", term: term, strict: "1", "reactions-enabled": "1", "emit-metadata": "0", "input-position": "top", theme: /^https:/.test(theme) ? theme : "light", lang: "en", loading: "lazy" };
    Object.keys(attrs).forEach((k) => s.setAttribute("data-" + k, attrs[k]));
    s.crossOrigin = "anonymous"; s.async = true;
    el.innerHTML = ""; el.appendChild(s);
  }
  const discussionsUrl = () => (CFG.githubUser && !/YOUR-GITHUB/.test(CFG.githubUser)) ? `https://github.com/${CFG.githubUser}/${CFG.repo}/discussions` : null;

  /* ---------- views ---------- */
  async function viewHome() {
    const d = await loadManifest();
    const latestLearn = d.learn.slice(0, 3), latestDefend = d.defend.slice(0, 3), threads = d.connect.slice(0, 4);
    const ls = d.learn.slice(0, 3).map((p) => (p.type === "slides" ? "slides/" : "blog/") + p.slug).join("\n") || "(first lesson coming soon)";
    app.innerHTML = `
    <section class="hero"><div class="wrap">
      <div>
        <div class="eyebrow">Cybersecurity education</div>
        <h1>Practical security skills, <em>made accessible</em>.</h1>
        <p class="lede">HerCyberWorld offers structured lessons, an open learning community and everyday security awareness, created by Simran Karki for beginners and growing professionals alike.</p>
        <div class="ctas"><a class="btn btn-hot" href="#/learn">Explore lessons</a><a class="btn btn-ghost" href="#/defend">Security awareness</a></div>
        <div class="trust">
          <div><strong>${d.learn.length}</strong><span>Lessons</span></div>
          <div><strong>${d.defend.length}</strong><span>Awareness guides</span></div>
          <div><strong>${d.connect.length}</strong><span>Discussions</span></div>
          <div><strong>${LEARN_PATHS.length}</strong><span>Learning paths</span></div>
        </div>
      </div>
      <div class="terminal" aria-label="Terminal summary"><div class="bar"><i></i><i></i><i></i><span>hercyberworld — bash</span></div>
<pre><span class="p">$</span> whoami
<span class="c">simran karki · cybersecurity learner &amp; educator</span>

<span class="p">$</span> cat mission.txt
<span class="c">Make security knowledge clear, practical
and open to everyone.</span>

<span class="p">$</span> ls ./learn
<span class="c">${esc(ls)}</span>

<span class="p">$</span> ./security-checkup --status
<span class="ok">[ok]</span> <span class="c">ready when you are</span>
<span class="p">$</span> <span class="cursor"></span></pre></div>
    </div></section>

    <section class="block"><div class="wrap">
      <div class="sec-head"><div><div class="eyebrow">The platform</div><h2>Three ways to build your security knowledge</h2><p>Study the fundamentals, learn alongside others, and apply simple habits that keep you safe.</p></div></div>
      <div class="pillars">
        <a class="pillar" href="#/learn"><span class="ic">${ICONS.learn}</span><span class="cmd">01 / learn</span><h3>Learn</h3><p>Slide decks and articles covering networking, web security, ethical hacking, Linux and cryptography, from beginner to advanced.</p><span class="go">Browse ${d.learn.length} lessons →</span></a>
        <a class="pillar" href="#/connect"><span class="ic">${ICONS.connect}</span><span class="cmd">02 / connect</span><h3>Connect</h3><p>Moderated discussions where learners ask questions, share resources and support each other's progress.</p><span class="go">Join ${d.connect.length} discussions →</span></a>
        <a class="pillar" href="#/defend"><span class="ic">${ICONS.defend}</span><span class="cmd">03 / defend</span><h3>Defend</h3><p>Plain-language awareness guides on scams, passwords and privacy, with a self-assessment and a phishing quiz.</p><span class="go">Read ${d.defend.length} guides →</span></a>
      </div>
    </div></section>

    <section class="block alt"><div class="wrap">
      <div class="sec-head"><div><div class="eyebrow">Learn</div><h2>Latest lessons</h2></div><a class="btn btn-ghost btn-sm" href="#/learn">View all lessons</a></div>
      ${latestLearn.length ? `<div class="grid">${latestLearn.map((p) => lessonCard("learn", p)).join("")}</div>` : emptyBox("No lessons yet", "New lessons are published regularly.")}
    </div></section>

    <section class="block"><div class="wrap">
      <div class="sec-head"><div><div class="eyebrow">Defend</div><h2>Security awareness</h2></div><a class="btn btn-ghost btn-sm" href="#/defend">Take the security checkup</a></div>
      ${latestDefend.length ? `<div class="grid">${latestDefend.map((p) => lessonCard("defend", p)).join("")}</div>` : emptyBox("No guides yet", "Awareness guides are on their way.")}
    </div></section>

    <section class="block alt"><div class="wrap">
      <div class="sec-head"><div><div class="eyebrow">Connect</div><h2>Community discussions</h2></div><a class="btn btn-ghost btn-sm" href="#/connect">View all discussions</a></div>
      ${threads.length ? `<div class="threads">${threads.map(threadRow).join("")}</div>` : emptyBox("No discussions yet", "Discussions open soon.")}
    </div></section>

    <section class="block"><div class="wrap">
      <div class="band"><div><h2>Start with the fundamentals</h2><p>New to cybersecurity? Begin with the core concepts and build from there at your own pace.</p></div><a class="btn btn-hot" href="#/learn">Start learning</a></div>
    </div></section>`;
  }

  function listView(section) {
    const isLearn = section === "learn";
    const tax = isLearn ? LEARN_PATHS : DEFEND_TOPICS;
    const key = isLearn ? "path" : "topic";
    const state = { type: "all", tax: "", level: "", q: "" };
    return async function () {
      const d = await loadManifest();
      const items = d[section];
      app.innerHTML = `
      <section class="page-head"><div class="wrap">
        <div class="eyebrow">${isLearn ? "Learn" : "Defend"}</div>
        <h1>${isLearn ? "Cybersecurity lessons" : "Security awareness"}</h1>
        <p>${isLearn ? "Slide decks and articles organised into learning paths, from core concepts to hands-on technical skills. Filter by topic and level to find your next lesson." : "Clear, practical guidance for staying safe online, written for everyone regardless of technical background. Assess your habits, test your judgement, then read the guides."}</p>
      </div></section>
      ${isLearn ? "" : defendTools()}
      <section class="block"><div class="wrap">
        ${isLearn ? "" : '<div class="sec-head"><div><div class="eyebrow">Guides</div><h2>Awareness guides</h2></div></div>'}
        <div class="pathbar" id="taxbar">${tax.map((t) => `<button data-t="${t.id}"><span class="c">${esc(t.code)}</span>${esc(t.name)}</button>`).join("")}</div>
        <div class="filters">
          <div class="seg" role="group" aria-label="Format"><button data-type="all" class="on">All</button><button data-type="slides">Slides</button><button data-type="blog">Articles</button></div>
          ${isLearn ? '<select id="fLevel" aria-label="Level"><option value="">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>' : ""}
          <input id="fSearch" type="search" placeholder="${isLearn ? "Search lessons" : "Search guides"}" aria-label="Search">
        </div>
        <div class="grid" id="grid"></div><div id="empty"></div>
      </div></section>`;
      if (!isLearn) wireDefendTools();

      const draw = () => {
        const q = state.q.toLowerCase();
        const list = items.filter((p) => (state.type === "all" || p.type === state.type) && (!state.tax || p[key] === state.tax) && (!state.level || p.level === state.level) &&
          (!q || [p.title, p.summary, (p.tags || []).join(" "), nameOf(tax, p[key])].join(" ").toLowerCase().includes(q)));
        document.getElementById("grid").innerHTML = list.map((p) => lessonCard(section, p)).join("");
        document.getElementById("empty").innerHTML = list.length ? "" : (items.length ? emptyBox("Nothing matches", "Try another path, level or search word.") : emptyBox(d.error ? "Couldn't load content" : "Nothing here yet", d.error ? "The content list (content/manifest.json) is missing. See the README." : "New content is published regularly."));
        document.querySelectorAll("#taxbar button").forEach((b) => b.classList.toggle("on", b.dataset.t === state.tax));
      };
      document.getElementById("taxbar").onclick = (e) => { const b = e.target.closest("button"); if (b) { state.tax = state.tax === b.dataset.t ? "" : b.dataset.t; draw(); } };
      document.querySelector(".seg").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; state.type = b.dataset.type; document.querySelectorAll(".seg button").forEach((x) => x.classList.toggle("on", x === b)); draw(); };
      const lv = document.getElementById("fLevel"); if (lv) lv.onchange = (e) => { state.level = e.target.value; draw(); };
      document.getElementById("fSearch").oninput = (e) => { state.q = e.target.value; draw(); };
      draw();
    };
  }

  /* ---------- Defend tools: checkup + quiz ---------- */
  const CHECKS = [
    "I use a different password for every important account",
    "I use a password manager (or a safe written notebook at home)",
    "Two-factor authentication (2FA) is on for email and social media",
    "My phone has a screen lock (PIN, fingerprint or face)",
    "My phone and apps are set to update automatically",
    "I never share OTP codes, even with 'bank staff' or 'friends'",
    "My social media profiles are set to private or friends-only",
    "I check links before clicking (hover or long-press to preview)",
    "I only install apps from the official Play Store / App Store",
    "I back up my photos and important files"
  ];
  const QUIZ = [
    { from: "SMS · +977 98XXXXXXXX", msg: "Dear customer, your SIM will be <b>BLOCKED TODAY</b> due to incomplete KYC. Update now: http://sim-kyc-update.xyz", phish: true, why: "Urgent threat + a strange link + a random personal number. Telecom companies don't block SIMs through links in SMS. Visit an official outlet instead." },
    { from: "Email · statements@yourbank", msg: "Your monthly account statement is ready. Open your bank's official app to view it. We will never ask for your PIN or OTP.", phish: false, why: "No link, no urgency, and it points you to the official app you already have. Still, always open the app yourself rather than clicking." },
    { from: "Instagram DM · your friend", msg: "omg is this you in this video?? <b>bit.ly/vid-xx</b>", phish: true, why: "A classic account-takeover trick. Your friend's account is probably hacked. The link leads to a fake login page. Message them another way to warn them." },
    { from: "SMS · Delivery", msg: "Your parcel is on hold at customs. Pay Rs. 150 clearance fee within 2 hours: http://parcel-release-np.top", phish: true, why: "Small fee + time pressure + odd domain. The goal is to steal your card or wallet details." },
    { from: "Email · Google (no-reply@accounts.google.com)", msg: "New sign-in on a Windows device. If this was you, you don't need to do anything. If not, we'll help you secure your account.", phish: false, why: "This is how real security alerts look. To be safe, don't click. Open your Google account settings yourself and check recent activity." }
  ];
  function defendTools() {
    return `<section class="block" style="padding-bottom:0"><div class="wrap"><div class="defend-tools">
      <div class="panel">
        <div class="eyebrow">Self-assessment</div><h3>Security checkup</h3>
        <p class="muted" style="margin:0">Select the practices you already follow. Responses are stored only on this device.</p>
        <div class="meter" aria-hidden="true"><i id="meterFill" style="width:0%"></i></div>
        <div class="score" id="score"></div>
        <ul class="checklist" id="checklist">${CHECKS.map((c, i) => `<li><label><input type="checkbox" id="chk${i}" data-i="${i}"><span>${esc(c)}</span></label></li>`).join("")}</ul>
      </div>
      <div class="panel quiz">
        <div class="eyebrow">Interactive exercise</div><h3>Spot the phish</h3>
        <p class="muted" style="margin:0">Review each message and decide whether it is legitimate or a phishing attempt.</p>
        <div id="quizBox"></div>
      </div>
    </div></div></section>`;
  }
  function wireDefendTools() {
    const saved = store.get("hcw-checkup", []);
    const boxes = [...document.querySelectorAll("#checklist input")];
    const upd = () => {
      const on = boxes.filter((b) => b.checked).length;
      document.getElementById("meterFill").style.width = (on / boxes.length * 100) + "%";
      const msg = on === boxes.length ? "10 of 10 — excellent security hygiene." : on >= 7 ? `${on} of 10 — strong. Address the remaining items.` : on >= 4 ? `${on} of 10 — good foundation. Keep improving.` : `${on} of 10 — start with 2FA and unique passwords.`;
      document.getElementById("score").textContent = msg;
      boxes.forEach((b) => b.nextElementSibling.classList.toggle("done", b.checked));
    };
    boxes.forEach((b) => { b.checked = saved.includes(+b.dataset.i); b.onchange = () => { store.set("hcw-checkup", boxes.filter((x) => x.checked).map((x) => +x.dataset.i)); upd(); }; });
    upd();

    let qi = 0, right = 0;
    const box = document.getElementById("quizBox");
    const show = () => {
      if (qi >= QUIZ.length) {
        box.innerHTML = `<div class="fb good" style="margin-top:14px"><strong>You scored ${right}/${QUIZ.length}.</strong> ${right === QUIZ.length ? "Every message identified correctly." : "Review the phishing guides below to strengthen your judgement."}</div><p><button class="btn btn-ghost btn-sm" id="qAgain">Restart exercise</button></p>`;
        document.getElementById("qAgain").onclick = () => { qi = 0; right = 0; show(); };
        return;
      }
      const q = QUIZ[qi];
      box.innerHTML = `<div class="score">Message ${qi + 1} of ${QUIZ.length}</div><div class="msg"><b>${esc(q.from)}</b>\n${q.msg}</div>
        <div class="ans"><button class="btn btn-hot btn-sm" data-a="1">Phishing</button><button class="btn btn-ghost btn-sm" data-a="0">Legitimate</button></div><div id="fb"></div>`;
      box.querySelector(".ans").onclick = (e) => {
        const b = e.target.closest("button"); if (!b) return;
        const ok = (b.dataset.a === "1") === q.phish; if (ok) right++;
        box.querySelectorAll(".ans button").forEach((x) => (x.disabled = true));
        document.getElementById("fb").innerHTML = `<div class="fb ${ok ? "good" : "bad"}"><strong>${ok ? "Correct." : "Incorrect."}</strong> ${esc(q.why)}</div><p><button class="btn btn-ghost btn-sm" id="qNext">${qi === QUIZ.length - 1 ? "See score" : "Next message"}</button></p>`;
        document.getElementById("qNext").onclick = () => { qi++; show(); };
      };
    };
    show();
  }

  /* ---------- reader (learn + defend) ---------- */
  let keyHandler = null;
  async function viewLesson(section, slug) {
    const d = await loadManifest();
    const item = d[section].find((x) => x.slug === slug);
    let doc;
    try { doc = await loadDoc(section, slug); } catch (e) { return notFound(); }
    const meta = Object.assign({}, doc.meta, item || {});
    const isDefend = section === "defend";
    const tax = isDefend ? nameOf(DEFEND_TOPICS, meta.topic) : nameOf(LEARN_PATHS, meta.path);
    const crumbs = `<div class="crumbs"><a href="#/${section}">← ${isDefend ? "Defend" : "Learn"}</a></div><div class="eyebrow">${esc(tax)}${meta.level ? " · " + esc(meta.level) : ""}</div>`;
    const pdf = meta.pdf ? `<p style="margin-top:24px"><a class="btn btn-ghost" href="${esc(fileUrl(section, slug, meta.pdf))}" target="_blank" rel="noopener">Download PDF</a></p>` : "";
    const discuss = `<section class="discuss ${meta.type === "slides" ? "wide" : ""}"><div class="box"><h2>Discussion</h2><p class="muted" style="margin-top:0">Questions or insights about this ${isDefend ? "guide" : "lesson"}? Share them below.</p><div id="giscus"></div></div></section>`;

    if (meta.type === "slides") {
      const slides = [...(meta.images || []).map((f) => ({ img: fileUrl(section, slug, f) })), ...splitSlides(doc.body).map((t) => ({ md: t }))];
      app.innerHTML = `<div class="deck">${crumbs}<h1>${esc(meta.title)}</h1>${meta.summary ? `<p class="muted" style="margin:0">${esc(meta.summary)}</p>` : ""}
        ${slides.length ? `<div class="stage" id="stage" tabindex="0" aria-roledescription="slide viewer" aria-live="polite"></div>
        <div class="controls"><button class="btn btn-ghost btn-sm" id="prev">← Prev</button><span class="num" id="num"></span><button class="btn btn-hot btn-sm" id="next">Next →</button><button class="btn btn-ghost btn-sm" id="fs">Full screen</button></div>
        <div class="thumbs" id="thumbs">${slides.map((_, k) => `<button data-k="${k}" aria-label="Slide ${k + 1}">${k + 1}</button>`).join("")}</div>` : emptyBox("No slides yet", "Add images or text slides to this lesson's folder.")}${pdf}</div>${discuss}`;
      if (slides.length) {
        let i = 0;
        const stage = document.getElementById("stage");
        const show = () => {
          const s = slides[i];
          stage.innerHTML = (s.img ? `<img src="${esc(s.img)}" alt="Slide ${i + 1}">` : `<div class="slide-text">${md(s.md)}</div><span class="tag">hercyberworld</span>`) + `<span class="corner">${i + 1}/${slides.length}</span>`;
          document.getElementById("num").textContent = `${i + 1} / ${slides.length}`;
          document.getElementById("prev").disabled = i === 0;
          document.getElementById("next").disabled = i === slides.length - 1;
          document.querySelectorAll("#thumbs button").forEach((b, k) => b.classList.toggle("on", k === i));
        };
        const go = (n) => { i = Math.min(slides.length - 1, Math.max(0, i + n)); show(); };
        document.getElementById("prev").onclick = () => go(-1);
        document.getElementById("next").onclick = () => go(1);
        document.getElementById("thumbs").onclick = (e) => { const b = e.target.closest("button"); if (b) { i = +b.dataset.k; show(); } };
        stage.onclick = (e) => { const r = stage.getBoundingClientRect(); go(e.clientX - r.left < r.width / 3 ? -1 : 1); };
        document.getElementById("fs").onclick = () => { if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {}); };
        keyHandler = (e) => { if (e.target.matches("input,textarea,select")) return; if (e.key === "ArrowRight") { e.preventDefault(); go(1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); } };
        document.addEventListener("keydown", keyHandler);
        show();
      }
    } else {
      const cover = meta.cover ? `<img src="${esc(fileUrl(section, slug, meta.cover))}" alt="" style="border-radius:16px;margin:4px 0 24px;width:100%">` : "";
      app.innerHTML = `<article class="article">${crumbs}<h1>${esc(meta.title)}</h1>${meta.summary ? `<p class="lead">${esc(meta.summary)}</p>` : ""}
        <div class="byline"><span class="who">SK</span><strong>${esc(meta.author || "Simran Karki")}</strong>${meta.date ? `<span>· ${esc(fmtDate(meta.date))}</span>` : ""}<span>· ${Math.max(1, Math.round(words(doc.body) / 200))} min read</span></div>
        ${cover}<div class="prose">${md(doc.body)}</div>${pdf}</article>${discuss}`;
    }
    mountGiscus(document.getElementById("giscus"), `${section}/${slug}`);
  }

  /* ---------- connect ---------- */
  function viewConnect() {
    const state = { board: "" };
    return async function () {
      const d = await loadManifest();
      const forum = discussionsUrl();
      app.innerHTML = `
      <section class="page-head"><div class="wrap">
        <div class="eyebrow">Connect</div><h1>Community discussions</h1>
        <p>A moderated space to ask questions, share resources and report scams. Reading is open to everyone; posting requires a free GitHub account.</p>
      </div></section>
      <section class="block"><div class="wrap connect-layout">
        <div>
          <div class="pathbar" id="boards"><button data-b="" class="on">All</button>${BOARDS.map((b) => `<button data-b="${b.id}">${esc(b.name)}</button>`).join("")}</div>
          <div class="threads" id="threads"></div><div id="empty"></div>
        </div>
        <aside style="display:grid;gap:16px">
          <div class="rules"><strong style="font-family:var(--f-display);font-size:17px;color:var(--ink)">Community guidelines</strong>
            <ol><li>Be respectful. Everyone starts somewhere.</li><li>No requests for unauthorised access or illegal activity.</li><li>Never share passwords, OTPs or personal data.</li><li>Cite sources where possible.</li><li>Harassment is not tolerated and will be removed.</li></ol></div>
          <div class="panel"><strong style="font-family:var(--f-display);font-size:17px;color:var(--ink)">Suggest a topic</strong>
            <p class="muted" style="margin:6px 0 12px">Open a thread on the community forum. Selected topics are featured here.</p>
            ${forum ? `<a class="btn btn-hot btn-sm" href="${esc(forum)}" target="_blank" rel="noopener">Open forum</a>` : `<span class="muted" style="font-size:14px">Forum link appears once <code>githubUser</code> is set in config.js.</span>`}</div>
        </aside>
      </div></section>`;
      const draw = () => {
        const list = d.connect.filter((t) => !state.board || t.board === state.board);
        document.getElementById("threads").innerHTML = list.map(threadRow).join("");
        document.getElementById("empty").innerHTML = list.length ? "" : emptyBox("No discussions in this category", "Select another category or suggest a topic.");
        document.querySelectorAll("#boards button").forEach((b) => b.classList.toggle("on", b.dataset.b === state.board));
      };
      document.getElementById("boards").onclick = (e) => { const b = e.target.closest("button"); if (b) { state.board = b.dataset.b; draw(); } };
      draw();
    };
  }
  async function viewThread(slug) {
    const d = await loadManifest();
    const item = d.connect.find((x) => x.slug === slug) || {};
    let doc;
    try { doc = await loadDoc("connect", slug); } catch (e) { return notFound(); }
    const meta = Object.assign({}, doc.meta, item);
    app.innerHTML = `<article class="article"><div class="crumbs"><a href="#/connect">← Connect</a></div>
      <div class="meta" style="padding:0"><span class="chip">${esc(nameOf(BOARDS, meta.board))}</span>${meta.pinned ? '<span class="pin">Pinned</span>' : ""}<span>Started by ${esc(meta.author || "Simran Karki")}</span>${meta.date ? `<span>· ${esc(fmtDate(meta.date))}</span>` : ""}</div>
      <h1>${esc(meta.title)}</h1><div class="prose">${md(doc.body)}</div></article>
      <section class="discuss"><div class="box"><h2>Replies</h2><p class="muted" style="margin-top:0">Use reactions to highlight the most helpful replies.</p><div id="giscus"></div></div></section>`;
    mountGiscus(document.getElementById("giscus"), `connect/${slug}`);
  }

  function viewAbout() {
    const L = CFG.links || {};
    const links = [L.linkedin && `<a class="btn btn-ghost btn-sm" href="${esc(L.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`, L.instagram && `<a class="btn btn-ghost btn-sm" href="${esc(L.instagram)}" target="_blank" rel="noopener">Instagram</a>`, L.email && `<span class="chip" style="font-size:13px">${esc(L.email)}</span>`].filter(Boolean).join(" ");
    app.innerHTML = `
      <section class="page-head"><div class="wrap"><div class="eyebrow">About</div><h1>About HerCyberWorld</h1><p>An independent cybersecurity education platform founded by Simran Karki.</p></div></section>
      <section class="block"><div class="wrap about-grid">
      <div class="prose">
        <p>HerCyberWorld exists to make cybersecurity knowledge clear, practical and accessible. Content is published in two formats: concise slide decks for quick study and in-depth articles for detailed understanding.</p>
        <p>The platform is built on a simple belief: security skills should be open to everyone. It has a particular focus on encouraging women and newcomers to enter the field with confidence, and on helping the wider public protect themselves online.</p>
        <p>All technical material is provided for educational purposes. Practice techniques only on systems you own or have explicit permission to test.</p>
        ${links ? `<p style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${links}</p>` : ""}
      </div>
      <div class="stack">
        <div><strong>Learn</strong>Structured lessons from fundamentals to hands-on skills: networking, Linux, web security, ethical hacking and CTFs.</div>
        <div><strong>Connect</strong>A moderated community for questions, resource sharing and peer support.</div>
        <div><strong>Defend</strong>Plain-language security awareness covering scams, passwords, privacy and online safety.</div>
      </div>
    </div></section>`;
  }
  function notFound() {
    app.innerHTML = `<div class="wrap block">${emptyBox("Page not found", 'That page moved or never existed. <a href="#/">Go home</a>.')}</div>`;
  }

  /* ---------- router ---------- */
  const learnList = listView("learn"), defendList = listView("defend"), connectList = viewConnect();
  async function route() {
    if (keyHandler) { document.removeEventListener("keydown", keyHandler); keyHandler = null; }
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean).map(decodeURIComponent);
    const [sec, slug] = parts;
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("on", a.dataset.nav === sec));
    try {
      if (!sec) await viewHome();
      else if (sec === "learn") slug ? await viewLesson("learn", slug) : await learnList();
      else if (sec === "defend") slug ? await viewLesson("defend", slug) : await defendList();
      else if (sec === "connect") slug ? await viewThread(slug) : await connectList();
      else if (sec === "about") viewAbout();
      else notFound();
    } catch (e) { console.error(e); notFound(); }
    const title = { learn: "Learn", defend: "Defend", connect: "Connect", about: "About" }[sec];
    document.title = title ? `${title} · HerCyberWorld` : "HerCyberWorld";
    window.scrollTo(0, 0);
  }
  document.getElementById("yr").textContent = new Date().getFullYear();
  window.addEventListener("hashchange", route);
  route();
})();
