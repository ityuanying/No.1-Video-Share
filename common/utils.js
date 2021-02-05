
const utils = {

	saveHeadImgFile(img) { // base64 保存系统相册
	    let base64 = img;
	    const bitmap = new plus.nativeObj.Bitmap("test");
	    bitmap.loadBase64Data(base64, function() {
	        const url = "_doc/" + new Date().getTime() + ".png";  // url为时间戳命名方式
	        console.log('saveHeadImgFile', url)
	        bitmap.save(url, {
	            overwrite: true,  // 是否覆盖
	            // quality: 'quality'  // 图片清晰度
	        }, (i) => {
	            uni.saveImageToPhotosAlbum({
	                filePath: url,
	                success: function() {
	                    uni.showToast({
	                        title: '图片保存成功',
	                        icon: 'none'
	                    })
	                    bitmap.clear()
	                }
	            });
	        }, (e) => {
	            uni.showToast({
	                title: '图片保存失败',
	                icon: 'none'
	            })
	            bitmap.clear()
	        });
	    }, (e) => {
	        uni.showToast({
	            title: '图片保存失败',
	            icon: 'none'
	        })
	        bitmap.clear()
	    });
	},
	
	// 简单字符对称加密算法
	encryption(str){
		// 随机生成0-9的一个数
		let CodeKey= parseInt(Math.random()*100)%10;
		// 生成key
		let CodeKeyStr='';
		for( let i=CodeKey+97;i<CodeKey+107;i++){
			CodeKeyStr+=String.fromCodePoint(i)
		}
		let res='';
		res+=String.fromCodePoint(CodeKey+97);
		for ( let i = 0;i<str.length;i++){
			res+=CodeKeyStr[str[i]];
		}
		return res;
	},
	// 简单字符对称解密算法
	decrypt(str){
		// 加解密算法key
		let CodeKey=str[0].charCodeAt();
		let CodeKeyStr='';
		for( let i=CodeKey;i<CodeKey+10;i++){
			CodeKeyStr+=String.fromCodePoint(i)
		};
		let res='';
		for(let i=1;i<str.length;i++){
			for(let j=0;j<CodeKeyStr.length;j++){
				if(str[i]==CodeKeyStr[j]){
					res+=j.toString();
					break;
				}
			}
		}
		return res;
	},
	

	// 更改富文本图片显示
	formatRichText(html) {
		let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
			match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
			match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
			match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
			return match;
		});
		newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
			match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
			return match;
		});
		newContent = newContent.replace(/<br[^>]*\/>/gi, '');
		newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;"');
		return newContent;
	},
	// 距现在时间
	timeFromNow(dateString) {
		dateString = parseInt(dateString) * 1000;
		let date = new Date(dateString).getTime();
		let currentDate = new Date().getTime();
		let spaceTime = Math.abs(currentDate - date) / 1000;
		if (spaceTime < 60) {
			return '刚刚';
		}
		if (spaceTime < 3600) {
			let time = parseInt(spaceTime / 60)
			return time + '分钟前';

		} else if (spaceTime < 86400) {
			let time = parseInt(spaceTime / 60 / 60);
			return time + '小时前';
		} else if (spaceTime < 172800) {
			let time = parseInt(spaceTime / 60 / 60 / 24);
			return '昨天';
		} else {
			let time = parseInt(spaceTime / 60 / 60 / 24);
			return time + '天前';
		}
	},                                                                                                                                                                                                                                                      
	// 时间戳转化为标准时间
	getLocalTime(nS) {
		var date = new Date(parseInt(nS) * 1000);
		var year = date.getFullYear();
		var mon = date.getMonth() + 1;
		var day = date.getDate();
		var hours = date.getHours();
		var minu = date.getMinutes();
		var sec = date.getSeconds();

		return year + '.' + mon + '.' + day + ' ' + hours + ':' + minu ;//+ ':' + sec
	},

	// 商品价格转化为保留小数点两位形式
	getprice(e) {
		e = parseInt(e);
		let re = parseInt(e / 100).toString() + '.' + (e % 100 == 0 ? "00" : e % 100);
		return re;
	},

	// 成功弹窗
	showSuccess: function(msg, callback) {
		uni.showToast({
			title: msg,
			icon: 'success',
			mask: true,
			duration: 1500,
			success: function() {
				callback && (setTimeout(function() {
					callback();
				}, 1500));
			}
		})
	},
	//判空
	isNotEmpty(ele) {
		if (typeof ele === 'undefined') { //先判断类型
			return false;
		} else if (ele == null) {
			return false;
		} else if (ele == '') {
			return false;
		}
		return true;
	},
	// 返回e页
	back(e) {
		uni.navigateBack({
			delta: e*-1
		})
	},

	//跳转页面
	topage(url) {
		if (url == "/pages/index/index" || url == "/pages/my/my") {
			uni.switchTab({
				url: url
			})
		} else
			uni.navigateTo({
				url: url
			})
	},

	tips(str, duration) {
		uni.showToast({
			title: str,
			icon: "none",
			duration: duration ? duration : 1000
		})
	},
	
	validateLogon() {
		let res = uni.getStorageSync("userdata");
		if (this.isNotEmpty(res)) {
			return res;
		} else {
			return false;
		}
	},

	
	//请求
	request(url, Data, success, fail, complete) {
		let that = this;
		uni.request({
			url: url,
			data: Data,
			method:"GET",
			header:{
				'content-type': 'application/x-www-form-urlencoded',
			},
			success(res) {
				if (res.statusCode != 200) {
					uni.showToast({
						title: 'error',
						icon: 'none',
						duration: 2000
					})
				}
				if(res.data.code!=200){
					uni.showToast({
						title: res.data.message,
						icon: 'none',
						duration: 2000
					})
					console.log("出错接口->"+url);
				}
				success && success(res.data);
				if(res.data.code==-2){
					that.$utils.topage('/pages/login/login');
				}
			},
			fail(res) {
				console.log(res);
				uni.showToast({
					title: '请求超时，请检查网络!',
					icon: 'none',
					duration: 2000
				})
				fail && fail(res.data);
			},
			complete(res) {
				uni.hideLoading();
				complete && complete(res.data);
			},
		})
	},
	request_post(url, Data, success, fail, complete) {
		let that = this;
		uni.request({
			url: url,
			data: Data,
			method:"POST",
			header:{
				'content-type': 'application/x-www-form-urlencoded',
			},
			success(res) {
				if (res.statusCode != 200) {
					uni.showToast({
						title: 'error',
						icon: 'none',
						duration: 2000
					})
				}
				if(res.data.code!=200){
					uni.showToast({
						title: res.data.message,
						icon: 'none',
						duration: 2000
					})
					console.log("出错接口->"+url);
				}
				success && success(res.data);
				if(res.data.code==-2){
					that.$utils.topage('/pages/login/login');
				}
			},
			fail(res) {
				console.log(res);
				uni.showToast({
					title: '请求超时，请检查网络!',
					icon: 'none',
					duration: 2000
				})
				fail && fail(res.data);
			},
			complete(res) {
				uni.hideLoading();
				complete && complete(res.data);
			},
		})
	},
	async getuserdata(){
		let that = this;
		await uni.request({
			url: that.APIRoot+"/api/user/getUserInfo",
			data: {
				openid:uni.getStorageSync('openid')
			},
			method:"GET",
			success(res){
				res=res.data;
				console.log(res.data);
				if(res.code==0){
					uni.setStorageSync('userdata',res.data);
					uni.setStorageSync('openid',res.data.openid);
				}
			}
		});
	},
	// 支付
	pay(provider, orderInfo, success, fail, complete) {
		let that = this;
		uni.requestPayment({
			provider: provider,
			orderInfo: orderInfo, //微信、支付宝订单数据 
			success(res) {
				console.log(res);
				uni.showToast({
					title: '支付成功',
					icon: 'none',
					duration: 2000
				});
				success && success(res.data);
			},
			fail(err) {
				console.log(err);
				uni.showToast({
					title: '支付失败',
					icon: 'none',
					duration: 2000
				});
				fail && fail(res.data);
			},
			complete(res) {
				complete && complete(res.data);
			},
		});
	},
	// 获取对象个数
	getObjCnt(obj) {
		var count = 0;
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) { // 建议加上判断,如果没有扩展对象属性可以不加
				count++;
			}
		}
		return count;
	}

};

export default utils
