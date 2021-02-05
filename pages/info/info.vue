<template>
	<view>
		<view v-if="time<1612571400">
			<image src="../../static/A.jpg" class="img"></image>
			<image src="../../static/B.jpg" class="img"></image> 
			<image src="../../static/C.jpg" class="img"></image>
		</view>
		<view v-else>
			<view class="videobox" v-if="data">  
				<video :src="url" :show-play-btn="showplaybtn" :show-fullscreen-btn="showfullscreenbtn"    
				 :controls="controls" :autoplay="autoplay" :loop="loop" class="video" :object-fit="objectfit"  v-if="time>1612571400"></video><!-- :style="{height:screenHeight+'px'}" -->
			</view> 
			<cover-view class="top-view" v-if="time>1612571400">
				<cover-view class="top-view-bg"></cover-view>
				<cover-image :src="data.tx_img" mode="" class="top-view-headimg"></cover-image>
				<cover-view class="top-view-title">
					{{getname(data.user_name)}}
				</cover-view>
				<cover-view class="top-view-info">
					{{data.online_num+1}}人观看
				</cover-view>
			</cover-view>
			<cover-view class="right-view" v-if="time>1612571400">
				
				<button open-type="share" style="background-color: transparent;">
					<cover-view class="right-view-item">
						<cover-view class="right-view-item-bg"></cover-view>
						<cover-image src="../../static/icon/share.png" class="right-view-item-img" mode=""></cover-image>
					</cover-view>
				</button>
				<cover-view class="right-view-item" @click="download">
					<cover-view class="right-view-item-bg"></cover-view>
					<cover-image src="../../static/icon/download.png" class="right-view-item-img" mode=""></cover-image>
				</cover-view>
				<cover-view class="right-view-item" @click="$utils.back(1)">
					<cover-view class="right-view-item-bg"></cover-view>
					<cover-image src="../../static/icon/cancel.png" class="right-view-item-img" mode=""></cover-image>
				</cover-view>
			</cover-view>
			<!-- 下载 -->
			<cover-view class="downloadView" v-if="showDownload" >
				<cover-view class="downloadView-bg"></cover-view>
				<cover-view class="downloadView-body">
					<cover-view>下载进度{{progress}}%</cover-view>
					<cover-view style="margin-top: 20rpx;font-size: 20rpx;color: #007AFF;font-weight: 300;" @click="showDownload=false">隐藏到后台下载</cover-view>
				</cover-view>
			</cover-view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				live_id:0,
				data:"",
				showplaybtn:false,
				controls:false,
				autoplay:true,
				loop:true,
				showfullscreenbtn:false,
				url:'',
				statusBarHeight:0,
				screenHeight:0,
				objectfit:"fill",
				showDownload:false,
				progress:0,
				time:0
			}
		},
		onLoad(e) {
			this.time=Date.parse(new Date())/1000;
			//获取系统状态栏高度
			let that = this;
			uni.getSystemInfo({
			    success: function (res) {
			        that.statusBarHeight=res.statusBarHeight;
					that.screenHeight=res.screenHeight;
			    }
			});
			this.live_id=e.id;
			console.log(this.live_id);
			this.init();
		},
		onShareAppMessage(res) {
			console.log('/pages/video/video'+"?id="+this.live_id);
			return {
				title: "我发现了一个有意思的视频，你也来看看吧！",
				path: '/pages/info/info'+"?id="+this.live_id,
			}
		},
		methods: {
			download(){
				let that = this;
				uni.showModal({
					title: '提示',
					content: "下载App了解更多?",
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
							that.$utils.request("https://idzg.com/weixin/index/version_num",{},res=>{
								console.log(res);
								let url = res.data.version_url;
								that.showDownload=true;
								const downloadTask = uni.downloadFile({
								    url:url, 
									header:{
										'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
									},
								    success: (re) => {
										console.log(re);
								        if (re.statusCode === 200) {
								            console.log('下载成功');
											uni.saveFile({
												tempFilePath:re.tempFilePath,
												success:(res)=>{
													that.showDownload=false;
													that.$utils.tips("下载成功！",2000);
													 //res.savedFilePath文件的保存路径
													 //保存成功并打开文件
													 uni.openDocument({
														filePath:res.savedFilePath,
														success:(res)=>console.log('成功打开文档')
													})
												},
												fail:()=>console.log('下载失败')
											})
								        }
										
								    },
									fail:(res)=>{
										console.log("res: ",res);
									}
								});
								
								downloadTask.onProgressUpdate((res) => {
									that.progress= res.progress;
								    // console.log('下载进度' + res.progress);
								    // console.log('已经下载的数据长度' + res.totalBytesWritten);
								    // console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
								
								    // // 测试条件，取消下载任务。
								    // if (res.progress > 10) {
								    //     downloadTask.abort();
								    // }
								});
							});

						} 
					}
				});
			},
			getname(e){
				return decodeURI(e);
			},
			init(){
				let that = this,data={
					live_id:that.live_id
				};
				that.$utils.request(
					"https://idzg.com/weixin/Live/livebroadcast",data,res=>{
						that.data=res.data[0];
						// 预播
						if(that.data.live_state==2){
							that.url=that.data.live_video;
						}else{
							that.url=that.data.live_url;
						}
						console.log(that.data);
						console.log(that.url);
					}
					
				);
			}
		}
	}
