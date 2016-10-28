var socketclientjs =  (function(document) {



var msgBox = document.getElementById('msg');
var $obj = $("#one");
var timer;
var isPress = false;


function init(){
	//按键盘移动
	// $(window).on('keydown', function(e) {
	// 	var leftCss = parseInt($obj.css('left'));
	// 	var topCss = parseInt($obj.css('top'));
	// 	switch (e.keyCode) {
	// 		case 37: leftCss -= 10;break;	//left
	// 		case 38: topCss -= 10;break;	//up
	// 		case 39: leftCss += 10;break;	//right
	// 		case 40: topCss += 10;break;	//down
	// 		default: null;
	// 	}
		
	// 	socket.emit('position', {id: $obj.attr('id'), left: leftCss, top: topCss});
	// })

	var socket = io.connect(ip);

	socket.on('connect', function(res) {
		msgBox.innerHTML = 'connected...';

	})	

	socket.on('setPos', function(res) {
		console.log('setPos', res);
		msgBox.innerHTML = '' + res.left +" "+ res.top +" "+ res.id;
		if(isPress) return;
		$('#'+res.id).css({
			top: res.top,
			left: res.left
		})
	})



	// drag(document.getElementById('one'), socket);
	// drag(document.getElementById('two'), socket);

	return socket;
}


//可以让dom可拖动的函数，socket
function drag(obj, socket) {
	var $obj = $(obj);
	var relateX = 0;	//鼠标相对方块位置
	var relateY = 0;
	var mouseDownX = 0;	//鼠标按下的位置
	var mouseDownY = 0; 
	$obj.on('mousedown', function(e) {
		relateX = e.clientX - obj.offsetLeft;
		relateY = e.clientY - obj.offsetTop;
		mouseDownX = e.clientX;
		mouseDownY = e.clientY;
		isPress = true;
	});

	$obj.on('touchstart', function(e) {
		relateX = e.originalEvent.targetTouches[0].clientX - obj.offsetLeft;
		relateY = e.originalEvent.targetTouches[0].clientY - obj.offsetTop;
		mouseDownX = e.clientX;
		mouseDownY = e.clientY;
		isPress = true;
	});

	$obj.on('mouseup touchend mouseout touchout', function(e) {
		if(!relateY || !relateX) return;
		relateY = relateX = 0;
		isPress = false;

	});

	$obj.on('mousemove', function(e) {
		if(!relateX || !relateY) return;

		//获取位置并发送
		var leftCss = parseInt($obj.css('left'));
		var topCss = parseInt($obj.css('top'));
		socket.emit('position', {id: $obj.attr('id'), left: leftCss, top: topCss});
		
		//当前鼠标的位置减去相对位置
		obj.style.left = e.clientX - relateX  + 'px';
		obj.style.top = e.clientY - relateY  + 'px';
	});

	$obj.on('touchmove', function(e) {
		if(!relateX || !relateY) return;

		//获取位置并发送
		var leftCss = parseInt($obj.css('left'));
		var topCss = parseInt($obj.css('top'));
		socket.emit('position', {id: $obj.attr('id'), left: leftCss, top: topCss});

		//当前鼠标的位置减去相对位置
		obj.style.left = e.originalEvent.targetTouches[0].clientX - relateX  + 'px';
		obj.style.top = e.originalEvent.targetTouches[0].clientY - relateY  + 'px';
	});

	return obj;

}


return {
	init: init,
}

})(document);

