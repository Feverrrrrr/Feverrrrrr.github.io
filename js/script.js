/* ============================================
   Fever 个人作品集 - JavaScript交互系统
   功能：主题切换、导航、游戏卡片、模态框、动画等
   ============================================ */

// 1. 游戏数据 - 你的网页游戏作品
const gamesData = [
  {
    id: 1,
    title: "坦克对战游戏",
    description: "经典坦克对战游戏，控制你的坦克击败敌人，体验策略与操作的完美结合。",
    imageUrl: "assets/tank-game.png",
    link: "https://feverrrrrr.github.io/tank.html",
    category: "动作策略",
    badge: "热门",
    features: ["双人对战", "策略操作", "经典玩法", "HTML5 Canvas"]
  },
  {
    id: 2,
    title: "扮演老师阻止请假小游戏",
    description: "扮演严格的老师，阻止学生请假的有趣小游戏，考验你的反应和判断力。",
    imageUrl: "assets/teacher-game.png",
    link: "https://feverrrrrr.github.io/请个假.html",
    category: "休闲益智",
    badge: "新作",
    features: ["角色扮演", "反应测试", "趣味剧情", "简单上手"]
  },
  {
    id: 3,
    title: "手控万剑归宗小游戏",
    description: "控制万剑归宗的震撼场景，体验武侠世界的剑气纵横，展示你的操控技巧。",
    imageUrl: "assets/54da52340f029c77fc153b09d250fe17_720.jpg",
    link: "https://feverrrrrr.github.io/剑来.html",
    category: "动作武侠",
    badge: "精选",
    features: ["特效震撼", "武侠主题", "手控操作", "视觉盛宴"]
  },
  {
    id: 4,
    title: "战机小游戏",
    description: "驾驶战机在雷暴中穿梭，躲避障碍，击败敌人，体验刺激的空战冒险。",
    imageUrl: "assets/aircraft-game.png",
    link: "https://feverrrrrr.github.io/雷暴战机.html",
    category: "飞行射击",
    badge: "经典",
    features: ["飞行射击", "障碍躲避", "升级系统", "紧张刺激"]
  }
];

// 2. DOM元素缓存
const domCache = {
  // 主题切换
  themeToggle: document.getElementById('themeToggle'),
  themeIcon: document.querySelector('#themeToggle i'),
  
  // 导航
  navToggle: document.getElementById('navToggle'),
  navMenu: document.querySelector('.nav-menu'),
  navLinks: document.querySelectorAll('.nav-link'),
  
  // 游戏区域
  gamesGrid: document.getElementById('gamesGrid'),
  
  // 模态框
  gameModal: document.getElementById('gameModal'),
  modalClose: document.getElementById('modalClose'),
  modalBody: document.getElementById('modalBody'),
  
  // 返回顶部
  backToTop: document.getElementById('backToTop'),
  
  // 分享按钮
  shareButtons: document.querySelectorAll('.share-btn'),
  
  // 导航栏
  navbar: document.querySelector('.navbar')
};

// 3. 状态管理
const appState = {
  currentTheme: localStorage.getItem('theme') || 'light',
  currentGame: null,
  isNavOpen: false,
  scrollPosition: 0
};

// 4. 初始化函数
function init() {
  console.log('🎮 Fever 作品集网站初始化...');
  
  // 设置初始主题
  setTheme(appState.currentTheme);
  
  // 加载游戏卡片
  renderGames();
  
  // 绑定事件监听器
  bindEvents();
  
  // 初始化滚动监听
  initScrollEffects();
  
  // 检查系统主题偏好
  checkSystemTheme();
  
  console.log('✅ 网站初始化完成！');
}

