<template>
	<view class="page">
		<view class="statusBar"></view>
		<view v-if="time<1612571400">
			<image src="../../static/A.jpg" class="img"></image>
			<image src="../../static/B.jpg" class="img"></image>
			<image src="../../static/C.jpg" class="img"></image>
		</view>
		<view v-else>
			<view class="top-view">
				<image src="../../static/icon/search.png" class="top-view-left" mode=""></image>
				<input type="text" class="top-view-right" placeholder="请输入关键字" placeholder-style="color:##9e9e9e;" v-model="searchText" @input="input">
			</view>
			<view class="listview" v-if="$utils.isNotEmpty(list)">
				<view class="videobox" v-for="(item,i ) in list" :key="i" @click="topage(item)" v-if="item.live_state!=0">
					<image :src="item.live_image" class="videobox-bg" mode=""></image>
					<view class="videobox-toptext" v-if="item.live_state==3">
						直播回放
					</view>
					<view class="videobox-toptext" v-if="item.live_state==2">
						预播
					</view>
					<view class="videobox-toptext" v-if="item.live_state==4">
						录播
					</view>
					<image :src="item.tx_img" class="videobox-head"  mode=""></image>
					<view class="videobox-title">
						{{ getname(item.user_name)}}
					</view>
					<view class="videobox-info">
						{{item.live_name}}
					</view>
					<view class="videobox-num">
						{{item.online_num}}
					</view>
				</view>
				
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText:'',
				page:1,
				endflag:false,
				list:[],
				statusBarHeight:0,
				screenHeight:0,
				time:0
			}
		},
		onLoad() {
			this.time=Date.parse(new Date())/1000;
			//获取系统状态栏高度
			let that = this;
			uni.getSystemInfo({
			    success: function (res) {
			        that.statusBarHeight=res.statusBarHeight;
					that.screenHeight=res.screenHeight;
			    }
			});
			this.loadmore();
		},
		onHide() {
			uni.hideLoading();
		},
		onReachBottom(){
			if(this.searchText==''){
				this.loadmore();
			}
		},
		methods: {
			input(){
				this.page=1;
				this.endflag=false;
				this.list=[];
				if(this.searchText==''){
					this.loadmore();
				}else{
					this.search();
				}
			},
			topage(e){
				this.$utils.topage("/pages/info/info"+'?id='+e.live_id);
			},
			getname(e){
				return decodeURI(e);
			},
			loadmore(){
				let that = this;
				if(that.endflag){
					that.$utils.tips("到底了...");
				}else{
					uni.showLoading({
						title:"加载中...",
						icon:"load"
					});
					let data={
						page:that.page++,
						pageSize:10
					};
					that.$utils.request(
						"https://idzg.com/weixin/Live/getLiveList",data,res=>{
							console.log(res);
							if(res.code==200){
								if(that.$utils.isNotEmpty(res.data)){
									that.list=that.list.concat(res.data);
								}
								if(res.data.length<10){
									that.endflag=true;
								}
							}else{
								that.$utils.tips(res.message);
							}
							uni.hideLoading();
							
						}
						
					);
				}
				
				
			},
			search(){
				let that = this;
				if(that.endflag){
					that.$utils.tips("到底了...");
				}else{
					uni.showLoading({
						title:"加载中...",
						icon:"load"
					});
					that.$utils.request(
						"https://idzg.com/weixin/Live/LiveSearch",
						{
							live_name:that.searchText
						},res=>{
							console.log(res);
							if(res.code==200){
								that.list=res.data;
								that.endflag=true;
							}else{
								that.$utils.tips(res.message);
							}
							uni.hideLoading();
							
						}
						
					);
				}
				
				
			}
			
		}
	}
</script>

<style scoped>
.page{
	padding-bottom: 50rpx;
}
.top-view{
	width: 690rpx;
	margin-left: 30rpx;
	margin-right: 30rpx;
	height: 100rpx;
	background-color: rgb(68,68,68);
	border-radius: 14rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}
.top-view-left{
	height: 45rpx;
	width: 45rpx;
	margin-left: 25rpx;
}
.top-view-right{
	margin-left: 30rpx;
	flex: 1;
	font-size: 24rpx;
	color: #9e9e9e;
}
.listview{
	width: 730rpx;
	margin-left: 10rpx;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
}
.videobox{
	width: 360rpx;
	height: 460rpx;
	margin-top: 10rpx;
	position: relative;
}
.videobox-bg{
	width: 360rpx;
	height: 460rpx;
	position: absolute;
}
.videobox-toptext{
	position: absolute;
	left: 22rpx;
	top: 22rpx;
	font-size: 24rpx;
	padding: 10rpx;
	border-radius: 10rpx;
	background-color: rgb(171,171,171);
	color: #fff;
	opacity: 0.7;
	z-index: 1;
}
.videobox-head{
	width: 50rpx;
	height: 50rpx;
	border-radius: 50rpx;
	border: 2rpx solid #3a3a3a;
	z-index: 2;
	position: absolute;
	left: 16rpx; 
	bottom: 60rpx;
}
.videobox-title{
	height: 50rpx;
	line-height: 50rpx;
	font-size: 24rpx;
	max-width: 270rpx;
	overflow: hidden;
	text-overflow:ellipsis; 
	white-space: nowrap;
	z-index: 2;
	position: absolute;
	left: 90rpx; 
	bottom: 60rpx;
	color: #fff;
}
.videobox-info{
	height: 50rpx;
	line-height: 50rpx;
	font-size: 24rpx;
	max-width: 270rpx;
	overflow: hidden;
	text-overflow:ellipsis; 
	white-space: nowrap;
	z-index: 2;
	position: absolute;
	left: 20rpx; 
	bottom: 10rpx;
	color: #fff;
}
.videobox-num{
	font-size: 20rpx;
	color: #fff;
	position: absolute;
	right: 16rpx; 
	bottom: 20rpx;
}
.img{
	width: 750rpx;
	height: 1500rpx;
}
</style>
