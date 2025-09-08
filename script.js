/* ======================================================================
 * Interactive Portfolio — JavaScript Assignment
 * ----------------------------------------------------------------------
 * This file demonstrates:
 * - Part 1: Event handling (click, mouseover, keyboard, input)
 * - Part 2: Interactive elements (theme toggle, counter game, dropdown,
 *           tabs, accordion, slider, modal)
 * - Part 3: Custom form validation with friendly feedback
 * The code is organized into small, well-named functions and sections.
 * ====================================================================*/

// ------------------------------ Utilities ------------------------------
/**
 * Shorthand for querySelector
 * @param {string} sel
 * @param {Element|Document} [root=document]
 * @returns {Element|null}
 */
const $ = (sel, root = document) => root.querySelector(sel);
/**
 * Shorthand for querySelectorAll returning array
 * @param {string} sel
 * @param {Element|Document} [root=document]
 * @returns {Element[]}
 */
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/**
 * Helper: trap focus inside a dialog (for accessibility)
 * Very minimal implementation for this assignment.
 */
function trapFocusInDialog(dialog) {
  const focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) {
    focusable[0].focus();
  }
}

// ------------------------------ Part 1: Event Handling ------------------------------
/**
 * Theme toggle: click button or press Alt+T
 * Demonstrates: click + keydown events and toggling classes
 */
(function themeToggle() {
  const toggleBtn = $('#themeToggle');

  // Click to toggle
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    toggleBtn.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
  });

  // Keyboard: Alt+T
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      toggleBtn.click();
    }
  });
})();

/**
 * Counter Game: click buttons or use ArrowUp/ArrowDown
 * Demonstrates: click, keyboard, and DOM updates
 */
(function counterGame() {
  const out = $('#count');
  const msg = $('#counterMsg');
  let value = 0;

  function render() {
    out.textContent = value;
    if (value === 7) {
      msg.textContent = '🎯 Nice! You hit exactly 7.';
    } else if (value > 7) {
      msg.textContent = 'Oops, you went over. Try resetting.';
    } else {
      msg.textContent = '';
    }
  }

  $('#increment').addEventListener('click', () => { value++; render(); });
  $('#decrement').addEventListener('click', () => { value--; render(); });
  $('#reset').addEventListener('click', () => { value = 0; render(); });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { value++; render(); }
    if (e.key === 'ArrowDown') { value--; render(); }
  });

  render();
})();

/**
 * Dropdown Menu: toggle on button click, close on outside click
 * Demonstrates: click events, ARIA states, and event delegation
 */
(function dropdownMenu() {
  const btn = $('#dropdownBtn');
  const menu = $('#dropdownMenu');

  btn.addEventListener('click', (e) => {
    const show = !menu.classList.contains('show');
    menu.classList.toggle('show', show);
    btn.setAttribute('aria-expanded', String(show));
    menu.setAttribute('aria-hidden', String(!show));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== btn) {
      menu.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }
  });

  // Menu item click feedback
  menu.addEventListener('click', (e) => {
    const item = e.target.closest('.menu-item');
    if (item) {
      alert(`You selected: ${item.textContent.trim()}`);
      btn.click(); // close
    }
  });
})();

/**
 * Tabs: switch active tab and panel
 * Demonstrates: click events, class toggling, ARIA attributes
 */
(function tabs() {
  const tabButtons = $$('.tab');
  const panels = $$('.tabpanel');

  tabButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      // deactivate all
      tabButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('active'));

      // activate one
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      panels[idx].classList.add('active');
    });
  });
})();

/**
 * Accordion: expand/collapse panels
 * Demonstrates: click events and show/hide content
 */
(function accordion() {
  const headers = $$('.accordion-header');
  headers.forEach((hdr) => {
    hdr.addEventListener('click', () => {
      const panel = hdr.nextElementSibling;
      panel.classList.toggle('show');
    });
  });
})();

/**
 * Slider demo + mouseover handled inline in HTML for hoverbox; here we wire
 * the input event for the range slider.
 * Demonstrates: input event
 */
(function sliderDemo() {
  const slider = $('#volume');
  const out = $('#volOut');
  slider.addEventListener('input', () => {
    out.textContent = slider.value;
  });
})();

/**
 * Modal (two kinds):
 * - Native <dialog> API for the demo modal
 * - Shared "Project" modal opened from project cards
 * Demonstrates: click events, focus handling, and closing logic
 */
