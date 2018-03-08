/*图片轮播 imgsPlay*/
/*重点在于临界处理,先监测值再增值；*/
var imgsPlay=document.getElementById('imgsPlay');
var leftBut=imgsPlay.querySelector('.leftBut'),
    rightBut=imgsPlay.querySelector('.rightBut');
var items=imgsPlay.querySelector('#items');
    items.move=true;
var itemArr=items.querySelectorAll('.item');
    itemArr[1].setAttribute('scale','big');//受其他进程影响，这里会报错，事实上这里不会有错的
var marks=imgsPlay.querySelectorAll('.marks >span');
var timer;  //定时器；
var n=0;  //系数；
var L;  //图片数量；
var speed=2000; //定时器间隔；
var timerMove;    // 延迟移动的定时器；
var timersetAttr;   //延迟赋予属性的定时器；
var timerClick;   //点击定时器，用来限制点击之间
//将定时器和运动函数分离，方便扩张
L=itemArr.length-3;
items.setAttribute('move','');
setTimer();
function setTimer(){
  clearTimeout(timer);
  timer=setTimeout(setTimer,speed);
  move();
}
function move(dir){
  dir=dir||'right';
  if(dir==='right'){
    if(n>L-1){
      //移除元素过度属性
      n=0;
      items.move=false;
      items.removeAttribute('move');
      itemArr[L+1].removeAttribute('scale');
      itemArr[1].removeAttribute('scale');
      itemArr[1].setAttribute('transform','');
      items.style.marginLeft= -(n/3)*100+'%';
    }
    n++;
  }
  if(dir==='left'){
    if(n<1){
      n=L;
      items.removeAttribute('move');
      items.move=false;
      itemArr[1].removeAttribute('scale');
      itemArr[L+1].removeAttribute('scale');
      itemArr[L+1].setAttribute('transform','');
      items.style.marginLeft= -(n/3)*100+'%';
    }
    n--;
  }
  //恢复上面移除的属性，设置时间间隔不小于200ms,
  //避免恢复属性后因时间间隔过短影响上面的属性取消操作；
  if(items.move===false){
    //items.move=false时表示已经替换位置了
    items.move=true;
    clearTimeout(timersetAttr);
    timersetAttr=setTimeout(function(){
      items.setAttribute('move','');
      if(dir==='right'){
        itemArr[1].removeAttribute('transform');
        itemArr[1].setAttribute('scale','small');
        itemArr[L+1].setAttribute('scale','small');
      }else{
        itemArr[L+1].removeAttribute('transform');
        itemArr[L+1].setAttribute('scale','small');
        itemArr[1].setAttribute('scale','small');
      }
    },200)
  }
  function scaleRight(){
    itemArr[n+1].setAttribute('scale','big');
    itemArr[n].setAttribute('scale','small');
  }
  function scaleLeft(){
    itemArr[n+1].setAttribute('scale','big');
    itemArr[n+2].setAttribute('scale','small');
  }
  clearTimeout(timerMove);
  timerMove=setTimeout(function(){
    if(dir==='left'){
      scaleLeft();
      markJump(n)
    }
    if(dir==='right'){
      scaleRight();
      markJump(n-1);
    }
  items.style.marginLeft= -(n/3)*100+'%';
  /* 除以3是因为margin-left比例是根据父标签imgsPlay的width值决定的,
  以达到自适应效果，窗口缩放时移动距离有偏差这两个bug*/
  },200)
}
//点击下面的小圆圈
//好吧，因为某种复杂的原因，第一个圆圈对应itemArr[2]
function markJump(index){
  for(var j=0;j<marks.length;j++){
    marks[j].style.background='none';
  }
  marks[index].style.background='white';
}
for(var i=0;i<marks.length;i++){
  (function(index){
    marks[index].onclick=function(){
      itemArr[n+1].setAttribute('scale','small');
      n=index+1;
      items.style.marginLeft= -((index+1)/3)*100+'%';
      itemArr[index+2].setAttribute('scale','big');
      markJump(index);
    }
  })(i);
}

imgsPlay.onmouseover=function(){
  clearTimeout(timer);
  leftBut.style.visibility='visible';
  rightBut.style.visibility='visible'
}
imgsPlay.onmouseout=function(){
  timer=setTimeout(setTimer,speed);
  leftBut.style.visibility='hidden';
  rightBut.style.visibility='hidden'
}

function cut(dir){
  clearTimeout(timerClick);
  timerClick=setTimeout(function(){
    move(dir);
  },200)
}
leftBut.onclick=function(){
  cut('left')  //不能小于200ms;因为上面移动时设置了200ms的间距
}
rightBut.onclick=function(){
  cut('right')
}
//鼠标滚轮事件
function wheel(e,value){
  e=e||window.event;
  if(e.wheelDelta){
    value=e.wheelDelta/120
  }else if(e.detail){
    value=-e.detail/3
  }
  if(value<0){
    cut('right')
  }else{
    cut('left')
  }
  e.preventDefault();
  e.stopPropagation();
}
items.onmousewheel=wheel;
items.addEventListener('DOMMouseScroll',wheel,false);