</script>

<style scoped>
.videobox{
	z-index: 9;
	height: 100%;
	width:100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
}
.video{
	width: 100%;
	height: 100%;
}
.top-view{
	height: 80rpx;
	position: fixed;
	left: 0;
	top:var(--status-bar-height);
	width: 330rpx;
	margin-left: 20rpx;
	border-radius: 40rpx;
	z-index: 99;
}
.top-view-bg{
	height: 80rpx;
	width: 330rpx;
	border-radius: 40rpx;
	background-color: #d8d8d8;
	opacity: 0.3;
}
.top-view-headimg{
	height: 66rpx;
	width: 66rpx;
	margin-left: 5rpx;
	position: absolute;
	left: 0;
	top: 5rpx;
	z-index: 99;
	border: 2rpx solid #fff;
	border-radius: 35rpx;
}
.top-view-title{
	width: 210rpx;
	font-size: 24rpx;
	color: #fff;
	position: absolute;
	left: 90rpx;
	top: 10rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	z-index: 99;
}
.top-view-info{
	width: 210rpx;
	font-size: 20rpx;
	color: #e5e5e5;
	position: absolute;
	left: 90rpx;
	bottom: 10rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	z-index: 99;
}
.right-view{
	height: 420rpx;
	width: 80rpx;
	position: fixed;
	right: 20rpx;
	bottom: 400rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	z-index: 9;
}
.right-view-item{
	height: 80rpx;
	width: 80rpx;
	position: relative;
}
.right-view-item-bg{
	background-color:#d8d8d8 ;
	opacity: 0.3;
	width: 80rpx;
	height: 80rpx;
	position: absolute;
	left: 0;
	top: 0;
	border-radius: 40rpx;
}
.right-view-item-img{
	margin: 10rpx;
	width: 60rpx;
	height: 60rpx;
	position: absolute;
	left: 0;
	top: 0;
	border-radius: 60rpx;
	z-index: 99;
}
.downloadView{
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 999;
	display: flex;
	justify-content: center;
	align-items: center;
}
.downloadView-bg{
	width: 100%;
	height: 100%;
	position: absolute;
	background-color: #565656;
	opacity: 0.9;
}
.downloadView-body{
	background-color: #fff;
	width: 500rpx;
	height: 200rpx;
	z-index: 9999;
	border-radius: 5rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
}
.img{
	width: 750rpx;
	height: 1500rpx;
}
</style>
