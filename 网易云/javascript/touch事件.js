var container=document.querySelector('#container');
addTouch(container);
function addTouch(obj){
  var x;
  var y;
  var moveX;
  var width=document.body.clientWidth;
  var left;
  obj.addEventListener('touchstart',handleStart,false);
  function handleStart(e){
    if(e.targetTouches.length=1){
      var touch=e.targetTouches[0];
      x=touch.clientX;
      y=touch.clientY;
      obj.addEventListener('touchmove',handleMove,false);
      obj.addEventListener('touchend',handleEnd,false);
      obj.addEventListener('touchcancle',handleEnd,false)
    }
  }
  function handleMove(e){
    var touch=e.targetTouches[0];
    left=obj.offsetLeft;
    moveX=touch.clientX-x;
    obj.style.left=obj.offsetLeft+moveX/10+'px';//除以10可让过度更平缓
    if(obj.offsetLeft>0){
      obj.style.left=0
    }else if(obj.offsetLeft<-width){
      obj.style.left=-width+'px'
    }
  }
  function handleEnd(){
    var offsetLeft=obj.offsetLeft;
    if(obj.offsetLeft<-width/2){
      obj.style.left=-width+'px'
    }else if(obj.offsetLeft>=-width/2){
      obj.style.left=0;
    }
    obj.removeEventListener('touchmove',handleMove);
    obj.removeEventListener('touchend',handleEnd);
    obj.removeEventListener('touchcancle',handleEnd)
  }
}
