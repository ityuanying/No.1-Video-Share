<script>
	export default {
		onLaunch: function() {
			
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	page{
		background-color: #000;
		min-height: 100%;
		width: 100%;
	}
	/*每个页面公共css */
	.statusBar {
		width: 750rpx;
		height: var(--status-bar-height);
		background-color: transparent;
	}
	.statusBar::after {
		content: '';
		height: var(--status-bar-height);
		width: 750rpx;
		position: fixed;
		left: 0;
		top: 0;
		/* background-color: #fff; */
		z-index: 99;
	}
</style>
