/* Zbiórka „Wrocławskie zwierzaki w potrzebie”.
   Aktualizuj tylko RAISED (kwota w zł) — paski postępu na index.html
   i zwierzaki.html odświeżą się same. */
(function () {
    "use strict";

    var RAISED = 50;
    var GOAL = 5000;
    var END = "2026-12-06T23:59:59+01:00";

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var end = new Date(END);
    var pct = Math.min(100, Math.round(RAISED / GOAL * 100));

    function zl(n) {
        return n.toLocaleString("pl-PL", { maximumFractionDigits: 0 }).replace(/\u00a0|\u202f/g, " ") + " zł";
    }

    function daysLeft() {
        var ms = end - new Date();
        var days = Math.ceil(ms / 86400000) - 1;
        var few = days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 12 || days % 100 > 14);
        if (ms <= 0) { return "Zbiórka zakończona — dziękujemy!"; }
        if (days === 0) { return "Dziś ostatni dzień zbiórki"; }
        if (days === 1) { return "Został 1 dzień — do 6 grudnia"; }
        return (few ? "Zostały " : "Zostało ") + days + " dni — do 6 grudnia";
    }

    function fill(root, name, text) {
        Array.prototype.forEach.call(root.querySelectorAll('[data-fr="' + name + '"]'), function (el) {
            el.textContent = text;
        });
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-fundraiser]"), function (fr) {
        fill(fr, "raised", zl(RAISED));
        fill(fr, "goal", zl(GOAL));
        fill(fr, "percent", pct + "%");
        fill(fr, "left", daysLeft());

        var bar = fr.querySelector(".fundraiser-bar");
        if (!bar) { return; }
        var span = bar.querySelector("span");
        bar.setAttribute("aria-valuemax", GOAL);
        bar.setAttribute("aria-valuenow", RAISED);
        bar.setAttribute("aria-valuetext", "Zebrano " + zl(RAISED) + " z " + zl(GOAL));

        function paint() { span.style.transform = "scaleX(" + pct / 100 + ")"; }
        if (reduce || !("IntersectionObserver" in window)) {
            paint();
        } else {
            var io = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) { paint(); io.disconnect(); }
            }, { threshold: 0.4 });
            io.observe(bar);
        }
    });
}());
