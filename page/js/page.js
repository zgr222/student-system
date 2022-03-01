// jquery扩展组件
$.fn.extend({
	page: function (options) {
		new Page(options, this).init();
	}
});

function Page(options, wrap) {
	this.wrap = wrap;   //放置分页组件的容器
	this.cn = options.cn || 1;  //当前选中的页码
	this.tn = options.tn || 1;  //总页码
	this.mn = options.mn || 1;  //最大显示的分页数量（超过显示省略号）
	this.callBack = options.callBack || function () { }
}

Page.prototype.init = function () {
	//1、创建页码结构
	this.creatDom();

	//2、绑定事件
	this.bindEvent();
}

Page.prototype.creatDom = function () {
	this.wrap.html('');	//清空已有的内容
	this.pageWrap = $('<ul id="myPage"></ul>');     //分页的父级
	this.prev = $('<li class="btn prev">&lt;</li>');    //上一页
	this.next = $('<li class="btn next">&gt;</li>');    //下一页
	this.center = '';   //中间部分

	var ellipsis = '<li class="ellipsis">...</li>';

	if (this.tn < this.mn) {	  //总页码数<要渲染的页码数，全部渲染出来，不需要省略号
		// < 1 2 3 >
		this.center = this.createLi(1, this.tn);
	} else {
		//出省略号，三种情况
		//省略号在右边	< 1 2 3 ... 20 >
		//省略号在左边	< 1 ... 17 18 19 20 >
		//省略号在两边	< 1 ... 1 2 3 4 5 ... 20 >
		if (this.cn < 3) {
			//省略号在右边	< 1 2 3 ... 20 >
			this.center = this.createLi(1, 3) + ellipsis + `<li>${this.tn}</li>`;
		} else if (this.cn > this.tn - 3) {
			//省略号在左边	< 1 ... 17 18 19 20 >
			this.center = `<li>1</li>` + ellipsis + this.createLi(this.tn - 3, this.tn);
		} else {
			//省略号在两边	< 1 ... 1 2 3 4 5 ... 20 >
			this.center = `<li>1</li>` + ellipsis + this.createLi(this.cn - 2, this.cn + 2)
				+ ellipsis + `<li>${this.tn}</li>`;
		}
	}

	//添加到页面
	this.pageWrap
		.append(this.prev)
		.append(this.center)
		.append(this.next)
		.appendTo(this.wrap);

}

Page.prototype.createLi = function (start, end) {
	var result = '';
	for (var i = start; i <= end; i++) {
		if (i === this.cn) {
			result += `<li class="active">${i}</li>`;
		} else {
			result += `<li>${i}</li>`;
		}
	}
	return result;
}

Page.prototype.bindEvent = function () {
	var This = this;
	//上一页
	this.prev.click(function () {
		This.cn--;
		if (This.cn <= 0) {
			This.cn = 1;
			alert('当前已经是第一页了');
			return;
		}
		This.init();
		This.callBack(This.cn);
	});

	//下一页
	this.next.click(function () {
		This.cn++;
		if (This.cn > This.tn) {
			This.cn = This.tn;
			alert('当前已经是最后一页了');
			return;
		}
		This.init();
		This.callBack(This.cn);
	});

	// 页码点击
	$('#myPage li:not(.btn):not(.ellipsis)').click(function () {
		This.cn = parseInt($(this).text());
		This.init();
		This.callBack(This.cn);
	})
}