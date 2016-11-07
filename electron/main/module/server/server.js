/**
 * [start 挂载服务器，代码网上抄的]
 * @param  {[type]} conf [description]
 * @return {[type]}      [description]
 */
function start(conf){
    var PORT = 9527;

    var http = require('http');
    var url=require('url');
    var fs=require('fs');
    var mine=require('./js/mine').types;
    var path=require('path');

    var server = http.createServer(function (request, response) {

        var pathname = url.parse(request.url).pathname == '/' ? '/index.html' : url.parse(request.url).pathname;
        var realPath = path.join("E:/work/work-demo/demo/src", pathname);
        var ext = path.extname(realPath);
        ext = ext ? ext.slice(1) : 'unknown';
        fs.exists(realPath, function (exists) {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            } else {
                fs.readFile(realPath, "binary", function (err, file) {
                    if (err) {
                        response.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        response.end(err);
                    } else {
                        var contentType = mine[ext] || "text/plain";
                        response.writeHead(200, {
                            'Content-Type': contentType
                        });
                        response.write(file, "binary");
                        response.end();
                    }
                });
            }
        });
    });
    server.listen(PORT);
    console.log("Server runing at port: " + PORT + ".");
}

exports.start = start;