// 5. 主题管理
function setTheme(theme) {
  appState.currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // 更新图标
  if (domCache.themeIcon) {
    domCache.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

function toggleTheme() {
  const newTheme = appState.currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  
  // 添加过渡效果
  document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  setTimeout(() => {
    document.documentElement.style.transition = '';
  }, 300);
}

function checkSystemTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  if (!localStorage.getItem('theme')) {
    setTheme(prefersDark.matches ? 'dark' : 'light');
  }
  
  // 监听系统主题变化
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// 6. 导航管理
function toggleNavMenu() {
  appState.isNavOpen = !appState.isNavOpen;
  
  if (domCache.navMenu) {
    if (appState.isNavOpen) {
      domCache.navMenu.style.display = 'flex';
      setTimeout(() => {
        domCache.navMenu.style.opacity = '1';
        domCache.navMenu.style.transform = 'translateY(0)';
      }, 10);
    } else {
      domCache.navMenu.style.opacity = '0';
      domCache.navMenu.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        domCache.navMenu.style.display = 'none';
      }, 300);
    }
  }
  
  // 更新汉堡图标
  if (domCache.navToggle) {
    const icon = domCache.navToggle.querySelector('i');
    if (icon) {
      icon.className = appState.isNavOpen ? 'fas fa-times' : 'fas fa-bars';
    }
  }
}

function setActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const scrollPosition = window.scrollY + 100;
  
  domCache.navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    }
  });
}

// 7. 游戏卡片渲染
function renderGames() {
  if (!domCache.gamesGrid) return;
  
  domCache.gamesGrid.innerHTML = gamesData.map(game => `
    <div class="game-card" data-game-id="${game.id}">
      <div class="game-card-header">
        <img src="${game.imageUrl}" alt="${game.title}" class="game-card-image" loading="lazy">
        <span class="game-card-badge">${game.badge}</span>
      </div>
      <div class="game-card-body">
        <h3 class="game-card-title">${game.title}</h3>
        <p class="game-card-description">${game.description}</p>
      </div>
      <div class="game-card-footer">
        <span class="game-card-category">${game.category}</span>
        <a href="${game.link}" target="_blank" class="game-card-link" onclick="event.stopPropagation();">
          开始游戏 <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>
  `).join('');
  
  // 为游戏卡片添加点击事件
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function() {
      const gameId = parseInt(this.dataset.gameId);
      openGameModal(gameId);
    });
    
    // 添加图片加载错误处理
    const img = card.querySelector('.game-card-image');
    if (img) {
      img.addEventListener('error', function() {
        console.warn(`图片加载失败: ${this.src}`);
        // 使用默认占位图片
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzNiODJmNiIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkdhbWUgQ292ZXI8L3RleHQ+PHRleHQgeD0iNDAwIiB5PSIzMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RmV2ZXIgR2FtZSBEZXZlbG9wZXI8L3RleHQ+PC9zdmc+';
        this.alt = '游戏封面图片加载失败，请上传图片到assets目录';
      });
    }
  });
}

