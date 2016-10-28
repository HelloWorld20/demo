var canvasjs = (function(document){
	

	var can = document.getElementById('can');
	var context = can.getContext('2d');
	var $can = $(can);
	var $clear = $('#clear');
	var canLeft = can.offsetLeft;
	var canTop = can.offsetTop;

	var msg = document.getElementById('msg');

	var isPenDown = false;
	context.lineWidth = lineWidth;	//画笔宽度

	var lastDot = {
		left: 0,
		top: 0
	}

	function draw(context,x,y){
		var lastX = lastDot.left;
		var lastY = lastDot.top;
		drawLine(context, x, y, lastX, lastY);
		lastDot.left = x;
		lastDot.top = y;
	}

	function drawLine(context, sx, sy, ex, ey){
		// context.beginPath();
		context.moveTo(sx, sy);
		context.lineTo(ex, ey);
		context.stroke();
		// context.closePath();
	}

	//节流函数，暂时不生效
	function throttle(fn,delay){
        var timer=null;
        return function(){
            clearTimeout(timer);
            timer=setTimeout(fn,delay);
        }
    }

	function send(socket, info){
		console.log('send draw')
		socket.emit('draw', info)
	}




	function clearCan(){
		context.clearRect(0, 0, $can.attr('width'), $can.attr('height'));
	}

	function init(socket) {
		$can.on('mousedown', function(e) {
			isPenDown = true;
			var pos = getPos(e);
			lastDot.left = pos.x;
			lastDot.top = pos.y;
		})

		setTimeout(function() {
			send(socket, 'bbb');
		}, 3000)

		$can.on('mouseup mouseout', function(e) {
			isPenDown = false;
		})

		$can.on('touchstart', function(e) {
			isPenDown = true;
			var pos = getPos(e);
			lastDot.left = pos.x;
			lastDot.top = pos.y;
		})

		$can.on('touchend', function(e) {
			isPenDown = false;
		})

		// drawLine(context,10,10,100,100);
		// setTimeout(function() {
		// 	drawLine(context,30,30,400,100);
		// }, 3000)

		$can.on('mousemove', function(e) {
			if(!isPenDown) return;
			var relatePos = getPos(e);
			throttle(send(socket, {src: can.toDataURL("image/png")}), 1000);
			send(socket, {src: can.toDataURL("image/png")})
			draw(context, relatePos.x, relatePos.y);
		})

		$can.on('touchmove', function(e) {
			if(!isPenDown) return;
			var relatePos = getPos(e);
			// throttle(send(socket, {src: can.toDataURL("image/png")}), 1000);
			send(socket, {src: can.toDataURL("image/png")})
			draw(context, relatePos.x, relatePos.y);
		})

		$clear.on('click', function() {
			clearCan();
		})


		socket.on('setPic', function(msg) {
			console.log(msg);
			var img = new Image();
			img.src = msg.src;
			context.drawImage(img, 0, 0, 700, 400);
		})
	}

	//传入相关鼠标、触摸事件，获取相对画布位置
	function getPos(eventObj) {
		return{
			x: (eventObj.clientX || eventObj.originalEvent.targetTouches[0].clientX) - canLeft,
			y: (eventObj.clientY || eventObj.originalEvent.targetTouches[0].clientY) - canTop
		}
	}

	// function getCutedImg(x, y, context){
	// 	var sideLen = 70;
	// 	var sx = x - sideLen,
	// 		sy = y - sideLen


	// 	return {
	// 		data: context.getImageData(sx, sy, sideLen*2, sideLen*2),
	// 		positon: {
	// 			sx: sx,
	// 			sy: sy,
	// 		}
	// 	}
	// }



	return {
		context: context,
		draw: draw,
		init: init
	}

})(document)

