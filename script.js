document.addEventListener('DOMContentLoaded', function() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const mainContent = document.getElementById('mainContent');
    const successContent = document.getElementById('successContent');
    const resetBtn = document.getElementById('resetBtn');
    const floatingHearts = document.getElementById('floatingHearts');

    // Hayır butonunun kaçması - hem mouse hem touch için
    function moveNoButton() {
        const container = document.querySelector('.container');
        const containerRect = container.getBoundingClientRect();
        const buttonRect = noBtn.getBoundingClientRect();
        
        // Butonun mevcut pozisyonu
        const currentX = buttonRect.left;
        const currentY = buttonRect.top;
        
        // Container sınırları
        const maxX = containerRect.width - buttonRect.width;
        const maxY = containerRect.height - buttonRect.height;
        
        // Rastgele yeni pozisyon
        let newX, newY;
        do {
            newX = Math.random() * maxX;
            newY = Math.random() * maxY;
        } while (
            Math.abs(newX - currentX) < 50 && 
            Math.abs(newY - currentY) < 50
        );
        
        // Butonu yeni pozisyona taşı
        noBtn.style.position = 'absolute';
        noBtn.style.left = newX + 'px';
        noBtn.style.top = newY + 'px';
        noBtn.style.transition = 'all 0.3s ease';
        
        // Buton metnini değiştir
        const messages = [
            'Hayır',
            'Emin misin?',
            'Gerçekten mi?',
            'Bir daha düşün',
            'Lütfen?',
            'Seni seviyorum',
            'Affet beni',
            'Özür dilerim'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        noBtn.textContent = randomMessage;
        
        // Buton rengini değiştir
        noBtn.style.background = 'linear-gradient(45deg, #ff9800, #ff5722)';
    }

    // Desktop için mouseenter
    noBtn.addEventListener('mouseenter', moveNoButton);
    
    // Mobil için touchstart ve click
    noBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        moveNoButton();
    });
    
    noBtn.addEventListener('click', function(e) {
        // Eğer buton zaten hareket ettiyse, tıklamayı engelle
        if (noBtn.style.position === 'absolute') {
            e.preventDefault();
            return;
        }
    });

    // Evet butonuna tıklandığında
    yesBtn.addEventListener('click', function() {
        // Ana içeriği gizle
        mainContent.style.display = 'none';
        
        // Başarı içeriğini göster
        successContent.style.display = 'block';
        
        // Konfeti efekti
        createConfetti();
        
        // Uçan kalpler
        createFloatingHearts();
        
        // Ses efekti (opsiyonel)
        playSuccessSound();
    });

    // Reset butonuna tıklandığında
    resetBtn.addEventListener('click', function() {
        // Başarı içeriğini gizle
        successContent.style.display = 'none';
        
        // Ana içeriği göster
        mainContent.style.display = 'block';
        
        // Hayır butonunu sıfırla
        noBtn.style.position = 'static';
        noBtn.style.left = '';
        noBtn.style.top = '';
        noBtn.textContent = 'Hayır';
        noBtn.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
        
        // Uçan kalpleri temizle
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
                
                // Konfeti elementini temizle
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
            
            // Kalp elementini temizle
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 5000);
        }, 300);
    }

    // Başarı sesi (opsiyonel)
    function playSuccessSound() {
        // Web Audio API kullanarak basit bir ses oluştur
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            // Ses oluşturulamazsa sessizce devam et
        }
    }

    // CSS animasyonu için konfeti düşüş efekti
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Sayfa yüklendiğinde uçan kalpler başlat
    setTimeout(() => {
        createFloatingHearts();
    }, 1000);
}); 
