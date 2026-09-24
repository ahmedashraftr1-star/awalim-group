// Serenity Spa - Interactive Soft UI Engine
(function() {
  'use strict';

  // State
  const state = {
    selectedRitual: 'rejuvenation',
    selectedOil: 'rose',
    duration: 60,
    basePrice: 120,
    addons: new Set(['aromatherapy'])
  };

  const ritualPrices = {
    'rejuvenation': { name: 'جلسة تجديد الحيوية الشاملة', base: 120, time: 60 },
    'stone': { name: 'علاج الأحجار البركانية الدافئة', base: 150, time: 75 },
    'facial': { name: 'العناية الماسية بإشراقة البشرة', base: 135, time: 60 },
    'sound': { name: 'جلسة الاسترخاء بالترددات الصوتية', base: 95, time: 45 }
  };

  const addonPrices = {
    'aromatherapy': { name: 'زيوت اللافندر والورد العضوية', price: 25 },
    'herbal-tea': { name: 'طقوس شاي الأعشاب النادر', price: 15 },
    'scalp-massage': { name: 'تدليك فروة الرأس بالزيوت الطبيعية', price: 35 },
    'reflexology': { name: 'ريفلكسولوجي انعكاسي للأقدام', price: 30 }
  };

  function updateBooking() {
    const ritual = ritualPrices[state.selectedRitual] || ritualPrices['rejuvenation'];
    let total = ritual.base;
    
    state.addons.forEach(addonKey => {
      if (addonPrices[addonKey]) {
        total += addonPrices[addonKey].price;
      }
    });

    // Update UI elements
    const totalDisplay = document.getElementById('spaTotalAmount');
    if (totalDisplay) {
      totalDisplay.textContent = '$' + total;
    }

    const durationDisplay = document.getElementById('spaSelectedDuration');
    if (durationDisplay) {
      durationDisplay.textContent = ritual.time + ' دقيقة';
    }

    const bookingBtn = document.getElementById('spaWhatsappBooking');
    if (bookingBtn) {
      const addonNames = Array.from(state.addons).map(k => addonPrices[k]?.name).filter(Boolean).join(' + ');
      const message = encodeURIComponent(
        "مرحباً Serenity Spa، أود حجز الباقة التالية:\n\n' +\n        '• الباقة الأساسية: ' + ritual.name + '\n' +\n        (addonNames ? '• الإضافات: ' + addonNames + '\n' : '') +\n        '• المدة: ' + ritual.time + ' دقيقة\n' +\n        '• الإجمالي المقدر: $' + total + '\n\n' +\n        'يرجى تأكيد أقرب موعد متاح لديكم. شكراً لكم."
      );
      bookingBtn.href = 'https://wa.me/970593636136?text=' + message;
    }
  }

  function initInteractive() {
    // Option pills
    const pills = document.querySelectorAll('.spa-option-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', function(e) {
        e.preventDefault();
        const type = this.getAttribute('data-type');
        const value = this.getAttribute('data-value');

        if (type === 'ritual') {
          document.querySelectorAll('.spa-option-pill[data-type="ritual"]').forEach(p => p.classList.remove('active'));
          this.classList.add('active');
          state.selectedRitual = value;
        } else if (type === 'addon') {
          if (state.addons.has(value)) {
            state.addons.delete(value);
            this.classList.remove('active');
          } else {
            state.addons.add(value);
            this.classList.add('active');
          }
        }
        updateBooking();
      });
    });

    // Quick book buttons on treatment cards
    const cardBtns = document.querySelectorAll('.spa-card-book-btn');
    cardBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const ritual = this.getAttribute('data-ritual');
        if (ritual) {
          const matchingPill = document.querySelector('.spa-option-pill[data-type="ritual"][data-value="' + ritual + '"]');
          if (matchingPill) {
            matchingPill.click();
            const customizer = document.getElementById('customizer');
            if (customizer) {
              customizer.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    });

    // Initial calculation
    updateBooking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractive);
  } else {
    initInteractive();
  }
})();
