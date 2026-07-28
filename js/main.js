        // ==================== AUDIO CONTROL ====================
        function toggleAudio() {
            var bgMusic = document.getElementById('bgMusic');
            var audioBtn = document.getElementById('audioControl');
            if (bgMusic) {
                if (bgMusic.paused) {
                    bgMusic.play();
                    audioBtn.classList.remove('muted');
                } else {
                    bgMusic.pause();
                    audioBtn.classList.add('muted');
                }
            }
        }
        
        // ==================== ENTER SITE ====================
        function enterSite() {
            var introScreen = document.getElementById('introScreen');
            var introBtn = document.getElementById('introBtn');
            var navbar = document.getElementById('navbar');
            var heroContent = document.getElementById('heroContent');
            var heroVisual = document.getElementById('heroVisual');
            var whatsappFloat = document.getElementById('whatsappFloat');
            var bgMusic = document.getElementById('bgMusic');
            var audioBtn = document.getElementById('audioControl');
            
            // Disable button to prevent double click
            if (introBtn) introBtn.disabled = true;
            
            // Play audio
            if (bgMusic) {
                bgMusic.volume = 0.1; // 10% volume
                bgMusic.play().then(function() {
                    if (audioBtn) audioBtn.classList.remove('muted');
                }).catch(function() {
                    if (audioBtn) audioBtn.classList.add('muted');
                });
            }
            
            // Start hide animation
            introScreen.classList.add('hiding');
            
            // Remove intro-active after animation starts
            setTimeout(function() {
                document.body.classList.remove('intro-active');
            }, 300);
            
            // Hide intro and show navbar
            setTimeout(function() {
                introScreen.style.display = 'none';
                if (navbar) navbar.classList.add('visible');
            }, 600);
            
            // Show hero content
            setTimeout(function() {
                if (heroContent) heroContent.classList.add('animate');
                if (heroVisual) heroVisual.classList.add('animate');
            }, 800);
            
            // Show WhatsApp float
            setTimeout(function() {
                if (whatsappFloat) whatsappFloat.classList.add('visible');
            }, 1000);
        }
        
        // ==================== TIKTOK / IN-APP BROWSER FIX ====================
        // Linktree-style approach: force external browser for in-app browsers
        
        function isTikTokBrowser() {
            var ua = navigator.userAgent || navigator.vendor || '';
            return /TikTok|BytedanceWebview|ByteLocale|musical_ly/i.test(ua);
        }
        
        function isInAppBrowser() {
            var ua = navigator.userAgent || navigator.vendor || '';
            return /TikTok|BytedanceWebview|ByteLocale|musical_ly|FBAN|FBAV|Instagram|Line\//i.test(ua);
        }
        
        function openWhatsApp(url) {
            if (isInAppBrowser()) {
                forceExternalBrowser(url);
            } else {
                window.open(url, '_blank');
            }
        }
        
        // Force open in external browser (Linktree-style trick)
        function forceExternalBrowser(url) {
            var ua = navigator.userAgent || '';
            
            // Android: Try intent:// scheme to force Chrome/default browser
            if (/android/i.test(ua)) {
                // Method 1: intent:// scheme (most reliable on Android)
                var intentUrl = 'intent://' + url.replace(/^https?:\/\//, '') + 
                    '#Intent;scheme=https;package=com.android.chrome;end';
                window.location.href = intentUrl;
                
                // Fallback: if intent doesn't work after 2s, try direct
                setTimeout(function() {
                    window.location.href = url;
                }, 2000);
                return;
            }
            
            // iOS: Try to break out of in-app browser
            if (/iphone|ipad|ipod/i.test(ua)) {
                // Method 1: Use x-safari scheme (works on some versions)
                // Method 2: Direct navigation (sometimes iOS in-app browsers allow wa.me)
                window.location.href = url;
                
                // Fallback: try with api.whatsapp.com (sometimes works better)
                setTimeout(function() {
                    var apiUrl = url.replace('wa.me/', 'api.whatsapp.com/send/?phone=').replace('?text=', '&text=');
                    window.location.href = apiUrl;
                }, 1500);
                return;
            }
            
            // Default fallback
            window.location.href = url;
        }
        
        // Intercept all wa.me link clicks in in-app browsers
        document.addEventListener('click', function(e) {
            var link = e.target.closest('a[href*="wa.me"]');
            if (link && isInAppBrowser()) {
                e.preventDefault();
                e.stopPropagation();
                forceExternalBrowser(link.href);
            }
        }, true);
        
        // Show "Open in Browser" banner for TikTok users
        document.addEventListener('DOMContentLoaded', function() {
            if (isTikTokBrowser()) {
                // Inject banner styles
                var style = document.createElement('style');
                style.textContent = '.tiktok-banner{position:fixed;bottom:0;left:0;right:0;z-index:99999;background:linear-gradient(135deg,#075E54,#25D366);color:#fff;padding:14px 16px;font-family:inherit;box-shadow:0 -4px 20px rgba(0,0,0,0.2);animation:tiktokSlideUp .4s ease}.tiktok-banner-content{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;text-align:center;font-size:13px;line-height:1.5}.tiktok-banner b{font-weight:700}.tiktok-banner-close{background:rgba(255,255,255,0.2);border:none;color:#fff;padding:4px 14px;border-radius:20px;font-size:12px;cursor:pointer;white-space:nowrap}@keyframes tiktokSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}';
                document.head.appendChild(style);
                
                var banner = document.createElement('div');
                banner.className = 'tiktok-banner';
                banner.innerHTML = '<div class="tiktok-banner-content"><span>📱 Tekan <b>⋮</b> di atas kanan → <b>"Open in Browser"</b> untuk WhatsApp berfungsi</span><button class="tiktok-banner-close" onclick="this.closest(\'.tiktok-banner\').remove()">OK ✕</button></div>';
                document.body.appendChild(banner);
            }
        });
        
        // ==================== PAGE INIT ====================
        document.addEventListener('DOMContentLoaded', function() {
            var bgMusic = document.getElementById('bgMusic');
            var audioBtn = document.getElementById('audioControl');
            
            // Set initial audio state
            if (bgMusic) {
                bgMusic.volume = 0.1;
            }
            if (audioBtn) {
                audioBtn.classList.add('muted');
            }
        });
        
        // ==================== AUTO PAUSE WHEN TAB HIDDEN ====================
        var wasPlayingBeforeHidden = false;
        
        document.addEventListener('visibilitychange', function() {
            var bgMusic = document.getElementById('bgMusic');
            var audioBtn = document.getElementById('audioControl');
            
            if (!bgMusic) return;
            
            if (document.hidden) {
                // Tab hidden - pause if playing
                if (!bgMusic.paused) {
                    wasPlayingBeforeHidden = true;
                    bgMusic.pause();
                    if (audioBtn) audioBtn.classList.add('muted');
                } else {
                    wasPlayingBeforeHidden = false;
                }
            } else {
                // Tab visible - resume if was playing before
                if (wasPlayingBeforeHidden) {
                    bgMusic.play().then(function() {
                        if (audioBtn) audioBtn.classList.remove('muted');
                    }).catch(function() {
                        if (audioBtn) audioBtn.classList.add('muted');
                    });
                }
            }
        });
        
        // Also handle window blur/focus for mobile apps
        window.addEventListener('blur', function() {
            var bgMusic = document.getElementById('bgMusic');
            var audioBtn = document.getElementById('audioControl');
            
            if (bgMusic && !bgMusic.paused) {
                wasPlayingBeforeHidden = true;
                bgMusic.pause();
                if (audioBtn) audioBtn.classList.add('muted');
            }
        });
        
        window.addEventListener('focus', function() {
            var bgMusic = document.getElementById('bgMusic');
            var audioBtn = document.getElementById('audioControl');
            
            if (bgMusic && wasPlayingBeforeHidden) {
                bgMusic.play().then(function() {
                    if (audioBtn) audioBtn.classList.remove('muted');
                }).catch(function() {
                    if (audioBtn) audioBtn.classList.add('muted');
                });
            }
        });
        
        // ==================== SCROLL PROGRESS ====================
        window.addEventListener('scroll', function() {
            var scrollProgress = document.getElementById('scrollProgress');
            var scrollTop = document.documentElement.scrollTop;
            var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var progress = (scrollTop / scrollHeight) * 100;
            if (scrollProgress) scrollProgress.style.width = progress + '%';
        });
        
        // ==================== MOBILE: CARD IN-VIEW DETECTION ====================
        function checkCardsInView() {
            // Only run on mobile
            if (window.innerWidth > 768) return;
            
            var cards = document.querySelectorAll('.highlight-card, .problem-card, .stat-item, .state-card, .why-card');
            var windowHeight = window.innerHeight;
            var centerZone = windowHeight * 0.4; // 40% zone di tengah
            var centerTop = (windowHeight - centerZone) / 2;
            var centerBottom = centerTop + centerZone;
            
            cards.forEach(function(card) {
                var rect = card.getBoundingClientRect();
                var cardCenter = rect.top + (rect.height / 2);
                
                // Check if card center is within the center zone of viewport
                if (cardCenter >= centerTop && cardCenter <= centerBottom) {
                    card.classList.add('in-view');
                } else {
                    card.classList.remove('in-view');
                }
            });
        }
        
        // Run on scroll and resize
        window.addEventListener('scroll', checkCardsInView, { passive: true });
        window.addEventListener('resize', checkCardsInView);
        
        // Initial check
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(checkCardsInView, 100);
        });
        
        // ==================== NAVBAR SCROLL ====================
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // ==================== MOBILE MENU ====================
        document.getElementById('menuToggle').addEventListener('click', function() {
            this.classList.toggle('active');
            document.getElementById('navLinks').classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('menuToggle').classList.remove('active');
                document.getElementById('navLinks').classList.remove('active');
            });
        });
        
        // ==================== SCROLL REVEAL ====================
        function reveal() {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(el => {
                const windowHeight = window.innerHeight;
                const elementTop = el.getBoundingClientRect().top;
                const revealPoint = 150;
                if (elementTop < windowHeight - revealPoint) {
                    el.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', reveal);
        
        // ==================== PROBLEM SECTION MOBILE DROPDOWN ====================
        document.addEventListener('DOMContentLoaded', function() {
            const problemToggle = document.getElementById('problemToggle');
            const problemContent = document.getElementById('problemContent');
            
            if (problemToggle && problemContent) {
                problemToggle.addEventListener('click', function() {
                    // Only work on mobile
                    if (window.innerWidth <= 768) {
                        problemToggle.classList.toggle('active');
                        problemContent.classList.toggle('open');
                    }
                });
            }
        });
        
        // ==================== STICKER DEMO SCROLL ANIMATION ====================
        function stickerDemoScroll() {
            const stickerDemo = document.getElementById('stickerDemo');
            if (!stickerDemo) return;
            
            const windowHeight = window.innerHeight;
            const rect = stickerDemo.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const sectionCenter = sectionTop + (sectionHeight / 2);
            
            // Calculate center zone of viewport (middle 60%)
            const centerZoneTop = windowHeight * 0.2;
            const centerZoneBottom = windowHeight * 0.8;
            
            // Activate only when section center is within center zone of viewport
            if (sectionCenter >= centerZoneTop && sectionCenter <= centerZoneBottom) {
                stickerDemo.classList.add('active');
            } else {
                stickerDemo.classList.remove('active');
            }
        }
        
        window.addEventListener('scroll', stickerDemoScroll, { passive: true });
        
        // Initial check - don't auto activate
        document.addEventListener('DOMContentLoaded', function() {
            // Don't auto-activate on load, wait for user scroll
        });
        
        // ==================== THERMAL COMPARE SCROLL ANIMATION ====================
        function thermalCompareScroll() {
            const thermalCompare = document.getElementById('thermalCompare');
            const thermalFilter = document.getElementById('thermalFilter');
            if (!thermalCompare || !thermalFilter) return;
            
            const windowHeight = window.innerHeight;
            const rect = thermalCompare.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            
            // Start when image center reaches viewport center
            // End when image is near top of viewport
            const startPoint = windowHeight * 0.5; // Mula bila tengah gambar di tengah screen
            const endPoint = windowHeight * 0.1; // Habis bila gambar hampir atas
            
            if (sectionTop < startPoint && sectionTop > endPoint - sectionHeight) {
                // Calculate percentage (0 to 100)
                const totalDistance = startPoint - endPoint;
                const currentProgress = startPoint - sectionTop;
                let percentage = (currentProgress / totalDistance) * 100;
                
                // Clamp between 0 and 100
                percentage = Math.max(0, Math.min(100, percentage));
                
                // Apply height directly based on scroll
                thermalFilter.style.height = percentage + '%';
            } else if (sectionTop >= startPoint) {
                // Above section - hide filter
                thermalFilter.style.height = '0%';
            } else {
                // Below section - show full filter
                thermalFilter.style.height = '100%';
            }
        }
        
        window.addEventListener('scroll', thermalCompareScroll, { passive: true });
        
        // Initial check
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(thermalCompareScroll, 100);
        });
        
        // ==================== REVIEWS CAROUSEL ====================
        (function() {
            let currentSlide = 0;
            const totalSlides = 9;
            let autoSlideInterval;
            let startX = 0;
            let isDragging = false;
            
            function initReviewsCarousel() {
                const track = document.getElementById('reviewsTrack');
                const dotsContainer = document.getElementById('reviewDots');
                const prevBtn = document.getElementById('reviewPrev');
                const nextBtn = document.getElementById('reviewNext');
                
                if (!track || !dotsContainer) return;
                
                // Create dots
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'review-dot' + (i === 0 ? ' active' : '');
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }
                
                // Navigation buttons
                if (prevBtn) prevBtn.addEventListener('click', prevSlide);
                if (nextBtn) nextBtn.addEventListener('click', nextSlide);
                
                // Touch/Swipe support
                track.addEventListener('touchstart', handleTouchStart, { passive: true });
                track.addEventListener('touchmove', handleTouchMove, { passive: true });
                track.addEventListener('touchend', handleTouchEnd);
                
                // Mouse drag support
                track.addEventListener('mousedown', handleMouseDown);
                track.addEventListener('mousemove', handleMouseMove);
                track.addEventListener('mouseup', handleMouseUp);
                track.addEventListener('mouseleave', handleMouseUp);
                
                // Start auto slide
                startAutoSlide();
                
                // Pause on hover
                track.addEventListener('mouseenter', stopAutoSlide);
                track.addEventListener('mouseleave', startAutoSlide);
            }
            
            function goToSlide(index) {
                const track = document.getElementById('reviewsTrack');
                const dots = document.querySelectorAll('.review-dot');
                
                currentSlide = index;
                if (currentSlide >= totalSlides) currentSlide = 0;
                if (currentSlide < 0) currentSlide = totalSlides - 1;
                
                track.style.transform = `translateX(-${currentSlide * 100}%)`;
                
                // Update dots
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentSlide);
                });
            }
            
            function nextSlide() {
                goToSlide(currentSlide + 1);
            }
            
            function prevSlide() {
                goToSlide(currentSlide - 1);
            }
            
            function startAutoSlide() {
                stopAutoSlide();
                autoSlideInterval = setInterval(nextSlide, 4000);
            }
            
            function stopAutoSlide() {
                if (autoSlideInterval) {
                    clearInterval(autoSlideInterval);
                }
            }
            
            // Touch handlers
            function handleTouchStart(e) {
                startX = e.touches[0].clientX;
                stopAutoSlide();
            }
            
            function handleTouchMove(e) {
                // Optional: add visual feedback
            }
            
            function handleTouchEnd(e) {
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
                startAutoSlide();
            }
            
            // Mouse handlers
            function handleMouseDown(e) {
                isDragging = true;
                startX = e.clientX;
                stopAutoSlide();
            }
            
            function handleMouseMove(e) {
                if (!isDragging) return;
            }
            
            function handleMouseUp(e) {
                if (!isDragging) return;
                isDragging = false;
                
                const diff = startX - e.clientX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
                startAutoSlide();
            }
            
            // Initialize on DOM ready
            document.addEventListener('DOMContentLoaded', initReviewsCarousel);
        })();
        
        // ==================== POSTER MODAL & CAROUSEL ====================
        (function() {
            let currentPoster = 0;
            const totalPosters = 13;
            
            function initPosterModal() {
                const ctaBtn = document.getElementById('posterCtaBtn');
                const modal = document.getElementById('posterModal');
                const overlay = document.getElementById('posterModalOverlay');
                const closeBtn = document.getElementById('posterModalClose');
                const track = document.getElementById('posterTrack');
                const dotsContainer = document.getElementById('posterDots');
                const prevBtn = document.getElementById('posterPrev');
                const nextBtn = document.getElementById('posterNext');
                
                if (!ctaBtn || !modal) return;
                
                // Create dots
                for (let i = 0; i < totalPosters; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'poster-dot' + (i === 0 ? ' active' : '');
                    dot.addEventListener('click', () => goToPoster(i));
                    dotsContainer.appendChild(dot);
                }
                
                // Open modal
                ctaBtn.addEventListener('click', function() {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
                
                // Close modal
                function closeModal() {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                overlay.addEventListener('click', closeModal);
                closeBtn.addEventListener('click', closeModal);
                
                // Close on Escape key
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && modal.classList.contains('active')) {
                        closeModal();
                    }
                });
                
                // Navigation
                prevBtn.addEventListener('click', () => goToPoster(currentPoster - 1));
                nextBtn.addEventListener('click', () => goToPoster(currentPoster + 1));
                
                // Swipe support
                let startX = 0;
                track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
                track.addEventListener('touchend', (e) => {
                    const diff = startX - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 50) {
                        if (diff > 0) goToPoster(currentPoster + 1);
                        else goToPoster(currentPoster - 1);
                    }
                });
            }
            
            function goToPoster(index) {
                const track = document.getElementById('posterTrack');
                const dots = document.querySelectorAll('.poster-dot');
                
                currentPoster = index;
                if (currentPoster >= totalPosters) currentPoster = 0;
                if (currentPoster < 0) currentPoster = totalPosters - 1;
                
                track.style.transform = `translateX(-${currentPoster * 100}%)`;
                
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentPoster);
                });
            }
            
            document.addEventListener('DOMContentLoaded', initPosterModal);
        })();
        
        // ==================== TOOLS PARALLAX SCROLL ====================
        function toolsParallaxScroll() {
            const toolsSection = document.getElementById('toolsParallax');
            if (!toolsSection) return;
            
            const windowHeight = window.innerHeight;
            const rect = toolsSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const sectionCenter = sectionTop + (sectionHeight / 2);
            
            // Calculate center zone of viewport (middle 60%)
            const centerZoneTop = windowHeight * 0.2;
            const centerZoneBottom = windowHeight * 0.8;
            
            // Activate only when section center is within center zone of viewport
            if (sectionCenter >= centerZoneTop && sectionCenter <= centerZoneBottom) {
                toolsSection.classList.add('active');
            } else {
                toolsSection.classList.remove('active');
            }
        }
        
        window.addEventListener('scroll', toolsParallaxScroll, { passive: true });
        
        // Initial check on load - don't auto activate
        document.addEventListener('DOMContentLoaded', function() {
            // Don't auto-activate on load, wait for user scroll
        });
        
        // ==================== COUNTER ANIMATION ====================
        function animateCounter(el) {
            const target = parseInt(el.getAttribute('data-count'));
            if (!target) return;
            
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const update = () => {
                current += step;
                if (current < target) {
                    el.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target + '+';
                }
            };
            
            update();
        }
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
        
        // ==================== SCROLL TO TOP ====================
        const scrollTopBtn = document.getElementById('scrollTop');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // ==================== WHATSAPP FORM ====================
        function sendToWhatsApp() {
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const location = document.getElementById('location').value.trim();
            const sqft = document.getElementById('sqft').value.trim();
            const storey = document.getElementById('storey').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Tidak wajib isi semua - boleh hantar terus
            let waMessage = `PERTANYAAN SERVIS GOXPERT\n\n`;
            if (name) waMessage += `Nama: ${name}\n`;
            if (phone) waMessage += `No. Telefon: ${phone}\n`;
            if (service) waMessage += `Servis: ${service}\n`;
            if (location) waMessage += `Lokasi: ${location}\n`;
            if (sqft) waMessage += `Keluasan: ${sqft} sqft\n`;
            if (storey) waMessage += `Storey: ${storey}\n`;
            if (message) waMessage += `Maklumat Tambahan:\n${message}\n`;
            
            const encodedMessage = encodeURIComponent(waMessage);
            openWhatsApp(`https://wa.me/601131446591?text=${encodedMessage}`);
        }
        
        // ==================== SMOOTH SCROLL ====================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navbar = document.getElementById('navbar');
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('navMenu');
                    if (navMenu) navMenu.classList.remove('active');
                }
            });
        });