(function modals() {
  const demoDialog = $('#demoModal');
  $('#openDemoModal').addEventListener('click', () => {
    if (typeof demoDialog.showModal === 'function') {
      demoDialog.showModal();
      trapFocusInDialog(demoDialog);
    } else {
      // Fallback: toggle display if dialog not supported
      demoDialog.setAttribute('open', '');
      demoDialog.style.display = 'block';
    }
  });
  $('#closeDemoModal').addEventListener('click', () => demoDialog.close?.());

  // Close when clicking backdrop (for <dialog> this requires a trick)
  demoDialog.addEventListener('click', (e) => {
    const rect = demoDialog.getBoundingClientRect();
    const inDialog = (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    );
    if (!inDialog) demoDialog.close?.();
  });

  // Shared project modal
  const projectDialog = $('#modalProject');
  $$('.open-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      if (projectDialog.showModal) {
        projectDialog.showModal();
        trapFocusInDialog(projectDialog);
      } else {
        projectDialog.setAttribute('open', '');
        projectDialog.style.display = 'block';
      }
    });
  });
  $('.close-modal').addEventListener('click', () => {
    if (projectDialog.close) projectDialog.close();
    else projectDialog.style.display = 'none';
  });

  // Escape to close any open dialog
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [demoDialog, projectDialog].forEach(d => d.close?.());
    }
  });
})();

// Footer year
$('#year').textContent = new Date().getFullYear();

// ------------------------------ Part 3: Form Validation ------------------------------
/**
 * Custom form validation (no HTML5-only enforcement).
 * We use JS to:
 * - Prevent submission when invalid (event.preventDefault())
 * - Validate fields using conditions + RegExp
 * - Show inline errors and a success message
 */
(function formValidation() {
  const form = $('#contactForm');

  // Regex patterns
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const passwordRe = /^(?=.*\d).{8,}$/; // ≥8 chars, at least 1 number

  // Error helpers
  const errors = {
    name: $('#nameError'),
    email: $('#emailError'),
    password: $('#passwordError'),
    confirm: $('#confirmError'),
    tos: $('#tosError'),
  };
  const success = $('#formSuccess');

  function setError(field, message) {
    errors[field].textContent = message;
  }
  function clearErrors() {
    Object.values(errors).forEach(el => el.textContent = '');
    success.textContent = '';
  }

  // Validate on input (live feedback)
  $('#name').addEventListener('input', e => {
    const val = e.target.value.trim();
    setError('name', val.length >= 2 ? '' : 'Please enter your full name (min 2 chars).');
  });
  $('#email').addEventListener('input', e => {
    const val = e.target.value.trim();
    setError('email', emailRe.test(val) ? '' : 'Enter a valid email address.');
  });
  $('#password').addEventListener('input', e => {
    const val = e.target.value;
    setError('password', passwordRe.test(val) ? '' : 'Password must be ≥8 chars and include a number.');
  });
  $('#confirm').addEventListener('input', e => {
    const val = e.target.value;
    setError('confirm', val === $('#password').value ? '' : 'Passwords do not match.');
  });
  $('#tos').addEventListener('change', e => {
    setError('tos', e.target.checked ? '' : 'You must agree to the Terms.');
  });

  // Submit handler
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission until valid
    clearErrors();

    const nameVal = $('#name').value.trim();
    const emailVal = $('#email').value.trim();
    const passVal = $('#password').value;
    const confirmVal = $('#confirm').value;
    const tosChecked = $('#tos').checked;

    let valid = true;

    if (nameVal.length < 2) { setError('name', 'Please enter your full name (min 2 chars).'); valid = false; }
    if (!emailRe.test(emailVal)) { setError('email', 'Enter a valid email address.'); valid = false; }
    if (!passwordRe.test(passVal)) { setError('password', 'Password must be ≥8 chars and include a number.'); valid = false; }
    if (confirmVal !== passVal) { setError('confirm', 'Passwords do not match.'); valid = false; }
    if (!tosChecked) { setError('tos', 'You must agree to the Terms.'); valid = false; }

    if (valid) {
      success.textContent = '✅ Form is valid! Simulating submission...';
      // Simulate async submit
      setTimeout(() => {
        success.textContent = '🎉 Message sent successfully (simulation).';
        form.reset();
      }, 600);
    }
  });

  // Reset handler: clear messages
  form.addEventListener('reset', () => {
    setTimeout(clearErrors, 0);
  });
})();
