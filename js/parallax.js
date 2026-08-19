/* ============================================================
   顶图鼠标视差效果 - parallax.js
   原理（参考 Wallpaper Engine 壁纸的深度视差）:
     - 鼠标移动 → 计算相对屏幕中心的位置 (-1 ~ 1)
     - 应用到顶图背景层的 transform 位移
     - 方向权重: 横向 x1.0, 纵向 x0.2（与壁纸 g_DirectionWeights "1 0.2" 一致）
   通过 _config.butterfly.yml 的 inject.bottom 引入
   ============================================================ */

(function () {
  // 最大位移量（px），调大 = 鼠标移动时背景动得更明显
  var MAX_SHIFT = 30;
  // 纵向权重（横向的 0.2 倍，模仿壁纸的方向权重）
  var VERTICAL_WEIGHT = 0.2;

  function initParallax() {
    var header = document.getElementById('page-header');
    if (!header) return;

    // pjax 切换后 header 是新的，先清理旧的视差层
    var old = header.querySelector('.parallax-bg');
    if (old) old.parentNode.removeChild(old);

    // 创建视差背景层
    var bg = document.createElement('div');
    bg.className = 'parallax-bg';

    // 自动跟随主题配置的全局背景图（body 的 background-image）
    var bodyBg = window.getComputedStyle(document.body).backgroundImage;
    if (bodyBg && bodyBg !== 'none') {
      bg.style.backgroundImage = bodyBg;
    } else {
      bg.style.backgroundImage = "url('/img/core/bkgnd1.webp')";
    }

    header.insertBefore(bg, header.firstChild);

    var raf = null;
    function onMouseMove(e) {
      if (raf) return;
      raf = window.requestAnimationFrame(function () {
        raf = null;
        // 鼠标相对屏幕中心: -1 (最左) ~ 1 (最右)
        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;
        bg.style.transform =
          'translate3d(' + (x * MAX_SHIFT).toFixed(1) + 'px, ' +
          (y * MAX_SHIFT * VERTICAL_WEIGHT).toFixed(1) + 'px, 0)';
      });
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  // 首次加载 + butterfly pjax 页面切换后都要初始化
  document.addEventListener('DOMContentLoaded', initParallax);
  document.addEventListener('pjax:complete', initParallax);
})();
