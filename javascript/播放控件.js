var audioInput=document.getElementById('audio');
var ac;//音频环境
var gainNode;//音量节点
var analyser;//分析节点
var ArrayBuffer;//
var bufferSource;//音源缓冲
var source;//音源缓冲
var size;
var Hots=[];//柱子上的帽子
var times;
var animationFrame;
var circlesAnimation;//进度条动画
var range=document.querySelector('#range');
var shownum=document.querySelector('#num');
var fileLoadResolve=false;
var count=0;

audioInput.onchange=function(){
  if(!audio.files[0]){
    return
  }else if(audio.files.length!==0){
    source && source.stop();
    var file=audio.files[0];
    var reader=new FileReader();
    reader.readAsArrayBuffer(file);
    // if(reader.readyState===2){}
    reader.onload=function(){
      fileLoadResolve=true;
      build(reader,0);
      app.play=true;//来自vue对象的数据
    };
  }
}

function build(reader,when){
      var n= ++count;
      ac=new (window.AudioContext||window.webkitAudioContext||window.mozAudioContext)();
      // gainNode=ac.createGain();
      // gainNode.connect(ac.destination);
      analyser=ac.createAnalyser();
      analyser.fftSize=32;
      // analyser.connect(gainNode);
      analyser.connect(ac.destination);
      ArrayBuffer=reader.result;

      ac.decodeAudioData(ArrayBuffer,function(buffer){
        if(n != count)return;
        bufferSource=ac.createBufferSource();
        bufferSource.buffer=buffer;
        times=bufferSource.buffer.duration;
        size=analyser.frequencyBinCount-4;
        bufferSource.connect(analyser);
        bufferSource.start(0,when,bufferSource.buffer.duration);
        source=bufferSource;

        width=canvas.width/size;
        for(var i=0;i<size;i++){
          Hots.push({
            y:canvas.height/2
          })
        }
        draw();
        // volume(range.value/100);
        playDuration(when);
        sliding();
      },function(err){
        alert('请选择音频文件');
        console.error(err);
      })
    }

var circles=document.querySelectorAll('.circles')[0];
var duration=document.querySelectorAll('.duration')[0];
var canvas=document.getElementById('canvas');
var canvasCtx=canvas.getContext('2d');
var width;
var controlsTime=document.querySelector('.controls-time');
var durationRed=document.querySelector('.duration-red');

function draw(){
  window.cancelAnimationFrame(animationFrame);
  var arr=new Uint8Array(size);
  analyser.getByteFrequencyData(arr);

  canvasCtx.clearRect(0,0,canvas.width,canvas.height);
  for(var i=0;i<size;i++){
    var height=arr[i];
    canvasCtx.fillStyle='rgba(255,255,255,1)';
    canvasCtx.lineWidth=0.1;
    canvasCtx.strokeStyle='rgba(255,255,255,0.1)';
    canvasCtx.fillRect((i)*width,canvas.height/2,width/2,-arr[i]*0.2);
    canvasCtx.fillRect((i)*width,Hots[i].y,width/2,-1);
    //左上
    canvasCtx.fillRect((i)*width,Hots[i].y,width/2,-1);
    canvasCtx.fillStyle='rgba(0,0,0,0.2)';
    canvasCtx.fillRect((i)*width,canvas.height/2,width/2,arr[i]*0.1);

    Hots[i].y+=0.18;
    if(Hots[i].y<0){
      Hots[i].y=0;
    }
    if(Hots[i].y>canvas.height/2){
      Hots[i].y=canvas.height/2;
    }
    if(Hots[i].y>canvas.height/2-arr[i]*0.2){
      Hots[i].y-=4;
    }

  }
  animationFrame=window.requestAnimationFrame(draw);
}


//调整音量
// var range=document.querySelector('#range');
// range.addEventListener('change',function(){
//   volume(this.value/this.max)
// },false);
// function volume(num){
//   gainNode.gain.value=num;
//   shownum.innerHTML=Math.floor(num*100);
// }


//进度条播放
function playDuration(when){
  if(ac.currentTime && when+ac.currentTime>=times){
    circles.style.left=0+'px';
    durationRed.style.width=0;
    window.cancelAnimationFrame(animationFrame);
    canvasCtx.clearRect(0,0,canvas.width,canvas.height);
    console.log('播放完成');
    app.play=false;
    ac.close();
  }else{
    var time=Math.floor((when+ac.currentTime)/times *duration.offsetWidth);
    circles.style.left=time+'px';
    durationRed.style.width=time+'px';
    circlesAnimation=window.requestAnimationFrame(function(){
      playDuration(when);
    });
    /*这里有个问题,如果用
    circlesAnimation=window.requestAniamtionFrame(playDuration);
    第二次执行 draw(when) 时，when 会自动变成
    bufferSource.buffer.duration 的值，神奇的bug！！！*/
  }
}

//滑动进度条,跳播
function acRebuild(when){
  if(ac.state!=='closed'){
    ac.close()
  }else{
    return
  }
  var file=audio.files[0];
  var reader=new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload=function(){
    build(reader,when)
  }

}


function sliding(){
  var L;
  var touch;
  //拖动圆圈
  function move(e,touch){
    e=e||window.event;
    if(touch){
      e=touch;
    }
    var L=Math.floor(e.clientX)-duration.offsetLeft;
    if(L<0){
      circles.style.left=0+'px';
      L=0
    }else if(L>duration.offsetWidth){
      circles.style.left=duration.offsetWidth+'px';
    }else{
      circles.style.left=L+'px';
    }
  }
  function up(){
    var L=circles.offsetLeft;
    var when=L /duration.offsetWidth *bufferSource.buffer.duration;
    acRebuild(when);//重新建立音频环境
    document.body.removeEventListener('mousemove',move);
    document.body.removeEventListener('mouseup',up);    
  }
  function down(e,touch){
    window.cancelAnimationFrame(circlesAnimation);
    document.body.addEventListener('mousemove',move,false);
    document.body.addEventListener('mouseup',up,false);
    circles.ontouchmove=function(e){
      touch=e.targetTouches[0];
      move(e,touch)
    }
    circles.ontouchend=function(e){
      touch=e.targetTouches[0];
      up(e,touch)
    }
  }
  circles.onmousedown=function(e){
    e=e||window.event;
    down(e);
    e.stopPropagation();
    e.preventDefault();
  };
  circles.ontouchstart=function(e){
    var touch=e.targetTouches[0];
    down(e,touch);
    e.stopPropagation();
    e.preventDefault();
  }
  //点击进度条
  controlsTime.onmousedown=function(e){
    e=e||window.event;
    window.cancelAnimationFrame(circlesAnimation);
    circles.style.left=e.clientX-duration.offsetLeft+'px';
    var when=(Math.floor(e.clientX)-duration.offsetLeft)
      /duration.offsetWidth
      *bufferSource.buffer.duration;
    acRebuild(when);
    e.preventDefault();
  }
  //duration.addEventListener('mousedown',jump,false)
}

//暂停与播放
var resume=document.querySelector('.resume');
var suspend=document.querySelector('.suspend');
resume.onclick=function(){
  ac.resume().then(function(){
    console.log('已恢复')
  })
}
suspend.onclick=function(){
  ac.suspend().then(function(){
    console.log('暂停')
  });
}
