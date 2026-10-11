// Monts-Chalet — progressive enhancement. Every page works without this file.
(function () {
  'use strict';
  var i18n = JSON.parse(document.getElementById('i18n').textContent);
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Mobile menu ----------
  var menuBtn = document.getElementById('menu-btn');
  var mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    var setMenu = function (open) {
      mobileNav.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', function () {
      setMenu(mobileNav.hidden);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileNav.hidden) {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  // ---------- Scroll reveal (only below the fold, never with reduced motion) ----------
  if (!reducedMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reveal-in');
          entry.target.classList.remove('reveal-pending');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('reveal-pending');
        io.observe(el);
      }
    });
  }

  // ---------- Gallery: filters + lightbox ----------
  var grid = document.getElementById('gallery-grid');
  var lightbox = document.getElementById('lightbox');
  if (grid && lightbox) {
    var items = Array.prototype.slice.call(grid.querySelectorAll('.gallery-item'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var count = document.getElementById('gallery-count');
    var visible = function () {
      return items.filter(function (el) {
        return !el.hidden;
      });
    };

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var filter = chip.getAttribute('data-filter');
        chips.forEach(function (c) {
          c.setAttribute('aria-pressed', String(c === chip));
        });
        items.forEach(function (el) {
          el.hidden = filter !== 'all' && el.getAttribute('data-tags').split(' ').indexOf(filter) === -1;
        });
        count.textContent = i18n.gallery.count.replace('{n}', visible().length);
      });
    });

    var img = document.getElementById('lightbox-img');
    var caption = document.getElementById('lightbox-caption');
    var position = document.getElementById('lightbox-position');
    var current = 0;
    var opener = null;

    var show = function (index) {
      var list = visible();
      current = (index + list.length) % list.length;
      var el = list[current];
      var slug = el.getAttribute('data-slug');
      var alt = el.querySelector('img').alt;
      img.srcset = el
        .getAttribute('data-widths')
        .split(',')
        .map(function (w) {
          return '/images/' + slug + '-' + w + '.webp ' + w + 'w';
        })
        .join(', ');
      img.src = '/images/' + slug + '-960.jpg';
      img.width = el.getAttribute('data-w');
      img.height = el.getAttribute('data-h');
      img.alt = alt;
      caption.textContent = alt;
      position.textContent = i18n.gallery.position.replace('{i}', current + 1).replace('{n}', list.length);
    };

    grid.addEventListener('click', function (e) {
      var el = e.target.closest('.gallery-item');
      if (!el || typeof lightbox.showModal !== 'function') return; // no <dialog>: the link opens the photo
      e.preventDefault();
      opener = el;
      show(visible().indexOf(el));
      lightbox.showModal();
    });

    lightbox.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lb]');
      if (!btn) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-figure') || e.target.classList.contains('lightbox-inner')) lightbox.close();
        return;
      }
      var action = btn.getAttribute('data-lb');
      if (action === 'close') lightbox.close();
      else show(current + (action === 'next' ? 1 : -1));
    });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(current + 1);
      else if (e.key === 'ArrowLeft') show(current - 1);
    });
    lightbox.addEventListener('close', function () {
      if (opener) opener.focus();
    });

    // Swipe left / right on touch screens (the buttons remain as the non-gesture alternative).
    var startX = null;
    var startY = null;
    lightbox.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      startX = e.clientX;
      startY = e.clientY;
    });
    lightbox.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
    });
    lightbox.addEventListener('pointercancel', function () {
      startX = null;
    });
  }

  // ---------- Booking request form ----------
  var form = document.getElementById('booking-form');
  if (form) {
    var t = i18n.form;
    var summary = document.getElementById('form-errors');
    var status = document.getElementById('form-status');
    var submit = document.getElementById('booking-submit');
    var submitLabel = submit.textContent;
    var field = function (name) {
      return form.elements[name];
    };
    var today = new Date();
    var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    field('arrival').min = iso;
    field('departure').min = iso;
    field('arrival').addEventListener('change', function () {
      if (field('arrival').value) field('departure').min = field('arrival').value;
    });

    var rules = {
      arrival: function (v) {
        return v ? '' : t.arrival;
      },
      departure: function (v) {
        if (!v) return t.departure;
        return field('arrival').value && v <= field('arrival').value ? t.order : '';
      },
      guests: function (v) {
        return v ? '' : t.guests;
      },
      name: function (v) {
        return v.trim() ? '' : t.name;
      },
      email: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : t.email;
      },
    };

    var validate = function (name) {
      var input = field(name);
      var message = rules[name](input.value);
      var error = document.getElementById(name + '-error');
      error.textContent = message;
      error.hidden = !message;
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      return message;
    };

    Object.keys(rules).forEach(function (name) {
      field(name).addEventListener('blur', function () {
        if (field(name).value || field(name).hasAttribute('aria-invalid')) validate(name);
      });
    });

    var setStatus = function (message, state) {
      status.textContent = message;
      status.setAttribute('data-state', state);
      status.hidden = false;
      status.focus();
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.hidden = true;
      var errors = Object.keys(rules)
        .map(function (name) {
          return [name, validate(name)];
        })
        .filter(function (pair) {
          return pair[1];
        });

      if (errors.length) {
        summary.innerHTML = '';
        var heading = document.createElement('p');
        heading.className = 'font-bold';
        heading.textContent = t.summary;
        var list = document.createElement('ul');
        list.className = 'mt-3 space-y-2';
        errors.forEach(function (pair) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#' + pair[0];
          a.textContent = pair[1];
          li.appendChild(a);
          list.appendChild(li);
        });
        summary.appendChild(heading);
        summary.appendChild(list);
        summary.hidden = false;
        summary.focus();
        return;
      }
      summary.hidden = true;

      var data = new FormData(form);
      var endpoint = form.getAttribute('data-endpoint');

      if (!endpoint) {
        // No endpoint configured: open the visitor's email app with the request pre-filled.
        var b = t.body;
        var lines = [
          b.intro,
          '',
          b.arrival + ': ' + data.get('arrival'),
          b.departure + ': ' + data.get('departure'),
          b.guests + ': ' + data.get('guests'),
          b.name + ': ' + data.get('name'),
          b.email + ': ' + data.get('email'),
          b.phone + ': ' + (data.get('phone') || '-'),
          b.language + ': ' + data.get('preferred_language'),
          '',
          b.message + ':',
          data.get('message') || '-',
        ];
        var text = lines.join('\n');
        var su = encodeURIComponent(i18n.subject);
        var bd = encodeURIComponent(text);
        var to = encodeURIComponent(i18n.email);
        var mailtoUrl = 'mailto:' + i18n.email + '?subject=' + su + '&body=' + bd;

        // Visitors without a configured email app still need a way to send: webmail links and a copyable message.
        var fb = document.getElementById('form-fallback');
        var el = function (tag, cls, txt) {
          var n = document.createElement(tag);
          if (cls) n.className = cls;
          if (txt) n.textContent = txt;
          return n;
        };
        fb.innerHTML = '';
        fb.appendChild(el('h3', 'h3', t.fb.title));
        var actions = el('div', 'mt-5 flex flex-wrap gap-3');
        [
          [t.fb.app, mailtoUrl, false],
          [t.fb.gmail, 'https://mail.google.com/mail/?view=cm&fs=1&to=' + to + '&su=' + su + '&body=' + bd, true],
          [t.fb.outlook, 'https://outlook.live.com/mail/0/deeplink/compose?to=' + to + '&subject=' + su + '&body=' + bd, true],
        ].forEach(function (item) {
          var a = el('a', 'btn btn-secondary btn-sm', item[0]);
          a.href = item[1];
          if (item[2]) {
            a.target = '_blank';
            a.rel = 'noopener';
          }
          actions.appendChild(a);
        });
        fb.appendChild(actions);
        fb.appendChild(el('p', 'mt-6 text-stone', t.fb.manual.replace('{email}', i18n.email)));
        fb.appendChild(el('pre', 'form-fallback-text', text));
        var copy = el('button', 'btn btn-secondary btn-sm mt-4', t.fb.copy);
        copy.type = 'button';
        copy.addEventListener('click', function () {
          var done = function () {
            copy.textContent = t.fb.copied;
          };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done);
          else {
            var range = document.createRange();
            range.selectNodeContents(fb.querySelector('pre'));
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            if (document.execCommand('copy')) done();
          }
        });
        fb.appendChild(copy);
        fb.hidden = false;

        window.location.href = mailtoUrl;
        setStatus(t.mailtoNote, 'info');
        return;
      }

      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = t.sending;
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (response) {
          if (!response.ok) throw new Error(String(response.status));
          form.reset();
          setStatus(t.success, 'success');
        })
        .catch(function () {
          setStatus(t.failure.replace('{email}', i18n.email), 'error');
        })
        .then(function () {
          submit.disabled = false;
          submit.removeAttribute('aria-busy');
          submit.textContent = submitLabel;
        });
    });
  }
})();
