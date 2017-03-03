//小矩阵，并且变成二维数组
var smallArr = [];
for(var i = 0; i < 3; i++){
	smallArr[i] = new Array();
}

var container = document.getElementById("container");

var centerMatrix = createSmallMatrix(smallArr.slice(0));

var largeMatrix = createLargeMatrix(centerMatrix);

function createLargeMatrix(centerMatrix){
	var matrixRD = convertMatrix(centerMatrix,"RD"); 
	var matrixR = convertMatrix(centerMatrix,"R");
	var matrixRU = convertMatrix(centerMatrix,"RU");
	var matrixU = convertMatrix(centerMatrix,"U");
	var matrixD = convertMatrix(centerMatrix,"D");
	var matrixLD = convertMatrix(centerMatrix,"LD");
	var matrixL = convertMatrix(centerMatrix,"L");
	var matrixLU = convertMatrix(centerMatrix,"LU");

	//可以在四个中选择一个来return；有四种排列方法
	var largeMatrix = [matrixRU,matrixR,matrixRD,matrixU,centerMatrix,matrixD,matrixLU,matrixL,matrixLD];
	// var largeMatrix = [matrixLU,matrixL,matrixLD,matrixU,centerMatrix,matrixD,matrixRU,matrixR,matrixRD];
	// var largeMatrix = [matrixLD,matrixL,matrixLD,matrixD,centerMatrix,matrixU,matrixRD,matrixR,matrixRU];
	// var largeMatrix = [matrixRD,matrixR,matrixRD,matrixD,centerMatrix,matrixU,matrixLD,matrixL,matrixLU];
	return largeMatrix;
}

function getRandomIndex(){
	return Math.floor(Math.random()*9);
}

//生成一个小矩阵
function createSmallMatrix(arr){
	var currentNum = {};
	var tmp;

	for(var i = 0; i < 3; i++){
		for(var j = 0; j < 3; j++){
			do{
				tmp = getRandomIndex();
			}while(currentNum[tmp]);
			currentNum[tmp] = true;
			arr[i][j] = tmp+1;
		}
	}
	return arr;
}

/**
 * [convertMatrix 根据中间的小矩阵转换]
 * @param  {[type]} oMatrix   [原始矩阵]
 * @param  {[type]} direction [方向：字符代替吧;大写]
 * @return {[type]}           [新矩阵]
 */
function convertMatrix(oMatrix,direction){
	var tMatrix = oMatrix;
	var result;
	var newArr = [];
	for(var i = 0; i < 3; i++){
		newArr[i] = new Array();
	}
	switch(direction){
		case 'R': result = cRight(tMatrix,newArr.slice(0));break;
		case 'L': result = cLeft(tMatrix,newArr.slice(0));break;
		case 'U': result = cUp(tMatrix,newArr.slice(0));break;
		case 'D': result = cDown(tMatrix,newArr.slice(0));break;
		case 'LU': result = cLeft(cUp(tMatrix,newArr.slice(0)),newArr.slice(0));break;
		case 'RU': result = cRight(cUp(tMatrix,newArr.slice(0)),newArr.slice(0));break;
		case 'LD': result = cLeft(cDown(tMatrix,newArr.slice(0)),newArr.slice(0));break;
		case 'RD': result = cRight(cDown(tMatrix,newArr.slice(0)),newArr.slice(0));break;
		default: result = "no such derection!!!!";
	}
	return result;
}


function cDown(oMatrix,newArr){
	newArr[0] = oMatrix[2];
	newArr[1] = oMatrix[0];
	newArr[2] = oMatrix[1];
	return newArr;
}

function cUp(oMatrix,newArr){
	newArr[0] = oMatrix[1];
	newArr[1] = oMatrix[2];
	newArr[2] = oMatrix[0];
	return newArr;
}
function cRight(oMatrix,newArr){
	for(var i = 0; i < 3; i++){
		newArr[i][0] = oMatrix[i][1];
		newArr[i][1] = oMatrix[i][2];
		newArr[i][2] = oMatrix[i][0];
	}
	return newArr;
}
function cLeft(oMatrix,newArr){
	for(var i = 0; i < 3; i++){
		newArr[i][0] = oMatrix[i][2];
		newArr[i][1] = oMatrix[i][0];
		newArr[i][2] = oMatrix[i][1];
	}
	return newArr;
}

var answer = document.getElementById('answer');

function render(largeMatrix,target,answer){
	var smallMatrixs = target.children;
	var answerMatrixs = answer.children;

	for(var i = 0, len = smallMatrixs.length; i < len ; i ++){
		var tmpStr = "",answerStr = "";
		for(var j = 0; j < 3; j++){
			for(var k = 0; k < 3; k++){
				answerStr += '<div class="cell">'+largeMatrix[i][j][k]+'</div>';
				if(getRandomIndex() > 5){
					tmpStr += '<div class="cell">'+largeMatrix[i][j][k]+'</div>';
				}else{
					tmpStr += '<div class="cell input" contenteditable="true"></div>'
				}
			}
		}
		smallMatrixs[i].innerHTML = tmpStr;
		answerMatrixs[i].innerHTML = answerStr;
	}
}


render(largeMatrix,container,answer);
