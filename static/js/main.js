document.addEventListener("DOMContentLoaded", function () {
  // ---------- Mobile nav ----------
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  // ---------- Footer year ----------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Typed role ----------
  var typedEl = document.getElementById("typedRole");
  if (typedEl) {
    var roles = JSON.parse(typedEl.getAttribute("data-roles") || "[]");
    var roleIdx = 0, charIdx = 0, deleting = false;
    function tick() {
      var current = roles[roleIdx];
      if (!deleting) {
        charIdx++;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(tick, 1700);
          return;
        }
      } else {
        charIdx--;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 70);
    }
    if (roles.length) tick();
  }

  // ---------- Scroll reveal ----------
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  // ---------- Pixel bot ----------
  var bot = document.getElementById("bot");
  var bubble = document.getElementById("botBubble");
  var pupilL = document.getElementById("botPupilL");
  var pupilR = document.getElementById("botPupilR");
  if (!bot || !bubble) return;

  var GREETING = "beep boop — hey! I'm <b>Rohit's bot</b>. He builds AI agents that actually ship. Poke around — the good stuff lives in <b>Works</b>.";
  var LINES = [
    "Still here? Same. 🤖",
    "Fun fact: I parse 500+ electricity bills a month so nobody has to.",
    "The <b>Contact</b> page works. I tested it myself.",
    "LangGraph, FastAPI, a Raspberry Pi or two. That's the whole trick.",
    "If you're hiring — he's listening.",
    "I have exactly two eyes and no opinions on tabs vs spaces."
  ];
  var lineIdx = 0;
  var hideTimer;

  function say(html, ms) {
    bubble.innerHTML = html;
    bubble.classList.add("show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      bubble.classList.remove("show");
    }, ms || 7000);
  }

  // Welcome, once the page has settled.
  setTimeout(function () { say(GREETING, 9000); }, 1200);

  // Click for another line.
  function nextLine() {
    say(LINES[lineIdx % LINES.length], 6000);
    lineIdx++;
  }
  bot.addEventListener("click", nextLine);
  bot.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); nextLine(); }
  });

  // Eyes track the cursor. Pupils sit in a 3x3 sclera, so they can shift
  // one SVG unit in each direction before hitting the edge.
  if (pupilL && pupilR && window.matchMedia("(hover: hover)").matches) {
    var raf = null;
    var mx = 0, my = 0;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var box = bot.getBoundingClientRect();
        if (!box.width) return;
        var cx = box.left + box.width / 2;
        var cy = box.top + box.height * 0.4; // eyes sit above centre
        var angle = Math.atan2(my - cy, mx - cx);
        var dist = Math.hypot(my - cy, mx - cx);
        var pull = Math.min(dist / 260, 1);
        var dx = Math.round(Math.cos(angle) * pull);
        var dy = Math.round(Math.sin(angle) * pull);
        var t = "translate(" + dx + "," + dy + ")";
        pupilL.setAttribute("transform", t);
        pupilR.setAttribute("transform", t);
      });
    });
  }
});
