var container = document.querySelector('#container');
addTouch(container);

function addTouch(obj) {
  var x;
  var y;
  var moveX;
  var moveY;
  var width = document.body.clientWidth;
  var left;
  obj.addEventListener('touchstart', handleStart, false);

  function handleStart(e) {
    obj.style.transition = '';
    if (e.targetTouches.length = 1) {
      var touch = e.targetTouches[0];
      x = touch.clientX;
      y = touch.clientY;
      obj.addEventListener('touchmove', handleMove, false);
      obj.addEventListener('touchend', handleEnd, false);
      obj.addEventListener('touchcancle', handleEnd, false)
    }
  }

  function handleMove(e) {
    e.stopPropagation();
    if (obj.offsetLeft > 0 || obj.offsetLeft < -width) {
      return
    }
    var touch = e.targetTouches[0];
    left = obj.offsetLeft;
    moveX = touch.clientX - x;
    moveY = touch.clientY - y;
    if (moveX < 120 && moveX > -120) {
      return
    }
    if ((moveY / moveX > 1) && (moveY / moveX < -1)) {
      return
    }
    obj.style.left = obj.offsetLeft + moveX / 4 + 'px';
    if (obj.offsetLeft > 0) {
      obj.style.left = 0
    } else if (obj.offsetLeft < -width) {
      obj.style.left = -width + 'px'
    }

  }

  function handleEnd() {
    var offsetLeft = obj.offsetLeft;
    obj.style.transition = 'all .1s ease';
    if (obj.offsetLeft < -width / 2) {
      obj.style.left = -width + 'px'
    } else if (obj.offsetLeft >= -width / 2) {
      obj.style.left = 0;
    }
    obj.removeEventListener('touchmove', handleMove);
    obj.removeEventListener('touchend', handleEnd);
    obj.removeEventListener('touchcancle', handleEnd)
  }
}