// 8. 模态框管理
function openGameModal(gameId) {
  const game = gamesData.find(g => g.id === gameId);
  if (!game) return;
  
  appState.currentGame = game;
  
  // 构建模态框内容
  const modalContent = `
    <div class="modal-game-detail">
      <div class="modal-game-header">
        <img src="${game.imageUrl}" alt="${game.title}" class="modal-game-image">
        <div class="modal-game-badge">${game.badge}</div>
      </div>
      <div class="modal-game-body">
        <h2 class="modal-game-title">${game.title}</h2>
        <div class="modal-game-category">${game.category}</div>
        <p class="modal-game-description">${game.description}</p>
        
        <div class="modal-game-features">
          <h3>游戏特点</h3>
          <ul>
            ${game.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <div class="modal-game-actions">
          <a href="${game.link}" target="_blank" class="btn btn-primary">
            <i class="fas fa-play"></i> 立即游玩
          </a>
          <button class="btn btn-outline" id="shareGameBtn">
            <i class="fas fa-share-alt"></i> 分享游戏
          </button>
        </div>
        
        <div class="modal-game-meta">
          <div class="meta-item">
            <i class="fas fa-globe"></i>
            <span>网页游戏</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-code"></i>
            <span>HTML5 + JavaScript</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-gamepad"></i>
            <span>无需下载</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  domCache.modalBody.innerHTML = modalContent;
  domCache.gameModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // 为分享按钮添加事件
  const shareBtn = document.getElementById('shareGameBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => shareGame(game));
  }
}

function closeModal() {
  domCache.gameModal.classList.remove('active');
  document.body.style.overflow = '';
  appState.currentGame = null;
  
  // 添加关闭动画
  setTimeout(() => {
    domCache.modalBody.innerHTML = '';
  }, 300);
}

// 9. 分享功能
function shareGame(game) {
  const shareText = `快来玩 ${game.title} - Fever的精彩网页游戏作品！`;
  const shareUrl = game.link;
  
  if (navigator.share) {
    navigator.share({
      title: game.title,
      text: shareText,
      url: shareUrl
    }).catch(console.error);
  } else {
    // 备用分享方案
    const shareWindow = window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '分享到Twitter',
      'width=600,height=400'
    );
    
    if (shareWindow) {
      shareWindow.focus();
    } else {
      alert('请允许弹出窗口以进行分享');
    }
  }
}

function handleShareButtonClick(platform) {
  const game = appState.currentGame || gamesData[0];
  const shareUrl = game.link;
  const shareText = `推荐Fever的网页游戏《${game.title}》！`;
  
  let shareLink = '';
  
  switch (platform) {
    case 'twitter':
      shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      break;
    case 'facebook':
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      break;
    case 'weibo':
      shareLink = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
      break;
  }
  
  if (shareLink) {
    window.open(shareLink, '_blank', 'width=600,height=400');
  }
}

// 10. 滚动效果
function initScrollEffects() {
  // 导航栏滚动效果
  window.addEventListener('scroll', () => {
    appState.scrollPosition = window.scrollY;
    
    // 导航栏阴影
    if (domCache.navbar) {
      if (appState.scrollPosition > 50) {
        domCache.navbar.classList.add('scrolled');
      } else {
        domCache.navbar.classList.remove('scrolled');
      }
    }
    
    // 返回顶部按钮
    if (domCache.backToTop) {
      if (appState.scrollPosition > 300) {
        domCache.backToTop.classList.add('visible');
      } else {
        domCache.backToTop.classList.remove('visible');
      }
    }
    
    // 更新导航链接激活状态
    setActiveNavLink();
    
    // 滚动动画
    animateOnScroll();
  });
  
  // 返回顶部功能
  if (domCache.backToTop) {
    domCache.backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

function animateOnScroll() {
  const elements = document.querySelectorAll('.about-card, .game-card, .contact-card');
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight - 100) {
      element.classList.add('fade-in');
    }
  });
}

// 11. 事件绑定
function bindEvents() {
  // 主题切换
  if (domCache.themeToggle) {
    domCache.themeToggle.addEventListener('click', toggleTheme);
  }
  
  // 导航菜单切换
  if (domCache.navToggle) {
    domCache.navToggle.addEventListener('click', toggleNavMenu);
  }
  
  // 导航链接点击
  domCache.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href.startsWith('#')) {
        e.preventDefault();
        
        // 关闭移动端菜单
        if (window.innerWidth < 768 && appState.isNavOpen) {
          toggleNavMenu();
        }
        
        // 平滑滚动到对应部分
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // 模态框关闭
  if (domCache.modalClose) {
    domCache.modalClose.addEventListener('click', closeModal);
  }
  
  // 点击模态框外部关闭
  if (domCache.gameModal) {
    domCache.gameModal.addEventListener('click', (e) => {
      if (e.target === domCache.gameModal) {
        closeModal();
      }
    });
  }
  
  // 分享按钮
  domCache.shareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      handleShareButtonClick(platform);
    });
  });
  
  // 键盘事件
  document.addEventListener('keydown', (e) => {
    // ESC键关闭模态框
    if (e.key === 'Escape' && domCache.gameModal.classList.contains('active')) {
      closeModal();
    }
    
    // 主题切换快捷键 (Alt+T)
    if (e.altKey && e.key === 't') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

// 12. 工具函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function getRandomColor() {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 13. 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 14. 性能优化：延迟加载非关键资源
window.addEventListener('load', () => {
  // 添加加载完成动画
  document.body.classList.add('loaded');
  
  // 延迟加载图片
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  });
  
  // 性能监控
  if ('performance' in window) {
    const perfData = window.performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`⏱️ 页面加载时间: ${loadTime}ms`);
  }
});

// 15. PWA支持检测
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}

// 16. 错误处理
window.addEventListener('error', (e) => {
  console.error('❌ 页面错误:', e.message);
  // 可以在这里添加错误上报逻辑
});

// 导出函数供全局使用（如果需要）
window.FeverPortfolio = {
  toggleTheme,
  openGameModal,
  closeModal,
  shareGame,
  gamesData
};