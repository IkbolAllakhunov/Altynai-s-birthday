// Глобальные переменные
let currentMemoryIndex = 0;
let confettiActive = false;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const cake = document.querySelector('.birthday-cake');
    if (cake) {
        cake.addEventListener('click', lightCandles);
    }
    setupAudio();
    initializeConfetti();
});

// Функция зажигания свечей
function lightCandles() {
    const cake = document.querySelector('.birthday-cake');
    const candles = document.querySelectorAll('.candle');
    
    cake.classList.add('lit');
    
    // Анимация зажигания свечей по очереди
    candles.forEach((candle, index) => {
        setTimeout(() => {
            candle.style.animation = 'flicker 0.5s infinite alternate';
            // Добавляем эффект огня
            candle.innerHTML = '🔥';
        }, index * 200);
    });
    
    // Воспроизводим звук
    playSound('candle');
    
    // Запускаем конфетти
    setTimeout(() => {
        createConfetti();
    }, 1000);
}

// Функция начала праздника
function startCelebration() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainCelebration = document.getElementById('mainCelebration');
    
    // Анимация исчезновения приветственного экрана
    welcomeScreen.style.animation = 'fadeOut 0.5s ease-out forwards';
    
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        mainCelebration.classList.remove('hidden');
        
        // Анимация появления основного контента
        mainCelebration.style.animation = 'fadeInUp 1s ease-out';
        
        // Запускаем конфетти
        createConfetti();
        
        // Воспроизводим звук поздравления
        playSound('celebration');
        
    // (убрана мини-игра)
        
    }, 500);
}

// Настройка аудио
function setupAudio() {
    // Создаем аудио элементы для разных звуков
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Функция создания звука
    window.playSound = function(type) {
        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'candle':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
                    break;
                case 'celebration':
                    oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
                    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2); // E5
                    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.4); // G5
                    break;
                case 'heart':
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    break;
            }
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch(e) {
            console.log('Audio not supported');
        }
    };
}

// Инициализация конфетти
function initializeConfetti() {
    const canvas = document.getElementById('confetti');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем размер канваса
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    window.createConfetti = function() {
        if (confettiActive) return;
        confettiActive = true;
        
        const confettiPieces = [];
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8'];
        
        // Создаем частицы конфетти
        for (let i = 0; i < 50; i++) {
            confettiPieces.push({
                x: Math.random() * canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }
        
        // Анимация конфетти
        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            confettiPieces.forEach((piece, index) => {
                // Обновляем позицию
                piece.x += piece.vx;
                piece.y += piece.vy;
                piece.rotation += piece.rotationSpeed;
                
                // Рисуем частицу
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.rotation * Math.PI / 180);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-piece.size/2, -piece.size/2, piece.size, piece.size);
                ctx.restore();
                
                // Удаляем частицы, которые упали
                if (piece.y > canvas.height + 20) {
                    confettiPieces.splice(index, 1);
                }
            });
            
            if (confettiPieces.length > 0) {
                requestAnimationFrame(animateConfetti);
            } else {
                confettiActive = false;
            }
        }
        
        animateConfetti();
    };
}

// (мини-игра и счет удалены)

// Управление слайдером воспоминаний
window.changeMemory = function(direction) {
    const memories = document.querySelectorAll('.memory-item');
    const totalMemories = memories.length;
    
    // Убираем активный класс
    memories[currentMemoryIndex].classList.remove('active');
    
    // Вычисляем новый индекс
    currentMemoryIndex += direction;
    
    // Проверяем границы
    if (currentMemoryIndex >= totalMemories) {
        currentMemoryIndex = 0;
    } else if (currentMemoryIndex < 0) {
        currentMemoryIndex = totalMemories - 1;
    }
    
    // Добавляем активный класс
    memories[currentMemoryIndex].classList.add('active');
    
    // Звук для переключения можно оставить мягким
    playSound('celebration');
};

// Перезапуск поздравления
window.restartCelebration = function() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainCelebration = document.getElementById('mainCelebration');
    
    // Скрываем основное поздравление
    mainCelebration.classList.add('hidden');
    
    // Показываем приветственный экран
    welcomeScreen.classList.remove('hidden');
    welcomeScreen.style.animation = 'fadeInUp 1s ease-out';
    
    // Сбрасываем состояние
    const cake = document.querySelector('.birthday-cake');
    if (cake) {
        cake.classList.remove('lit');
        const candles = document.querySelectorAll('.candle');
        candles.forEach(candle => {
            candle.style.animation = '';
            candle.innerHTML = '🕯️';
        });
    }
    
    // (мини-игра удалена)
    
    // Запускаем конфетти
    setTimeout(() => {
        createConfetti();
    }, 500);
};

// Добавляем CSS анимации через JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-30px);
        }
    }
    
    .game-heart {
        position: relative;
        transition: all 0.3s ease;
    }
    
    .memory-item {
        transition: all 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

// Добавляем вибрацию для мобильных устройств
function vibrate(pattern = [100]) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// (вибрация для клика по game-heart удалена)

// Автоматическое переключение слайдера воспоминаний
setInterval(() => {
    const memories = document.querySelectorAll('.memory-item');
    if (memories.length > 1) {
        changeMemory(1);
    }
}, 5000);

// Добавляем эффект параллакса для фоновых элементов
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hearts = document.querySelectorAll('.heart');
    const sparkles = document.querySelectorAll('.sparkle');
    
    hearts.forEach((heart, index) => {
        const speed = 0.5 + (index * 0.1);
        heart.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    sparkles.forEach((sparkle, index) => {
        const speed = 0.3 + (index * 0.05);
        sparkle.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Обработка касаний для мобильных устройств
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - следующее воспоминание
            changeMemory(1);
        } else {
            // Swipe down - предыдущее воспоминание
            changeMemory(-1);
        }
    }
}

// Добавляем эффект наклона для мобильных устройств
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(e) {
        const hearts = document.querySelectorAll('.heart');
        const tilt = e.gamma * 0.1; // Наклон по оси X
        
        hearts.forEach((heart, index) => {
            const multiplier = 0.5 + (index * 0.1);
            heart.style.transform += ` translateX(${tilt * multiplier}px)`;
        });
    });
}

console.log('🎉 Поздравление с днем рождения загружено! 🎂');

