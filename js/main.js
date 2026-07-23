/* Anchor Plumbing Co. site scripts */
document.addEventListener("DOMContentLoaded", function () {

  /* Sticky nav shadow on scroll */
  var nav = document.getElementById("siteNav");
  if (nav) {
    var handleNavScroll = function () {
      if (window.scrollY > 12) {
        nav.classList.add("is-scrolled");
      } else {
        nav.classList.remove("is-scrolled");
      }
    };
    window.addEventListener("scroll", handleNavScroll, { passive: true });
    handleNavScroll();
  }

  /* Mobile menu toggle */
  var navToggle = document.getElementById("navToggle");
  var mobilePanel = document.getElementById("mobilePanel");
  if (navToggle && mobilePanel) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobilePanel.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobilePanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobilePanel.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll reveal animations */
  var revealItems = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* Animated stat counters */
  var statEls = document.querySelectorAll(".stat-num");
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimal") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var startTime = null;

    var step = function (timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    };
    requestAnimationFrame(step);
  };

  if (statEls.length && "IntersectionObserver" in window) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statEls.forEach(function (el) {
      statObserver.observe(el);
    });
  } else {
    statEls.forEach(animateCount);
  }

  /* Subtle hero parallax, disabled for reduced motion */
  var heroBg = document.getElementById("heroBg");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroBg && !prefersReducedMotion) {
    window.addEventListener(
      "scroll",
      function () {
        var offset = Math.min(window.scrollY * 0.12, 60);
        heroBg.style.transform = "scale(1.06) translateY(" + offset + "px)";
      },
      { passive: true }
    );
  }

  /* Custom quote checker */
  var qService = document.getElementById("qService");
  var qSize = document.getElementById("qSize");
  var quoteRange = document.getElementById("quoteRange");
  var quoteNote = document.getElementById("quoteNote");
  var quoteResult = document.getElementById("quoteResult");
  var copyQuoteBtn = document.getElementById("copyQuoteBtn");

  var baseRates = {
    leak: { low: 120, high: 220, label: "Leak detection and repair" },
    drain: { low: 150, high: 280, label: "Drain and sewer cleaning" },
    heater: { low: 280, high: 650, label: "Water heater install or repair" },
    pipe: { low: 300, high: 900, label: "Pipe installation or repiping" },
    fitting: { low: 450, high: 1200, label: "Bathroom or kitchen fitting" }
  };

  var sizeMultipliers = { small: 1, medium: 1.6, large: 2.4 };

  var currentQuote = { low: 0, high: 0, deposit: 0 };

  function getSelectedRadio(name) {
    var checked = document.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : null;
  }

  function updateQuote() {
    if (!qService || !qSize) return;

    var service = baseRates[qService.value];
    var sizeMultiplier = sizeMultipliers[qSize.value] || 1;
    var property = getSelectedRadio("qProperty");
    var urgency = getSelectedRadio("qUrgency");

    var low = service.low * sizeMultiplier;
    var high = service.high * sizeMultiplier;

    if (property === "commercial") {
      low *= 1.2;
      high *= 1.2;
    }

    var noteExtra = "";
    if (urgency === "emergency") {
      low = low * 1.25 + 60;
      high = high * 1.25 + 60;
      noteExtra = " Includes a same day dispatch fee.";
    }

    low = Math.round(low / 5) * 5;
    high = Math.round(high / 5) * 5;

    var deposit = Math.round(low * 0.3);

    currentQuote = {
      low: low,
      high: high,
      deposit: deposit,
      service: service.label,
      property: property,
      urgency: urgency
    };

    quoteRange.textContent = "$" + low.toLocaleString() + " to $" + high.toLocaleString();
    quoteNote.textContent =
      "One visit, suggested deposit around $" + deposit.toLocaleString() + "." + noteExtra;
    quoteResult.classList.add("is-active");
  }

  [qService, qSize].forEach(function (el) {
    if (el) el.addEventListener("change", updateQuote);
  });
  document.querySelectorAll('input[name="qProperty"], input[name="qUrgency"]').forEach(function (el) {
    el.addEventListener("change", updateQuote);
  });

  if (qService && qSize) {
    updateQuote();
  }

  if (copyQuoteBtn) {
    copyQuoteBtn.addEventListener("click", function () {
      var summary =
        "Anchor Plumbing Co. estimate\n" +
        "Service: " + currentQuote.service + "\n" +
        "Property: " + (currentQuote.property === "commercial" ? "Commercial" : "Residential") + "\n" +
        "Timing: " + (currentQuote.urgency === "emergency" ? "Same day emergency" : "Standard scheduling") + "\n" +
        "Estimated range: $" + currentQuote.low.toLocaleString() + " to $" + currentQuote.high.toLocaleString() + "\n" +
        "Suggested deposit: $" + currentQuote.deposit.toLocaleString();

      var originalText = copyQuoteBtn.textContent;
      var restore = function (label) {
        copyQuoteBtn.textContent = label;
        setTimeout(function () {
          copyQuoteBtn.textContent = originalText;
        }, 1800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(summary)
          .then(function () {
            restore("Copied to clipboard");
          })
          .catch(function () {
            restore("Copy not available");
          });
      } else {
        restore("Copy not available");
      }
    });
  }

  /* Portfolio filtering */
  var filterBar = document.getElementById("filterBar");
  var portfolioItems = document.querySelectorAll(".portfolio-item");
  if (filterBar && portfolioItems.length) {
    filterBar.addEventListener("click", function (event) {
      var button = event.target.closest(".filter-btn");
      if (!button) return;

      filterBar.querySelectorAll(".filter-btn").forEach(function (btn) {
        btn.classList.remove("is-active");
      });
      button.classList.add("is-active");

      var filter = button.getAttribute("data-filter");
      portfolioItems.forEach(function (item) {
        var matches = filter === "all" || item.getAttribute("data-category") === filter;
        item.classList.toggle("is-hidden", !matches);
      });
    });
  }

  /* Contact form, static demo submission */
  var contactForm = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");
  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      formStatus.textContent = "Request received. We will call you back within one business hour.";
      contactForm.reset();
    });
  }
});
