!function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return e[i].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";n(1)()},function(e,t,n){"use strict";var i=n(14),r=n(2);i.render(React.createElement(r,{name:"bobo"}),document.querySelector("#example"))},function(e,t,n){"use strict";var i=n(3),r=React.createClass({displayName:"HelloMessage",getInitialState:function(){return{isHidden:!0,title:"default title",board:"default display"}},handleClick:function(){this.setState({isHidden:!this.state.isHidden})},setMessage:function(e){this.setState({board:e})},getMessage:function(){return this.state.board},render:function(){var e=React.createElement("h1",{className:"header",key:"header"},this.state.title),t=React.createElement("button",{key:"button",onClick:this.handleClick},"Toggle header name");return this.state.isHidden?React.createElement("div",null,t,e,React.createElement(i,null)):React.createElement("div",null,t,e,React.createElement(i,null))}});e.exports=r},function(e,t,n){"use strict";var i=n(4),r=n(7),s=n(13),o=React.createClass({displayName:"MyButtonController",getInitialState:function(){return{items:i.getAll()}},componentDidMount:function(){i.addChangeListener(this._onchange)},componentWillUnmount:function(){i.removeChangeListener(this._onchange)},_onchange:function(){this.setState({items:i.getAll()})},createNewItem:function(e){r.addNewItem("new item")},render:function(){return React.createElement(s,{items:this.state.items,onClick:this.createNewItem})}});e.exports=o},function(e,t,n){"use strict";var i=n(5).EventEmitter,r=n(6),s=r({},i.prototype,{items:[],getAll:function(){return this.items},addNewItemHandler:function(e){this.items.push(e)},emitChange:function(){this.emit("change")},addChangeListener:function(e){this.on("change",e)},removeChangeListener:function(e){this.removeListener("change",e)}});e.exports=s},function(e,t){function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(e){return"function"==typeof e}function r(e){return"number"==typeof e}function s(e){return"object"==typeof e&&null!==e}function o(e){return void 0===e}e.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(e){if(!r(e)||e<0||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},n.prototype.emit=function(e){var t,n,r,a,c,l;if(this._events||(this._events={}),"error"===e&&(!this._events.error||s(this._events.error)&&!this._events.error.length)){if(t=arguments[1],t instanceof Error)throw t;var u=new Error('Uncaught, unspecified "error" event. ('+t+")");throw u.context=t,u}if(n=this._events[e],o(n))return!1;if(i(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:a=Array.prototype.slice.call(arguments,1),n.apply(this,a)}else if(s(n))for(a=Array.prototype.slice.call(arguments,1),l=n.slice(),r=l.length,c=0;c<r;c++)l[c].apply(this,a);return!0},n.prototype.addListener=function(e,t){var r;if(!i(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,i(t.listener)?t.listener:t),this._events[e]?s(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,s(this._events[e])&&!this._events[e].warned&&(r=o(this._maxListeners)?n.defaultMaxListeners:this._maxListeners,r&&r>0&&this._events[e].length>r&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())),this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(e,t){function n(){this.removeListener(e,n),r||(r=!0,t.apply(this,arguments))}if(!i(t))throw TypeError("listener must be a function");var r=!1;return n.listener=t,this.on(e,n),this},n.prototype.removeListener=function(e,t){var n,r,o,a;if(!i(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(n=this._events[e],o=n.length,r=-1,n===t||i(n.listener)&&n.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(s(n)){for(a=o;a-- >0;)if(n[a]===t||n[a].listener&&n[a].listener===t){r=a;break}if(r<0)return this;1===n.length?(n.length=0,delete this._events[e]):n.splice(r,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},n.prototype.removeAllListeners=function(e){var t,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[e],i(n))this.removeListener(e,n);else if(n)for(;n.length;)this.removeListener(e,n[n.length-1]);return delete this._events[e],this},n.prototype.listeners=function(e){var t;return t=this._events&&this._events[e]?i(this._events[e])?[this._events[e]]:this._events[e].slice():[]},n.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(i(t))return 1;if(t)return t.length}return 0},n.listenerCount=function(e,t){return e.listenerCount(t)}},function(e,t){"use strict";function n(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}function i(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;var i=Object.getOwnPropertyNames(t).map(function(e){return t[e]});if("0123456789"!==i.join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}var r=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable;e.exports=i()?Object.assign:function(e,t){for(var i,o,a=n(e),c=1;c<arguments.length;c++){i=Object(arguments[c]);for(var l in i)r.call(i,l)&&(a[l]=i[l]);if(Object.getOwnPropertySymbols){o=Object.getOwnPropertySymbols(i);for(var u=0;u<o.length;u++)s.call(i,o[u])&&(a[o[u]]=i[o[u]])}}return a}},function(e,t,n){"use strict";var i=n(8),r={addNewItem:function(e){i.dispatch({actionType:"ADD_NEW_ITEM",text:e})}};e.exports=r},function(e,t,n){"use strict";var i=n(9).Dispatcher,r=new i,s=n(4);r.register(function(e){switch(e.actionType){case"ADD_NEW_ITEM":s.addNewItemHandler(e.text),s.emitChange()}}),e.exports=r},function(e,t,n){e.exports.Dispatcher=n(10)},function(e,t,n){(function(i){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var s=n(12),o="ID_",a=function(){function e(){r(this,e),this._callbacks={},this._isDispatching=!1,this._isHandled={},this._isPending={},this._lastID=1}return e.prototype.register=function(e){var t=o+this._lastID++;return this._callbacks[t]=e,t},e.prototype.unregister=function(e){this._callbacks[e]?void 0:"production"!==i.env.NODE_ENV?s(!1,"Dispatcher.unregister(...): `%s` does not map to a registered callback.",e):s(!1),delete this._callbacks[e]},e.prototype.waitFor=function(e){this._isDispatching?void 0:"production"!==i.env.NODE_ENV?s(!1,"Dispatcher.waitFor(...): Must be invoked while dispatching."):s(!1);for(var t=0;t<e.length;t++){var n=e[t];this._isPending[n]?this._isHandled[n]?void 0:"production"!==i.env.NODE_ENV?s(!1,"Dispatcher.waitFor(...): Circular dependency detected while waiting for `%s`.",n):s(!1):(this._callbacks[n]?void 0:"production"!==i.env.NODE_ENV?s(!1,"Dispatcher.waitFor(...): `%s` does not map to a registered callback.",n):s(!1),this._invokeCallback(n))}},e.prototype.dispatch=function(e){this._isDispatching?"production"!==i.env.NODE_ENV?s(!1,"Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch."):s(!1):void 0,this._startDispatching(e);try{for(var t in this._callbacks)this._isPending[t]||this._invokeCallback(t)}finally{this._stopDispatching()}},e.prototype.isDispatching=function(){return this._isDispatching},e.prototype._invokeCallback=function(e){this._isPending[e]=!0,this._callbacks[e](this._pendingPayload),this._isHandled[e]=!0},e.prototype._startDispatching=function(e){for(var t in this._callbacks)this._isPending[t]=!1,this._isHandled[t]=!1;this._pendingPayload=e,this._isDispatching=!0},e.prototype._stopDispatching=function(){delete this._pendingPayload,this._isDispatching=!1},e}();e.exports=a}).call(t,n(11))},function(e,t){function n(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function r(e){if(u===setTimeout)return setTimeout(e,0);if((u===n||!u)&&setTimeout)return u=setTimeout,setTimeout(e,0);try{return u(e,0)}catch(t){try{return u.call(null,e,0)}catch(t){return u.call(this,e,0)}}}function s(e){if(h===clearTimeout)return clearTimeout(e);if((h===i||!h)&&clearTimeout)return h=clearTimeout,clearTimeout(e);try{return h(e)}catch(t){try{return h.call(null,e)}catch(t){return h.call(this,e)}}}function o(){v&&p&&(v=!1,p.length?d=p.concat(d):m=-1,d.length&&a())}function a(){if(!v){var e=r(o);v=!0;for(var t=d.length;t;){for(p=d,d=[];++m<t;)p&&p[m].run();m=-1,t=d.length}p=null,v=!1,s(e)}}function c(e,t){this.fun=e,this.array=t}function l(){}var u,h,f=e.exports={};!function(){try{u="function"==typeof setTimeout?setTimeout:n}catch(e){u=n}try{h="function"==typeof clearTimeout?clearTimeout:i}catch(e){h=i}}();var p,d=[],v=!1,m=-1;f.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];d.push(new c(e,t)),1!==d.length||v||r(a)},c.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=l,f.addListener=l,f.once=l,f.off=l,f.removeListener=l,f.removeAllListeners=l,f.emit=l,f.binding=function(e){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(e){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(e,t,n){(function(t){"use strict";var n=function(e,n,i,r,s,o,a,c){if("production"!==t.env.NODE_ENV&&void 0===n)throw new Error("invariant requires an error message argument");if(!e){var l;if(void 0===n)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var u=[i,r,s,o,a,c],h=0;l=new Error("Invariant Violation: "+n.replace(/%s/g,function(){return u[h++]}))}throw l.framesToPop=1,l}};e.exports=n}).call(t,n(11))},function(e,t){"use strict";var n=React.createClass({displayName:"MyButton",render:function(){var e=this.props.items;console.log(this.props);var t=e.map(function(e,t){return React.createElement("li",{key:t},e)});return React.createElement("div",null,React.createElement("h1",null,"MyButton"),React.createElement("ul",null,t),React.createElement("button",{onClick:this.props.onClick},"New Item"))}});e.exports=n},function(e,t,n){var i,r,s,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};!function(a){if("object"==o(t)&&"undefined"!=typeof e)e.exports=a(n(15));else{r=[n(15)],i=a,s="function"==typeof i?i.apply(t,r):i,!(void 0!==s&&(e.exports=s))}}(function(e){return e.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED})},function(e,t){e.exports=window.React}]);