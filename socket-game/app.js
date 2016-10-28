/**
 * authod: weijianghong
 * reorganize at: 2016-10-28
 * discription: entry of the socket-game, it will start two server. 
 */

"use strict"

let localServer = require('./entry/server.js');
let socketServer = require('./entry/server/server.js');

localServer.start();	//本地服务器。用于让多个终端访问首页。默认端口3000；
socketServer.start();	//socket服务器。首页文件的服务器配置需要指向这个服务器。默认端口3001