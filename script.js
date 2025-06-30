// DOM要素の取得
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');

// ナビゲーションのスクロール効果
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ハンバーガーメニューの制御
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// ナビゲーションリンククリック時の処理
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // モバイルメニューを閉じる
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // スムーススクロール（念のため）
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // ナビバーの高さを考慮
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // スキルプログレスバーのアニメーション
            if (entry.target.classList.contains('skills')) {
                animateSkillBars();
            }
            
            // プロジェクトカードの順次アニメーション
            if (entry.target.classList.contains('projects')) {
                animateProjectCards();
            }
        }
    });
}, observerOptions);

// セクションを監視対象に追加
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// スキルバーのアニメーション
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
            const progressFill = item.querySelector('.progress-fill');
            if (progressFill) {
                const progress = progressFill.style.getPropertyValue('--progress');
                progressFill.style.width = progress;
            }
        }, index * 200); // 0.2秒ずつ遅延
    });
}

// プロジェクトカードの順次アニメーション
function animateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 200);
    });
}

// タイピングエフェクト（ヒーローセクション用）
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ページ読み込み時のアニメーション
window.addEventListener('load', () => {
    // ヒーローセクションのタイトルにタイピングエフェクトを適用
    const heroTitle = document.querySelector('.hero h1');
    const originalText = heroTitle.textContent;
    
    setTimeout(() => {
        typeWriter(heroTitle, originalText, 100);
    }, 1000);
    
    // パララックス効果の初期化
    initParallax();
});

// パララックススクロール効果
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// スムーズなスクロール監視とアクティブナビゲーション
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// アクティブナビゲーションリンクのスタイル追加
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #6c5ce7 !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// コンタクトフォームの送信処理
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // フォームデータの取得
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // 送信中の表示
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '送信中...';
    submitButton.disabled = true;
    
    // 実際の送信処理をシミュレート
    setTimeout(() => {
        // 成功メッセージの表示
        showNotification('メッセージを送信しました！ありがとうございます。', 'success');
        
        // フォームのリセット
        contactForm.reset();
        
        // ボタンを元に戻す
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
});

// 通知メッセージの表示
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : '#6c5ce7'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // アニメーション
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自動削除
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// スクロールトップボタン
function createScrollTopButton() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #6c5ce7;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
    `;
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(scrollTopBtn);
    
    // スクロール位置に応じて表示/非表示
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'translateY(100px)';
        }
    });
}

// スクロールトップボタンの初期化
createScrollTopButton();

// カウンターアニメーション（数値をアニメーションで表示）
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

// マウスフォロワー効果
function initMouseFollower() {
    const follower = document.createElement('div');
    follower.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(108, 92, 231, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(follower);
    
    document.addEventListener('mousemove', (e) => {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });
    
    // ホバー効果
    document.querySelectorAll('a, button, .skill-item, .project-card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            follower.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.background = 'rgba(108, 92, 231, 0.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.background = 'rgba(108, 92, 231, 0.3)';
        });
    });
}

// デスクトップでのみマウスフォロワーを初期化
if (window.innerWidth > 768) {
    initMouseFollower();
}

// ウィンドウリサイズ時の処理
window.addEventListener('resize', () => {
    // モバイルメニューが開いている場合は閉じる
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// パフォーマンス最適化：スクロールイベントのスロットリング
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// スクロールイベントをスロットリング
const throttledScrollHandler = throttle(() => {
    // スクロール関連の処理をここに移動
}, 16); // 60fps相当

window.addEventListener('scroll', throttledScrollHandler);

console.log('Portfolio website loaded successfully! 🚀');