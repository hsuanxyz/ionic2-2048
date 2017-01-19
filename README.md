# ionic2-2048
a 2048 game of ionic2

这是一个使用ionic2框架实现的2048小游戏。

#### 演示
![2048](https://github.com/HsuanXyz/hsuan.github.io/blob/master/assets/ionic2-2048/2048.gif?raw=true)

#### 已知问题
在浏览器环境下调试时，滑动事件并不能很好的触发，可能需要在页面上通过按钮控制

## 获取

***需要 `ionic` 和 `cordova` ***

`$ git clone https://github.com/HsuanXyz/ionic2-2048.git`

`$ npm install`

`$ ionic state reset --plugins`

`$ cordova plugin add cordova-sqlite-storage --save`
## 运行在浏览器
`$ ionic serve`

## 打包到移动平台
`$ ionic build android `

`$ ionic build ios`

## 我的环境
```
Cordova CLI: 6.4.0
Ionic Framework Version: 2.0.0-rc.4
Ionic CLI Version: 2.1.18
Ionic App Lib Version: 2.1.9
Ionic App Scripts Version: 0.0.47
OS: macOS Sierra
Node Version: v6.9.2
Xcode version: Xcode 8.2.1 Build version 8C1002
```
