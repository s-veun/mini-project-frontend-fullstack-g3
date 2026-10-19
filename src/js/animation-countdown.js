 const swiper = new Swiper('.heroSwiper', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            effect: 'slide',
            speed: 800,
        });

        // Countdown Timer
        function updateCountdown() {
            const days = document.getElementById('days');
            const hours = document.getElementById('hours');
            const minutes = document.getElementById('minutes');
            const seconds = document.getElementById('seconds');

            setInterval(() => {
                let d = parseInt(days.textContent);
                let h = parseInt(hours.textContent);
                let m = parseInt(minutes.textContent);
                let s = parseInt(seconds.textContent);

                s--;
                if (s < 0) {
                    s = 59;
                    m--;
                }
                if (m < 0) {
                    m = 59;
                    h--;
                }
                if (h < 0) {
                    h = 23;
                    d--;
                }
                if (d < 0) {
                    d = 0;
                    h = 0;
                    m = 0;
                    s = 0;
                }

                days.textContent = d;
                hours.textContent = h;
                minutes.textContent = m;
                seconds.textContent = s;
            }, 1000);
        }

        updateCountdown();

        // Add to cart animation
        document.querySelectorAll('.hover-lift').forEach(card => {
            card.addEventListener('click', function() {
                const cartIcon = document.querySelector('[href="#"]').closest('button').querySelector('span.absolute');
                if (cartIcon) {
                    const currentCount = parseInt(cartIcon.textContent);
                    cartIcon.textContent = currentCount + 1;
                    
                    // Add shake animation
                    cartIcon.style.animation = 'none';
                    setTimeout(() => {
                        cartIcon.style.animation = 'bounce 0.5s';
                    }, 10);
                }
            });
        });

        