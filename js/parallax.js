/* ============================================================
   全站动态视频背景 + 鼠标视差 - parallax.js
   原理:
     - 在 <body> 底部创建全屏 <video> 背景层（循环播放动态壁纸）
     - 鼠标移动 → 计算相对屏幕中心的位置 (-1 ~ 1)
     - 应用到背景层的 transform 位移（方向权重: 横 x1.0, 纵 x0.2）
   注意: 视频层必须放在 body 级（而非 #page-header），
         因为 disable_top_img 会让 #page-header 塌缩成导航栏高度。
   通过 _config.butterfly.yml 的 inject.bottom 引入
   ============================================================ */

(function () {
  // 最大位移量（px），调大 = 鼠标移动时背景动得更明显
  var MAX_SHIFT = 30;
  // 纵向权重（横向的 0.2 倍，模仿壁纸的方向权重）
  var VERTICAL_WEIGHT = 0.2;
  // 动态背景视频路径（source/img/core/live-bg.mp4）
  var VIDEO_SRC = '/img/core/live-bg.mp4';

  function initParallax() {
    // pjax 切换时 body 级视频层不会被替换，已存在则跳过
    var existing = document.querySelector('body > .parallax-bg');
    if (existing) return;

    // 创建全屏视频背景层（浏览器要求 muted + playsinline 才能自动播放）
    var video = document.createElement('video');
    video.className = 'parallax-bg';
    video.src = VIDEO_SRC;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    document.body.insertBefore(video, document.body.firstChild);

    // 视频加载失败时隐藏（露出 body 静态背景图）
    video.addEventListener('error', function () {
      video.style.display = 'none';
    });

    var raf = null;
    function onMouseMove(e) {
      if (raf) return;
      raf = window.requestAnimationFrame(function () {
        raf = null;
        // 鼠标相对屏幕中心: -1 (最左) ~ 1 (最右)
        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;
        video.style.transform =
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
