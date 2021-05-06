/*图片切割条数*/
const cols = 8;
/*获取Div类*/
const core = document.getElementById('core');
let parts = [];

/*图片合集*/
let images = [
  "http://www.dmoe.cc/random.php",
  "https://api.dongmanxingkong.com/suijitupian/acg/1080p/index.php",
  "https://api.ghser.com/random/api.php",
];

let current = 0;
let playing = false;
/*图片预加载*/
for (let i in images) {
  new Image().src = images[i];
}

/*生成图片剪切条条 */
for (let col = 0; col < cols; col++) {
  let part = document.createElement('div');/*创建一个div并设置属性*/
  part.className = 'part';
  let el = document.createElement('div');/*创建一个div并设置属性*/
  el.className = "section";
  let img = document.createElement('img');/*创建一个img并设置属性*/
  img.src = images[current];
  el.style.width = el.img
  el.appendChild(img);/*为元素添加一个新的子元素*/
  part.style.setProperty('--x', -100/cols*col+'vw');/*设置或返回元素的样式属性*/
  part.appendChild(el);/*为元素添加一个新的子元素*/
  core.appendChild(part);/*为元素添加一个新的子元素*/
  parts.push(part);/*向全局数组添加已经创建好的元素*/
}

let animOptions = {
  duration: 2.3,
  ease: Power4.easeInOut
};

function go(dir) {/**切换壁纸 */
  if (!playing) {
    playing = true;
    if (current + dir < 0) current = images.length - 1;
    else if (current + dir >= images.length) current = 0;
    else current += dir;
/*向上切换壁纸*/
    function up(part, next) {
      part.appendChild(next);
      gsap.to(part, {...animOptions, y: -window.innerHeight}).then(function () {
        part.children[0].remove();
        gsap.to(part, {duration: 0, y: 0});
      })
    }
/*向下切换壁纸*/
    function down(part, next) {
      part.prepend(next);
      gsap.to(part, {duration: 0, y: -window.innerHeight});
      gsap.to(part, {...animOptions, y: 0}).then(function () {
        part.children[1].remove();
        playing = false;
      })
    }

    for (let p in parts) {
      let part = parts[p];
      let next = document.createElement('div');
      next.className = 'section';
      let img = document.createElement('img');
      img.src = images[current];
      next.appendChild(img);

      if ((p - Math.max(0, dir)) % 2) {
        down(part, next);
      } else {
        up(part, next);
      }
    }
  }
}

window.addEventListener('keydown', function(e) {
  if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
    go(1);
  }

  else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
    go(-1);
  }
});

function lerp(start, end, amount) {
  return (1-amount)*start+amount*end
}

const cursor = document.createElement('div');
cursor.className = 'cursor';

const cursorF = document.createElement('div');
cursorF.className = 'cursor-f';
let cursorX = 0;
let cursorY = 0;
let pageX = 0;
let pageY = 0;
let size = 8;
let sizeF = 36;
let followSpeed = .16;

document.body.appendChild(cursor);
document.body.appendChild(cursorF);

if ('ontouchstart' in window) {
  cursor.style.display = 'none';
  cursorF.style.display = 'none';
}

cursor.style.setProperty('--size', size+'px');
cursorF.style.setProperty('--size', sizeF+'px');

/*鼠标指针渲染*/
window.addEventListener('mousemove', function(e) {
  pageX = e.clientX;
  pageY = e.clientY;
  cursor.style.left = e.clientX-size/2+'px';
  cursor.style.top = e.clientY-size/2+'px';
});

function loop() {
  cursorX = lerp(cursorX, pageX, followSpeed);
  cursorY = lerp(cursorY, pageY, followSpeed);
  cursorF.style.top = cursorY - sizeF/2 + 'px';
  cursorF.style.left = cursorX - sizeF/2 + 'px';
  requestAnimationFrame(loop);
}

loop();

let startY;
let endY;
let clicked = false;

function mousedown(e) {/*鼠标点击事件*/
  gsap.to(cursor, {scale: 12});
  gsap.to(cursorF, {scale: .8});

  clicked = true;
  startY = e.clientY || e.touches[0].clientY || e.targetTouches[0].clientY;
}
function mouseup(e) {/*鼠标点击事件*/
  gsap.to(cursor, {scale: 1.2});
  gsap.to(cursorF, {scale: 1.5});

  endY = e.clientY || endY;
  if (clicked && startY && Math.abs(startY - endY) >= 40) {
    go(!Math.min(0, startY - endY)?1:-1);
    clicked = false;
    startY = null;
    endY = null;
  }
}
window.addEventListener('mousedown', mousedown, false);
window.addEventListener('touchstart', mousedown, false);
window.addEventListener('touchmove', function(e) {
  if (clicked) {
    endY = e.touches[0].clientY || e.targetTouches[0].clientY;
  }
}, false);
window.addEventListener('touchend', mouseup, false);
window.addEventListener('mouseup', mouseup, false);

let scrollTimeout;
function wheel(e) {/**切换壁纸方向分发 */
  clearTimeout(scrollTimeout);
  setTimeout(function() {
    if (e.deltaY < -40) {
      go(-1);
    }
    else if (e.deltaY >= 40) {
      go(1);
    }
  })
}
window.addEventListener('mousewheel', wheel, false);
window.addEventListener('wheel', wheel, false);
