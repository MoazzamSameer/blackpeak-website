/* ==========================================================================
   BLACKPEAK — Theme interactions (Shopify)
   Real cart via the AJAX Cart API (/cart/add.js, /cart.js).
   ========================================================================== */

(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  const burger = document.getElementById("burger");
  const mobile = document.getElementById("navMobile");
  if (burger && mobile) {
    burger.addEventListener("click", () => {
      const open = mobile.style.display === "block";
      mobile.style.display = open ? "none" : "block";
      burger.setAttribute("aria-expanded", String(!open));
      burger.textContent = open ? "☰" : "✕";
    });
  }

  const cartCountEl = document.getElementById("cartCount");

  /* ---- Sync cart badge from Shopify ---- */
  function refreshCartCount() {
    return fetch("/cart.js", { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((cart) => {
        if (cartCountEl) cartCountEl.textContent = cart.item_count;
        return cart;
      })
      .catch(() => {});
  }

  /* ---- Add to cart (AJAX) for collection/grid buttons ---- */
  function addItems(items) {
    return fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ items: items }),
    }).then((r) => {
      if (!r.ok) return r.json().then((e) => Promise.reject(e));
      return r.json();
    });
  }

  /* Intercept product forms that opt into AJAX (collection grid) */
  document.querySelectorAll("form[data-product-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const idInput = form.querySelector('[name="id"]');
      if (!idInput || !idInput.value) return; // let it submit normally
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const original = btn ? btn.textContent : "";
      addItems([{ id: Number(idInput.value), quantity: 1 }])
        .then(() => refreshCartCount())
        .then(() => {
          if (!btn) return;
          btn.textContent = "Added ✓";
          btn.style.transform = "scale(0.96)";
          setTimeout(() => {
            btn.textContent = original;
            btn.style.transform = "";
          }, 1000);
        })
        .catch(() => {
          if (btn) btn.textContent = "Sold out";
        });
    });
  });

  /* ---- Reveal on scroll ---- */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Parallax tilt on hero cans (desktop only) ---- */
  const stage = document.querySelector(".can-stage");
  if (stage && window.matchMedia("(hover: hover)").matches) {
    const cans = stage.querySelectorAll(".can-stage__can");
    stage.addEventListener("mousemove", (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cans.forEach((can, i) => {
        const depth = (i + 1) * 8;
        can.style.transform = `${can.dataset.baseTransform || ""} translate(${x * depth}px, ${y * depth}px)`;
      });
    });
    stage.addEventListener("mouseleave", () => {
      cans.forEach((can) => {
        can.style.transform = can.dataset.baseTransform || "";
      });
    });
  }

  /* ---- FAQ accordion: close siblings when one opens ---- */
  document.querySelectorAll(".faq__item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        document.querySelectorAll(".faq__item").forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---- Build-your-own 12-pack (Shopify line items) ---- */
  const bundleBuilder = document.getElementById("bundleBuilder");
  if (bundleBuilder) {
    const MAX = 12;
    const bar = document.getElementById("bundleBar");
    const countEl = document.getElementById("bundleCount");
    const addBtn = document.getElementById("bundleAdd");
    const steppers = Array.from(bundleBuilder.querySelectorAll(".stepper"));
    const counts = steppers.map(() => 0);
    const variantIds = steppers.map((s) => Number(s.dataset.variantId));

    const total = () => counts.reduce((a, b) => a + b, 0);

    function render() {
      const t = total();
      steppers.forEach((stepper, i) => {
        stepper.querySelector("[data-count]").textContent = counts[i];
        stepper.querySelector(".stepper__minus").disabled = counts[i] === 0;
        stepper.querySelector(".stepper__plus").disabled = t >= MAX;
      });
      if (bar) bar.style.width = (t / MAX) * 100 + "%";
      if (countEl) countEl.textContent = t;
      if (addBtn) {
        if (t === MAX) {
          addBtn.disabled = false;
          addBtn.textContent = "Add 12-pack to cart";
        } else {
          addBtn.disabled = true;
          addBtn.textContent = `Add ${MAX - t} more to fill the box`;
        }
      }
    }

    steppers.forEach((stepper, i) => {
      stepper.querySelector(".stepper__plus").addEventListener("click", () => {
        if (total() < MAX) { counts[i] += 1; render(); }
      });
      stepper.querySelector(".stepper__minus").addEventListener("click", () => {
        if (counts[i] > 0) { counts[i] -= 1; render(); }
      });
    });

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        if (total() !== MAX) return;
        const items = [];
        counts.forEach((qty, i) => {
          if (qty > 0 && variantIds[i]) items.push({ id: variantIds[i], quantity: qty });
        });
        if (!items.length) return;
        addBtn.disabled = true;
        addBtn.textContent = "Adding…";
        addItems(items)
          .then(() => refreshCartCount())
          .then(() => {
            addBtn.textContent = "Box added ✓";
            setTimeout(() => { counts.fill(0); render(); }, 1100);
          })
          .catch(() => {
            addBtn.textContent = "Something went wrong";
            setTimeout(render, 1600);
          });
      });
    }

    render();
  }

  /* ---- Initial cart badge sync ---- */
  refreshCartCount();
})();
