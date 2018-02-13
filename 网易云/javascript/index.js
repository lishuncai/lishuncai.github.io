//轮播图；
var imgs=[];
for(var i=0;i<6;i++){
	var url='background-image:url(imgs/轮播图/'+i+'.jpg)';
	imgs.push(url);
}
//重复三张图片
imgs.push(imgs[0],imgs[1],imgs[2]);
//栏目
var Groups=[
{head:'推荐歌单', cla:'Recom',name:'Recom'},
{head:'独家放送', cla:'special',name:'special'},
{head:'最新音乐', cla:'new',name:'new'},
{head:'推荐MV', cla:'MV',name:'MV'},
{head:'主播电台', cla:'radio',name:'radio'}
];
var Groups_content=[listDetails,listDetails];
//推荐歌单
var dec=[
	'幻想净琉璃',
	'refrain',
	'古明地灵殿',
	'秘封活动记录',
	'花之舞',
	'天空花都',
	'东方交响乐',
	'彩月',
	'古树旋律',
	'东方风神录'
]
var bgImgs=bgimgs();
	function bgimgs(){
		var imgs_url=[];
		for(var i=0;i<10;i++){
			imgs_url.push('url(./imgs/推荐歌单/'+i+'.jpg)');
		}
		return imgs_url
	}
var listDetails={
	played:function(){
		return parseInt(Math.random()*1000)+'万'
	},
	dec:dec,
	bgImage:bgImgs,
	name:'Recom'
}

//最新音乐
var newestSong={
	pics:function(){
		var r=Math.floor(Math.random()*256);
		var g=Math.floor(Math.random()*256);
		var b=Math.floor(Math.random()*256);
		return 'rgb('+r+','+g+','+b+')';

	},
	songname:[],
	author:[]
};
build();
function build(){
	for(var i=97;i<107;i++){
		newestSong.songname.push('歌曲'+String.fromCharCode(i));
		newestSong.author.push('作者'+String.fromCharCode(i-32));
	}
}

Vue.component(
	'Recom',{
		template:
		"<div>\
			<p class='h'>\
				<span>推荐歌单</span>\
				<span class='more'>更多 &gt;</span>\
			</p>\
			<div class='lists'>\
				<div v-for='(dec,index) in list' class='list'>\
					<div class='dec'>\
						<span class='num'>{{listsong.played()}}</span>\
					</div>\
					<span>{{dec}}</span>\
				</div>\
			</div>\
		</div>",
		props:['listsong','list'],
		data:function(){
			return {
				num: listDetails.played
			}
		},
		mounted:function(){
			var dec=document.querySelectorAll('.dec');
			for(var i=0;i<dec.length;i++){
				dec[i].style.backgroundImage=listDetails.bgImage[i];
				dec[i].style.backgroundRepeat='norepeat';
				dec[i].style.backgroundSize='100% 100%'
			}
		}
	}
)
Vue.component('songs',{
		template:'#my-newsong',
		props:{
			song:Object
		},
		data:function(){
			return {
				items:newestSong,
				colorBlock:function(){
					return "backgroundColor:"+newestSong.pics()
				}
			}
		}
	})
var imgbg=imgs[0];
var app=new Vue({
	el:"#musicApp",
	data:{
		items:imgs,
		Groups:Groups,
		listDetails:listDetails,
		newsong:newestSong,
		change:false
	}
});
