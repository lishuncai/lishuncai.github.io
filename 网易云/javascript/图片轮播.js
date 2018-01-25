//原生js图片轮播
var n=0;
var timer=null;
var speed=1500;

var contains=document.querySelector('.center-contains'),
 	controls=contains.querySelector('.controls'),
	imgsPlay=contains.querySelector('.imgs-play'),
	but_left=contains.querySelector('.left'),
	but_right=contains.querySelector('.right'),
	marks=contains.querySelectorAll('.mark');

var items=document.querySelector('#items');
	itemArr=items.querySelectorAll('.item'),
	imgs=items.querySelectorAll('img'),
	item=itemArr[0];
var itemWidth;

	
Object.prototype.addEvent=function(evenType,callback,nostop){
	this.addEventListener(evenType,function(e){
		var e=e||window.event;
		//如果nostop为true，可根据情况手动阻止冒泡或默认行为;
		if(nostop){
			callback();
			// callback.call(this);//this为点击对象
		}else{
			e.stopPropagation();
			e.preventDefault();
			callback.call(this);
		}
	},nostop);
}

//事件的区别，普通的方式不能同时添加多个事件函数，会取最后的事件函数；
//监听机制可以绑定多个事件；
//鼠标移入画廊;
function imgsPlay_over(){
	clearTimeout(timer);
	but_left.style.opacity=1;
	but_right.style.opacity=1;
}
//移出画廊
function imgsplay_out(){
	but_left.style.opacity=0;
	but_right.style.opacity=0;
	timer=setTimeout(play,speed);
	this.removeEventListener('mouseover',imgsPlay_over);
	this.removeEventListener('mouseout',imgsplay_out);
}
//监听画廊事件；
items.addEvent('mouseover',imgsPlay_over,true);
items.addEvent('mouseout',imgsplay_out,true);


//鼠标点击按钮
function butDown(){
	this.style.transform='scale(0.8)';
}
function butUp(){
	play(this.derection);
}
//鼠标移入按钮
function butOver(){
	this.style.opacity=1;
	this.addEventListener('click',butUp,false);
	this.addEventListener('mouseout',butOut,false);
}
//移出按钮
function butOut(){
	this.removeEventListener('mousedown',butDown);
	this.removeEventListener('mouseup',butUp);
	this.removeEventListener('mouseout',butOut);

}
//监听按钮事件
but_left.derection='left';
but_right.derection='right';
but_left.addEventListener('mouseover',butOver,false);
but_right.addEventListener('mouseover',butOver,false);

for(var i=0;i<imgs.length;i++){
	imgs[i].small=function(){
		this.style.transform='scale(1)'+'translateY(0)';
	};
	imgs[i].big=function(){
		this.style.transform='scale(1.2)'+'translateY(-7%)';
	};
	imgs[i].addEvent('mouseover',function(){
		var restyle=this.style.filter;
		this.style.filter+='contrast(0.6)';
		this.addEvent('mouseout',function(){
			this.style.filter=restyle;
		})
	},false)
}
play();
function play(derection){
	clearTimeout(timer);
	if(!items.hasAttribute('move')){
		items.setAttribute('move',"");
	}
	//contains.offsetWidth的值是随窗口变化的
	itemWidth=contains.offsetWidth/3;
	if(derection==='left'){
		left();
	}else{
		right();
	}
	
	timer=setTimeout(play,speed);	
}
function left(){
	if(n===0){
		n=6;
		imgs[7].removeAttribute('scale');
		imgs[7].big();
		imgs[7].style.filter='brightness(160%)';
		imgs[7].parentNode.style.zIndex=99;
		items.removeAttribute('move');
		items.style.marginLeft= -6* itemWidth+'px';
		imgs[1].setAttribute('scale','small');
		imgs[1].small();
		imgs[1].removeAttribute('scale');
	}else{
		n-=1;
		items.style.marginLeft=-n*itemWidth+'px';
		imgs[n+2].setAttribute('scale','small');
		imgs[n+2].small();
		imgs[n+2].style.filter='brightness(100%)';
		imgs[n+1].setAttribute('scale','big');
		imgs[n+1].big();
		imgs[n+1].style.filter='brightness(160%)';

	}
	// items.style.marginLeft=items.offsetLeft+itemWidth+'px';
	// n-=1;
}
function right(){
	if(n===6){
		n=0;
		imgs[1].removeAttribute('scale');
		imgs[1].big();
		imgs[1].style.filter='brightness(160%)';
		//关键句，解决imgs[2]覆盖imgs[1]的问题；
		//元素声明transform时，层级变得很高，兄弟元素同等级别情况下，后来元素居上。
		//所以这里把imgs[1]的老爸请出来了。此处感谢张鑫旭！
		imgs[1].parentNode.style.zIndex=99;
		items.removeAttribute('move');
		items.style.marginLeft= 0+'px';
		imgs[7].setAttribute('scale','small');
		imgs[7].small();
		imgs[7].removeAttribute('scale');
	}else{
		//这里必须用else,否则达不到无缝的效果
		n+=1;
		items.style.marginLeft=-n*itemWidth+'px';
		imgs[n].setAttribute('scale','small');
		imgs[n].small();
		imgs[n].style.filter='brightness(100%)';
		imgs[n+1].setAttribute('scale','big');
		imgs[n+1].style.filter='brightness(160%)';
		imgs[n+1].big();
	}
	for(var i=0;i<marks.length;i++){
		marks[i].style.backgroundColor="";
	}
	marks[n].style.backgroundColor='#ccc';
}

window.onresize=function(){
	clearTimeout(timer);	
	items.removeAttribute('move');
	timer=setTimeout(play,500);
}