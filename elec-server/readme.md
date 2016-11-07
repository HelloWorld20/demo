因为electron-package打包的坑，决定重新启动一个项目；主要思想是，electron只是用来启动一个服务器。把主要逻辑处理放到服务器上。electron-package打包只打包启动服务器部分。这样可以避免electron太复杂，导致打包失败。

main: 包含electron运行的东西
root：服务器根目录
app：前端部分
lib：依赖包