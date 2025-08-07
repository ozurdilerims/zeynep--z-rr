                    document.addEventListener('DOMContentLoaded', function() {
                        const yesBtn = document.getElementById('yesBtn');
                        const noBtn = document.getElementById('noBtn');
                        const mainContent = document.getElementById('mainContent');
                        const successContent = document.getElementById('successContent');
                        const resetBtn = document.getElementById('resetBtn');
                        const floatingHearts = document.getElementById('floatingHearts');
                        const buttonsContainer = document.querySelector('.buttons-container');
                        const MOVE_COOLDOWN_MS = 180;
                        let lastMoveAt = 0;

                        // Hayır butonunun kaçması - hem mouse hem touch/pointer için
                        function moveNoButton() {
                            const now = Date.now();
                            if (now - lastMoveAt < MOVE_COOLDOWN_MS) return;
                            lastMoveAt = now;
                            const containerRect = buttonsContainer.getBoundingClientRect();
                            const buttonRect = noBtn.getBoundingClientRect();

                            // Mevcut pozisyonu (container koordinatlarına göre)
                            const currentX = buttonRect.left - containerRect.left;
                            const currentY = buttonRect.top - containerRect.top;

                            // Sınırlar (container içinde)
                            const maxX = Math.max(0, containerRect.width - buttonRect.width);
                            const maxY = Math.max(0, containerRect.height - buttonRect.height);

                            // Rastgele yeni pozisyon (mevcut pozisyondan yeterince uzak)
                            let newX = currentX;
                            let newY = currentY;
                            let safety = 0;
                            while (safety < 50 && Math.abs(newX - currentX) < 40 && Math.abs(newY - currentY) < 40) {
                                newX = Math.random() * maxX;
                                newY = Math.random() * maxY;
                                safety++;
                            }

                            // Güvenli aralıkta tut
                            newX = Math.min(Math.max(0, newX), maxX);
                            newY = Math.min(Math.max(0, newY), maxY);

                            // Butonu yeni pozisyona taşı
                            noBtn.style.position = 'absolute';
                            noBtn.style.left = newX + 'px';
                            noBtn.style.top = newY + 'px';
                            noBtn.style.transition = 'left 0.18s ease, top 0.18s ease';

                            // Buton metnini ve rengi değiştir
                            const messages = [
                                'Hayır', 'Emin misin?', 'Gerçekten mi?', 'Bir daha düşün',
                                'Lütfen?', 'Seni seviyorum', 'Affet beni', 'Özür dilerim'
                            ];
                            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                            noBtn.textContent = randomMessage;
                            noBtn.style.background = 'linear-gradient(45deg, #ff9800, #ff5722)';
                        }

                        // Desktop için: hover'da kaç
                        noBtn.addEventListener('mouseenter', moveNoButton);

                        // Pointer (touch/mouse/pen) için: butona dokunur/tıklar tıklamaz kaç
                        noBtn.addEventListener('pointerdown', function(e) {
                            e.preventDefault();
                            moveNoButton();
                        });

                        // Touch'ta parmak yaklaşınca kaç (yakınlık algısı)
                        buttonsContainer.addEventListener('pointermove', function(e) {
                            if (e.pointerType === 'touch' || e.pointerType === 'pen') {
                                const containerRect = buttonsContainer.getBoundingClientRect();
                                const touchX = e.clientX - containerRect.left;
                                const touchY = e.clientY - containerRect.top;

                                const btnRect = noBtn.getBoundingClientRect();
                                const btnCenterX = (btnRect.left - containerRect.left) + btnRect.width / 2;
                                const btnCenterY = (btnRect.top - containerRect.top) + btnRect.height / 2;

                                const dx = touchX - btnCenterX;
                                const dy = touchY - btnCenterY;
                                const distance = Math.hypot(dx, dy);

                                if (distance < 90) {
                                    moveNoButton();
                                }
                            }
                        });

                        // Evet butonuna tıklandığında
                        yesBtn.addEventListener('click', function() {
                            mainContent.style.display = 'none';
                            successContent.style.display = 'block';
                            createConfetti();
                            createFloatingHearts();
                            playSuccessSound();
                        });

                        // Reset butonuna tıklandığında
                        resetBtn.addEventListener('click', function() {
                            successContent.style.display = 'none';
                            mainContent.style.display = 'block';

                            // Hayır butonunu sıfırla
                            noBtn.style.position = 'static';
                            noBtn.style.left = '';
                            noBtn.style.top = '';
                            noBtn.textContent = 'Hayır';
                            noBtn.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
                            floatingHearts.innerHTML = '';
                        });

                        // Konfeti efekti
                        function createConfetti() {
                            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
                            for (let i = 0; i < 100; i++) {
                                setTimeout(() => {
                                    const confetti = document.createElement('div');
                                    confetti.style.position = 'fixed';
                                    confetti.style.left = Math.random() * 100 + 'vw';
                                    confetti.style.top = '-10px';
                                    confetti.style.width = '10px';
                                    confetti.style.height = '10px';
                                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                                    confetti.style.borderRadius = '50%';
                                    confetti.style.pointerEvents = 'none';
                                    confetti.style.zIndex = '1000';
                                    confetti.style.animation = 'confettiFall 3s linear forwards';
                                    document.body.appendChild(confetti);
                                    setTimeout(() => {
                                        if (confetti.parentNode) {
                                            confetti.parentNode.removeChild(confetti);
                                        }
                                    }, 3000);
                                }, i * 20);
                            }
                        }

                        // Uçan kalpler
                        function createFloatingHearts() {
                            const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞'];
                            setInterval(() => {
                                const heart = document.createElement('div');
                                heart.className = 'floating-heart';
                                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                                heart.style.left = Math.random() * 100 + 'vw';
                                heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
                                floatingHearts.appendChild(heart);
                                setTimeout(() => {
                                    if (heart.parentNode) {
                                        heart.parentNode.removeChild(heart);
                                    }
                                }, 5000);
                            }, 300);
                        }

                        // Başarı sesi (opsiyonel)
                        function playSuccessSound() {
                            try {
                                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                                const oscillator = audioContext.createOscillator();
                                const gainNode = audioContext.createGain();
                                oscillator.connect(gainNode);
                                gainNode.connect(audioContext.destination);
                                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
                                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
                                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                                oscillator.start(audioContext.currentTime);
                                oscillator.stop(audioContext.currentTime + 0.3);
                            } catch (e) {}
                        }

                        // CSS animasyonu için konfeti düşüş efekti
                        const style = document.createElement('style');
                        style.textContent = `
                            @keyframes confettiFall {
                                0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
                                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                            }
                        `;
                        document.head.appendChild(style);

                        // Sayfa yüklendiğinde uçan kalpler başlat
                        setTimeout(() => { createFloatingHearts(); }, 1000);
                    }); 
