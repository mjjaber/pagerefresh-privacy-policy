/* Kitchen Atlas — ingredient matching, filtering, rendering. */
(function () {
  "use strict";

  var DISHES = window.DISHES || [];
  var LS_PANTRY = "ka.pantry.v1", LS_THEME = "ka.theme", LS_IMG = "ka.img.", LS_MODE = "ka.mode";

  /* ---------- ingredient catalog ---------- */
  var CATALOG = {};                      // key -> number of dishes using it
  DISHES.forEach(function (d) {
    d.ing.forEach(function (i) { CATALOG[i[0]] = (CATALOG[i[0]] || 0) + 1; });
  });
  var CATALOG_KEYS = Object.keys(CATALOG).sort();

  /* Things almost every kitchen has — never counted as missing. */
  var ASSUMED = ["salt","black pepper","water","oil","sugar","flour","baking powder",
                 "baking soda","white pepper","ice","vinegar","soy sauce","olive oil"];

  /* Words that mean the same shelf. Any member satisfies any other. */
  var EQUIV = [
    ["chicken","chicken thighs","chicken breast"],
    ["pasta","spaghetti","noodles"],
    ["tomato","canned tomatoes"],
    ["lentils","red lentils"],
    ["butter","ghee","niter kibbeh"],
    ["cheese","cheddar","parmesan"],
    ["chili","dried chili","scotch bonnet"],
    ["chili powder","chili flakes"],
    ["bell pepper","green pepper"],
    ["beef","ground beef"],
    ["onion","shallot"],
    ["olive oil","oil"],
    ["beans","black beans"]
  ];
  var EQUIV_OF = {};
  EQUIV.forEach(function (g) { g.forEach(function (k) { EQUIV_OF[k] = g; }); });

  /* Everyday names that map onto a catalog key. */
  var SYNONYMS = {
    "aubergine":"eggplant","aubergines":"eggplant","brinjal":"eggplant",
    "courgette":"zucchini","courgettes":"zucchini",
    "capsicum":"bell pepper","sweet pepper":"bell pepper","red pepper":"bell pepper",
    "peppers":"bell pepper","pepper":"bell pepper",
    "coriander":"cilantro","fresh coriander":"cilantro","coriander leaves":"cilantro",
    "ground coriander":"coriander seed","coriander seeds":"coriander seed",
    "scallion":"spring onion","scallions":"spring onion","green onion":"spring onion",
    "green onions":"spring onion","spring onions":"spring onion",
    "mince":"ground beef","minced beef":"ground beef","beef mince":"ground beef",
    "ground meat":"ground beef","minced meat":"ground beef","lamb mince":"ground beef",
    "minced lamb":"ground beef","ground lamb":"ground beef","ground pork":"ground beef",
    "prawn":"shrimp","prawns":"shrimp","king prawns":"shrimp",
    "garbanzo":"chickpeas","garbanzos":"chickpeas","garbanzo beans":"chickpeas",
    "chick peas":"chickpeas","chickpea":"chickpeas",
    "yoghurt":"yogurt","greek yogurt":"yogurt","greek yoghurt":"yogurt","natural yoghurt":"yogurt",
    "curd cheese":"cottage cheese","twarog":"cottage cheese","ricotta":"cottage cheese",
    "double cream":"cream","heavy cream":"cream","single cream":"cream","whipping cream":"cream",
    "plain flour":"flour","all purpose flour":"flour","all-purpose flour":"flour","bread flour":"flour",
    "chilli":"chili","chillies":"chili","chilies":"chili","chile":"chili",
    "jalapeno":"chili","serrano":"chili","birds eye chilli":"chili",
    "chilli flakes":"chili flakes","red pepper flakes":"chili flakes","pul biber":"chili flakes",
    "chilli powder":"chili powder","cayenne":"chili powder",
    "beet":"beetroot","beets":"beetroot",
    "cheddar cheese":"cheddar","parmigiano":"parmesan","pecorino":"parmesan","gruyere":"cheese",
    "spring greens":"cabbage","white cabbage":"cabbage",
    "sweet potatoes":"sweet potato","spuds":"potato","potatoes":"potato",
    "tinned tomatoes":"canned tomatoes","chopped tomatoes":"canned tomatoes",
    "passata":"canned tomatoes","tomato puree":"tomato paste","tomato pure":"tomato paste",
    "tinned tuna":"canned tuna","tuna":"canned tuna",
    "lardons":"bacon","pancetta":"bacon","guanciale":"bacon","streaky bacon":"bacon",
    "cod":"white fish","haddock":"white fish","sea bass":"white fish","tilapia":"white fish",
    "pollock":"white fish","fish":"white fish","fish fillets":"white fish",
    "stock cube":"stock","broth":"stock","chicken stock":"stock","vegetable stock":"stock",
    "creme fraiche":"sour cream","soured cream":"sour cream",
    "pak choi":"cabbage","bok choy":"cabbage",
    "bulghur":"bulgur","burghul":"bulgur","cracked wheat":"bulgur",
    "gochujang paste":"gochujang","miso paste":"miso",
    "black pepper corns":"black peppercorns","peppercorns":"black peppercorns",
    "seaweed":"nori","nori sheets":"nori",
    "spring water":"water","maple":"maple syrup","honey":"sugar",
    "eggs":"egg","olives":"olives","mushroom":"mushrooms","peas":"peas",
    "lime juice":"lime","lemon juice":"lemon","limes":"lime","lemons":"lemon",
    "garlic cloves":"garlic","garlic clove":"garlic",
    "fresh ginger":"ginger","ginger root":"ginger",
    "basmati":"rice","jasmine rice":"rice","white rice":"rice","long grain rice":"rice",
    "vermicelli":"rice noodles","rice noodle":"rice noodles",
    "macaroni":"pasta","penne":"pasta","fusilli":"pasta","tagliatelle":"pasta","noodle":"noodles",
    "flat bread":"pita","flatbread":"pita","pita bread":"pita","tortillas":"tortilla",
    "kidney beans":"beans","black bean":"black beans","pinto beans":"beans","cannellini":"beans"
  };

  /* ---------- helpers ---------- */
  function clean(s) {
    return String(s).toLowerCase().trim()
      .replace(/[.,;:!?"'`]/g, "")
      .replace(/\s+/g, " ");
  }
  function resolve(raw) {
    var s = clean(raw);
    if (!s) return null;
    if (SYNONYMS[s]) s = SYNONYMS[s];
    if (CATALOG[s]) return s;
    // plural / singular attempts
    var tries = [];
    if (s.slice(-3) === "ies") tries.push(s.slice(0, -3) + "y");
    if (s.slice(-2) === "es") tries.push(s.slice(0, -2));
    if (s.slice(-1) === "s") tries.push(s.slice(0, -1));
    tries.push(s + "s", s + "es");
    for (var i = 0; i < tries.length; i++) {
      var t = tries[i];
      if (SYNONYMS[t] && CATALOG[SYNONYMS[t]]) return SYNONYMS[t];
      if (CATALOG[t]) return t;
    }
    // loose containment against the catalog, longest match wins
    var best = null;
    CATALOG_KEYS.forEach(function (k) {
      if (k === s) best = k;
      else if ((k.indexOf(s) === 0 || s.indexOf(k) === 0) && s.length > 2) {
        if (!best || k.length > best.length) best = k;
      }
    });
    return best || s;   // unknown items are kept as-is so nothing is silently dropped
  }
  function satisfied(key, pantrySet) {
    if (pantrySet[key]) return true;
    var g = EQUIV_OF[key];
    if (g) for (var i = 0; i < g.length; i++) if (pantrySet[g[i]]) return true;
    return false;
  }
  var EMOJI = [
    [/soup|broth|congee|çorba|corba/i, "🥣"], [/pasta|spaghetti|noodle|ragù|ragu|pad thai|pho|ramen/i, "🍝"],
    [/pizza/i, "🍕"], [/rice|biryani|paella|risotto|jollof|kabsa|maqluba|bibimbap|onigiri|koshari/i, "🍚"],
    [/curry|masala|tagine|dal|wat|adobo|goulash|feijoada|chili/i, "🍛"],
    [/salad|tabbouleh|fattoush|caprese|ceviche/i, "🥗"], [/egg|omelette|shakshuka|menemen|tortilla/i, "🍳"],
    [/fish|prawn|shrimp|seafood/i, "🐟"], [/pancake|crêpe|crepe/i, "🥞"],
    [/bread|sandwich|bánh|banh|shawarma|falafel|taco|quesadilla/i, "🥙"],
    [/dip|hummus|guacamole|tzatziki|baba/i, "🫓"], [/pie|bobotie|moussaka|quiche|gratin/i, "🥧"],
    [/schnitzel|chips|fried/i, "🍽️"], [/dumpling|pierogi/i, "🥟"]
  ];
  function emojiFor(d) {
    var hay = d.name + " " + d.tags.join(" ");
    for (var i = 0; i < EMOJI.length; i++) if (EMOJI[i][0].test(hay)) return EMOJI[i][1];
    return "🍲";
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- state ---------- */
  var pantry = [];
  try { pantry = JSON.parse(localStorage.getItem(LS_PANTRY)) || []; } catch (e) { pantry = []; }
  var view = "all", region = "", sortBy = "match", query = "";
  /* Phones default to the compact list; wider screens to picture cards. */
  var compact = window.matchMedia("(max-width:980px)").matches;
  try { var savedMode = localStorage.getItem(LS_MODE); if (savedMode) compact = savedMode === "compact"; } catch (e) {}

  function savePantry() {
    try { localStorage.setItem(LS_PANTRY, JSON.stringify(pantry)); } catch (e) {}
  }
  function pantrySet() {
    var m = {};
    pantry.forEach(function (p) { m[p] = true; });
    ASSUMED.forEach(function (p) { m[p] = true; });
    return m;
  }

  /* ---------- scoring ---------- */
  function score(d, set) {
    var have = [], need = [];
    d.ing.forEach(function (i) {
      (satisfied(i[0], set) ? have : need).push(i);
    });
    return {
      dish: d, have: have, need: need,
      pct: d.ing.length ? Math.round((have.length / d.ing.length) * 100) : 0
    };
  }
  function ranked() {
    var set = pantrySet();
    var rows = DISHES.map(function (d) { return score(d, set); });
    if (pantry.length) rows = rows.filter(function (r) { return r.have.length > 0; });
    if (view === "now") rows = rows.filter(function (r) { return r.need.length === 0; });
    if (view === "almost") rows = rows.filter(function (r) { return r.need.length > 0 && r.need.length <= 2; });
    if (region) rows = rows.filter(function (r) { return r.dish.region === region; });
    if (query) {
      var q = clean(query);
      rows = rows.filter(function (r) {
        return (r.dish.name + " " + r.dish.country + " " + r.dish.tags.join(" ") + " " +
                r.dish.blurb).toLowerCase().indexOf(q) > -1;
      });
    }
    rows.sort(function (a, b) {
      if (sortBy === "az") return a.dish.name.localeCompare(b.dish.name);
      if (sortBy === "country") return a.dish.country.localeCompare(b.dish.country);
      if (sortBy === "quick") return timeMin(a.dish.time) - timeMin(b.dish.time);
      if (b.pct !== a.pct) return b.pct - a.pct;
      return a.need.length - b.need.length;
    });
    return rows;
  }
  function timeMin(t) {
    var h = /(\d+)\s*h/.exec(t), m = /(\d+)\s*min/.exec(t);
    return (h ? parseInt(h[1], 10) * 60 : 0) + (m ? parseInt(m[1], 10) : 0);
  }

  /* ---------- images (Wikipedia, cached in this browser, graceful fallback) ---------- */
  function loadImage(el, dish) {
    var key = LS_IMG + dish.wiki, cached = null;
    try { cached = localStorage.getItem(key); } catch (e) {}
    if (cached === "none") return;
    if (cached) return paint(el, cached);

    summaryImage(dish.wiki)
      .catch(function () { return searchImage(dish.name + " dish"); })
      .then(function (url) {
        if (!url) throw 0;
        try { localStorage.setItem(key, url); } catch (e) {}
        paint(el, url);
      })
      .catch(function () { try { localStorage.setItem(key, "none"); } catch (e) {} });
  }
  function summaryImage(title) {
    return fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" +
                 encodeURIComponent(title) + "?redirect=true")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        var t = j && j.thumbnail && j.thumbnail.source;
        if (!t) throw 0;
        return t.replace(/\/\d+px-/, "/640px-");
      });
  }
  function searchImage(q) {
    return fetch("https://en.wikipedia.org/w/api.php?action=query&generator=search" +
                 "&gsrsearch=" + encodeURIComponent(q) + "&gsrlimit=1&prop=pageimages" +
                 "&piprop=thumbnail&pithumbsize=640&format=json&origin=*")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var pages = j && j.query && j.query.pages;
        for (var k in pages) if (pages[k].thumbnail) return pages[k].thumbnail.source;
        return null;
      })
      .catch(function () { return null; });
  }
  function paint(el, url) {
    var img = new Image();
    img.alt = "";
    img.onload = function () { el.innerHTML = ""; el.appendChild(img); };
    img.src = url;
  }

  /* ---------- render ---------- */
  var $ = function (s) { return document.querySelector(s); };

  function renderChips() {
    var box = $("#chips");
    box.innerHTML = pantry.map(function (p) {
      var known = !!CATALOG[p];
      return '<span class="chip" title="' + (known ? CATALOG[p] + " dishes use this" : "not in any recipe yet") +
        '">' + (known ? "" : "❓ ") + esc(p) +
        '<button data-rm="' + esc(p) + '" aria-label="remove">×</button></span>';
    }).join("");
    $("#pantry-empty").style.display = pantry.length ? "none" : "block";
  }

  function renderStats(rows) {
    var now = rows.filter(function (r) { return r.need.length === 0; }).length;
    var almost = rows.filter(function (r) { return r.need.length > 0 && r.need.length <= 2; }).length;
    $("#stat-pantry").textContent = pantry.length;
    $("#stat-now").textContent = now;
    $("#stat-almost").textContent = almost;
  }

  /* Which single missing ingredient would open up the most new dishes? */
  function renderUnlock() {
    var box = $("#unlock");
    if (!pantry.length) { box.innerHTML = '<p class="empty-note">Add a few ingredients and this will show what to buy next.</p>'; return; }
    var set = pantrySet(), tally = {};
    DISHES.forEach(function (d) {
      var r = score(d, set);
      if (r.need.length === 1) {
        var k = r.need[0][0];
        (tally[k] = tally[k] || []).push(d.name);
      }
    });
    var list = Object.keys(tally).map(function (k) { return { k: k, n: tally[k].length, ex: tally[k] }; })
      .sort(function (a, b) { return b.n - a.n; }).slice(0, 6);
    if (!list.length) { box.innerHTML = '<p class="empty-note">Nothing is one ingredient away right now — add more to your kitchen.</p>'; return; }
    box.innerHTML = '<ul class="shop-list">' + list.map(function (x) {
      return "<li><b style='text-transform:capitalize'>" + esc(x.k) + "</b> → " + x.n +
        " more dish" + (x.n > 1 ? "es" : "") + "</li>";
    }).join("") + "</ul>";
  }

  function cardHTML(r) {
    var d = r.dish, cls = r.need.length === 0 ? "full" : (r.need.length <= 2 ? "near" : "some");
    var label = r.need.length === 0 ? "Cook now" : "Missing " + r.need.length;
    var miss = r.need.length && r.need.length <= 4
      ? '<div class="missing"><b>Need:</b> ' + r.need.map(function (i) { return esc(i[0]); }).join(", ") + "</div>" : "";
    return '<article class="card" data-id="' + d.id + '" tabindex="0">' +
      '<div class="thumb" data-wiki="' + esc(d.wiki) + '" data-id="' + d.id + '">' +
        '<div class="fallback">' + emojiFor(d) + "</div>" +
        '<span class="badge ' + cls + '">' + label + "</span>" +
        '<span class="flagtag">' + d.flag + " " + esc(d.country) + "</span>" +
      "</div>" +
      '<div class="card-body">' +
        '<h3><span class="c-flag" aria-hidden="true">' + d.flag + "</span>" + esc(d.name) + "</h3>" +
        '<p class="blurb">' + esc(d.blurb) + "</p>" +
        miss +
        '<div class="bar"><i style="width:' + r.pct + '%"></i></div>' +
        '<div class="meta"><span>⏱ ' + esc(d.time) + '</span><span class="m-serves">👥 ' + d.serves +
          '</span><span class="m-diff">🎚 ' + esc(d.diff) + '</span><span class="m-pct">' + r.pct + "% matched</span>" +
          '<span class="m-status ' + (r.need.length ? "warn" : "ok") + '">' +
          (r.need.length ? "🛒 " + r.need.length + " missing" : "✅ cook now") + "</span></div>" +
      "</div></article>";
  }

  var io = null;
  function renderGrid() {
    var rows = ranked(), grid = $("#grid");
    renderStats(DISHES.map(function (d) { return score(d, pantrySet()); }));
    renderUnlock();
    var noPantry = !pantry.length;
    $("#count").textContent = noPantry && view === "all"
      ? rows.length + " dishes in the atlas — add what you have to rank them"
      : rows.length + " dish" + (rows.length === 1 ? "" : "es") +
        (noPantry ? " — add ingredients to see what you can cook" : " matching your kitchen");
    if (!rows.length) {
      grid.innerHTML = '<div class="no-results"><div class="big">' + (noPantry ? "🧺" : "🥄") + "</div><p>" +
        (noPantry
          ? "Add a few ingredients above first — then this shows the dishes you can cook right now."
          : "No dishes match that yet. Try clearing a filter, or add another ingredient.") +
        "</p></div>";
      return;
    }
    grid.className = "grid" + (compact ? " compact" : "");
    grid.innerHTML = rows.map(cardHTML).join("");
    if (io) io.disconnect();
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var d = byId(e.target.getAttribute("data-id"));
        if (d) loadImage(e.target, d);
      });
    }, { rootMargin: "300px" });
    Array.prototype.forEach.call(grid.querySelectorAll(".thumb"), function (t) { io.observe(t); });
  }
  function byId(id) {
    for (var i = 0; i < DISHES.length; i++) if (DISHES[i].id === id) return DISHES[i];
    return null;
  }

  /* Keep the screen awake while a recipe is open — phones dim halfway through
     step 3 otherwise, and wet hands do not wake them well. */
  var wakeLock = null;
  function keepAwake(on) {
    if (!("wakeLock" in navigator)) return;
    if (on) {
      navigator.wakeLock.request("screen").then(function (l) {
        wakeLock = l;
        l.addEventListener("release", function () { wakeLock = null; });
      }).catch(function () {});
    } else if (wakeLock) {
      try { wakeLock.release(); } catch (e) {}
      wakeLock = null;
    }
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" &&
        $("#overlay") && $("#overlay").classList.contains("on")) keepAwake(true);
  });

  /* ---------- modal ---------- */
  /* On a phone the dish sheet is a full screen, so the hardware/gesture back
     button must close it rather than leave the app. Each open pushes a history
     entry; back pops it. */
  function openDish(id, fromHistory) {
    var d = byId(id); if (!d) return;
    if (!fromHistory) {
      try { history.pushState({ ka: id }, "", "#" + id); } catch (e) {}
    }
    var r = score(d, pantrySet());
    var m = $("#modal");
    m.innerHTML =
      '<div class="hero" id="hero"><div class="fallback">' + emojiFor(d) + "</div>" +
        '<div class="shade"></div><button class="close-x" data-close>×</button>' +
        '<div class="titles"><h2>' + esc(d.name) + "</h2>" +
        '<div class="sub">' + d.flag + " " + esc(d.country) + " · " + esc(d.region) + "</div></div></div>" +
      '<div class="modal-body">' +
        '<div class="facts">' +
          '<span class="fact">⏱ ' + esc(d.time) + "</span>" +
          '<span class="fact">🎚 ' + esc(d.diff) + "</span>" +
          '<span class="fact">👥 Serves ' + d.serves + "</span>" +
          '<span class="fact">🧺 ' + r.have.length + "/" + d.ing.length + " ingredients in your kitchen</span>" +
          (r.need.length === 0 ? '<span class="fact" style="color:var(--good)">✅ You can cook this now</span>' : "") +
        "</div>" +
        '<div class="sec"><h4>📖 Where it comes from</h4><p>' + esc(d.history) + "</p></div>" +
        '<div class="cols">' +
          '<div class="sec"><h4>🧾 Ingredients</h4><ul class="ing">' +
            d.ing.map(function (i) {
              var has = satisfied(i[0], pantrySet());
              return '<li data-step class="' + (has ? "have" : "need") + '"><span class="mark">' +
                (has ? "✓" : "•") + "</span><span>" + esc(i[1]) + "</span></li>";
            }).join("") +
            (d.staples || []).map(function (s) {
              return '<li class="staple"><span class="mark">·</span><span>' + esc(s) + " (store cupboard)</span></li>";
            }).join("") +
          "</ul></div>" +
          '<div class="sec"><h4>👩‍🍳 Method</h4><ol class="steps">' +
            d.steps.map(function (s) { return '<li data-step><span>' + esc(s) + "</span></li>"; }).join("") +
          '</ol><p class="tap-hint">Tap a step to tick it off — the screen stays awake while this is open.</p></div>' +
        "</div>" +
        '<div class="modal-actions">' +
          '<a href="https://en.wikipedia.org/wiki/' + encodeURIComponent(d.wiki) + '" target="_blank" rel="noopener">Read more on Wikipedia ↗</a>' +
          (r.need.length ? '<button data-addall="' + d.id + '">Add the ' + r.need.length + " missing to my kitchen</button>" : "") +
          '<button data-print>Print this recipe</button>' +
        "</div>" +
      "</div>";
    loadImage($("#hero"), d);
    $("#overlay").classList.add("on");
    $("#overlay").scrollTop = 0;
    document.body.style.overflow = "hidden";
    keepAwake(true);
  }
  function closeModal(fromHistory) {
    if (!fromHistory && history.state && history.state.ka) { history.back(); return; }
    $("#overlay").classList.remove("on");
    document.body.style.overflow = "";
    keepAwake(false);
    if (!fromHistory && location.hash) {
      try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    }
  }
  window.addEventListener("popstate", function (e) {
    if (e.state && e.state.ka) openDish(e.state.ka, true);
    else closeModal(true);
  });

  /* ---------- autocomplete ---------- */
  function suggestions(q) {
    q = clean(q); if (!q) return [];
    var pool = CATALOG_KEYS.concat(Object.keys(SYNONYMS));
    var seen = {}, out = [];
    pool.forEach(function (k) {
      var canon = CATALOG[k] ? k : SYNONYMS[k];
      if (!canon || !CATALOG[canon] || seen[canon]) return;
      var i = k.indexOf(q);
      if (i === -1) return;
      seen[canon] = true;
      out.push({ key: canon, rank: i === 0 ? 0 : 1, n: CATALOG[canon] });
    });
    out.sort(function (a, b) { return a.rank - b.rank || b.n - a.n || a.key.localeCompare(b.key); });
    return out.slice(0, 8);
  }
  function renderSuggest(q) {
    var box = $("#suggest"), list = suggestions(q);
    if (!list.length) { box.classList.remove("on"); box.innerHTML = ""; return; }
    box.innerHTML = list.map(function (s, i) {
      return '<div data-pick="' + esc(s.key) + '" class="' + (i === 0 ? "hi" : "") + '">' +
        '<span style="text-transform:capitalize">' + esc(s.key) + "</span>" +
        '<span class="cnt">' + s.n + " dishes</span></div>";
    }).join("");
    box.classList.add("on");
  }

  /* ---------- pantry mutations ---------- */
  function addItem(raw) {
    var k = resolve(raw);
    if (!k) return;
    if (pantry.indexOf(k) === -1) pantry.push(k);
    savePantry(); renderChips(); renderGrid();
  }
  function removeItem(k) {
    pantry = pantry.filter(function (p) { return p !== k; });
    savePantry(); renderChips(); renderGrid();
  }

  /* ---------- quick add (most useful ingredients) ---------- */
  function renderQuickAdd() {
    var top = CATALOG_KEYS.slice().sort(function (a, b) { return CATALOG[b] - CATALOG[a]; })
      .filter(function (k) { return ASSUMED.indexOf(k) === -1; }).slice(0, 16);
    $("#quickadd").innerHTML = top.map(function (k) {
      return "<button data-quick=\"" + esc(k) + "\">+ " + esc(k) + "</button>";
    }).join("");
  }

  /* ---------- wiring ---------- */
  function measureHeader() {
    var h = document.querySelector(".topbar");
    if (h) document.documentElement.style.setProperty("--topbar-h", h.offsetHeight + "px");
  }

  function init() {
    measureHeader();
    window.addEventListener("resize", measureHeader);
    window.addEventListener("orientationchange", measureHeader);
    // regions
    var regions = {};
    DISHES.forEach(function (d) { regions[d.region] = true; });
    $("#region").innerHTML = '<option value="">All regions</option>' +
      Object.keys(regions).sort().map(function (r) { return '<option>' + esc(r) + "</option>"; }).join("");

    renderQuickAdd(); renderChips(); renderGrid();

    var input = $("#ing-input");
    $("#add").addEventListener("click", function () { addItem(input.value); input.value = ""; renderSuggest(""); });
    input.addEventListener("input", function () { renderSuggest(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var hi = $("#suggest .hi");
        addItem(hi && $("#suggest").classList.contains("on") ? hi.getAttribute("data-pick") : input.value);
        input.value = ""; renderSuggest("");
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        var items = Array.prototype.slice.call(document.querySelectorAll("#suggest div"));
        if (!items.length) return;
        e.preventDefault();
        var idx = items.findIndex(function (n) { return n.classList.contains("hi"); });
        items.forEach(function (n) { n.classList.remove("hi"); });
        idx = (idx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items[idx].classList.add("hi");
      } else if (e.key === "Escape") { renderSuggest(""); }
    });
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest && !t.closest("#suggest") && !t.closest("#ing-input")) $("#suggest").classList.remove("on");

      var pick = t.closest && t.closest("[data-pick]");
      if (pick) { addItem(pick.getAttribute("data-pick")); input.value = ""; renderSuggest(""); return; }

      var rm = t.getAttribute && t.getAttribute("data-rm");
      if (rm) { removeItem(rm); return; }

      var q = t.getAttribute && t.getAttribute("data-quick");
      if (q) { addItem(q); return; }

      var card = t.closest && t.closest(".card");
      if (card) { openDish(card.getAttribute("data-id")); return; }

      if (t.hasAttribute && t.hasAttribute("data-close")) { closeModal(); return; }
      if (t.id === "overlay") { closeModal(); return; }
      if (t.hasAttribute && t.hasAttribute("data-print")) { window.print(); return; }

      var step = t.closest && t.closest("[data-step]");
      if (step) { step.classList.toggle("done"); return; }

      var all = t.getAttribute && t.getAttribute("data-addall");
      if (all) {
        var d = byId(all), set = pantrySet();
        d.ing.forEach(function (i) { if (!satisfied(i[0], set) && pantry.indexOf(i[0]) === -1) pantry.push(i[0]); });
        savePantry(); renderChips(); renderGrid(); openDish(all);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
      if (e.key === "Enter" && document.activeElement && document.activeElement.classList.contains("card"))
        openDish(document.activeElement.getAttribute("data-id"));
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-view]"), function (b) {
      b.addEventListener("click", function () {
        view = b.getAttribute("data-view");
        Array.prototype.forEach.call(document.querySelectorAll("[data-view]"), function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        renderGrid();
      });
    });
    var modeBtn = $("#viewmode");
    function paintMode() { modeBtn.textContent = compact ? "▦" : "☰"; }
    paintMode();
    modeBtn.addEventListener("click", function () {
      compact = !compact;
      try { localStorage.setItem(LS_MODE, compact ? "compact" : "cards"); } catch (e) {}
      paintMode(); renderGrid();
    });
    $("#region").addEventListener("change", function () { region = this.value; renderGrid(); });
    $("#sort").addEventListener("change", function () { sortBy = this.value; renderGrid(); });
    $("#search").addEventListener("input", function () { query = this.value; renderGrid(); });
    $("#clear").addEventListener("click", function () {
      if (!pantry.length || confirm("Empty your kitchen list?")) { pantry = []; savePantry(); renderChips(); renderGrid(); }
    });
    $("#surprise").addEventListener("click", function () {
      var rows = ranked();
      if (rows.length) openDish(rows[Math.floor(Math.random() * Math.min(rows.length, 12))].dish.id);
    });

    // a shared/reloaded link like …/#pad-thai opens straight onto that dish
    var hash = (location.hash || "").replace("#", "");
    if (hash && byId(hash)) openDish(hash, true);

    // theme
    var saved = null;
    try { saved = localStorage.getItem(LS_THEME); } catch (e) {}
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    $("#theme").addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(LS_THEME, next); } catch (e) {}
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
