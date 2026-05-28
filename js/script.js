/* ==========================================================================
   BLACKPEAK — Interactions
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

  /* ---- Mock cart (persists across pages within session) ---- */
  const cartCountEl = document.getElementById("cartCount");
  let cartCount = Number(sessionStorage.getItem("bp_cart") || 0);
  if (cartCountEl) cartCountEl.textContent = cartCount;

  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      cartCount += 1;
      sessionStorage.setItem("bp_cart", String(cartCount));
      if (cartCountEl) cartCountEl.textContent = cartCount;

      // Brief visual ack
      const originalText = btn.textContent;
      btn.textContent = "Added ✓";
      btn.style.transform = "scale(0.96)";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.transform = "";
      }, 1000);
    });
  });

  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      if (cartCount === 0) {
        alert("Your cart is empty. Pick a pack from the shop and let's get fizzing.");
      } else {
        alert(`You have ${cartCount} item${cartCount === 1 ? "" : "s"} in your cart.\n\n(This is a visual demo — checkout isn't wired up yet.)`);
      }
    });
  }

  /* ---- Newsletter form ---- */
  document.querySelectorAll("#newsletterForm").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type=email]");
      const email = (input && input.value) || "";
      if (!email) return;
      const btn = form.querySelector("button");
      const originalText = btn.textContent;
      btn.textContent = "On the list ✓";
      btn.disabled = true;
      input.disabled = true;
      input.value = "";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        input.disabled = false;
        input.placeholder = "your@email.com";
      }, 2400);
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

  /* ---- Subtle parallax tilt on hero cans (desktop only) ---- */
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

  /* ---- Build-your-own 12-pack ---- */
  const bundleBuilder = document.getElementById("bundleBuilder");
  if (bundleBuilder) {
    const MAX = 12;
    const bar = document.getElementById("bundleBar");
    const countEl = document.getElementById("bundleCount");
    const addBtn = document.getElementById("bundleAdd");
    const steppers = Array.from(bundleBuilder.querySelectorAll(".stepper"));
    const counts = steppers.map(() => 0);

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
        cartCount += 1;
        sessionStorage.setItem("bp_cart", String(cartCount));
        if (cartCountEl) cartCountEl.textContent = cartCount;
        addBtn.textContent = "Box added ✓";
        addBtn.disabled = true;
        setTimeout(() => { counts.fill(0); render(); }, 1100);
      });
    }

    render();
  }
})();
