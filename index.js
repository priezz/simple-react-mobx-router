Object.defineProperty(exports,"__esModule",{value:true});exports.default=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _dec,_dec2,_dec3,_desc,_value,_class,_descriptor,_descriptor2,_descriptor3,_descriptor4;var _react=require('react');var _react2=_interopRequireDefault(_react);
var _mobx=require('mobx');

var _routines=require('./routines');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _initDefineProp(target,property,descriptor,context){if(!descriptor)return;Object.defineProperty(target,property,{enumerable:descriptor.enumerable,configurable:descriptor.configurable,writable:descriptor.writable,value:descriptor.initializer?descriptor.initializer.call(context):void 0});}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _applyDecoratedDescriptor(target,property,decorators,descriptor,context){var desc={};Object['ke'+'ys'](descriptor).forEach(function(key){desc[key]=descriptor[key];});desc.enumerable=!!desc.enumerable;desc.configurable=!!desc.configurable;if('value'in desc||desc.initializer){desc.writable=true;}desc=decorators.slice().reverse().reduce(function(desc,decorator){return decorator(target,property,desc)||desc;},desc);if(context&&desc.initializer!==void 0){desc.value=desc.initializer?desc.initializer.call(context):void 0;desc.initializer=undefined;}if(desc.initializer===void 0){Object['define'+'Property'](target,property,desc);desc=null;}return desc;}function _initializerWarningHelper(descriptor,context){throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');}


(0,_mobx.useStrict)(true);var

Router=(_dec=





































(0,_mobx.action)('ROUTE_SET'),_dec2=





(0,_mobx.action)('ROUTE_SET-DEFAULT'),_dec3=





(0,_mobx.action)('ROUTE_BACK'),(_class=function Router(){var _this=this;var routesDefs=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var _ref=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{},defaultRoute=_ref.defaultRoute,defaultFallback=_ref.defaultFallback;_classCallCheck(this,Router);this._views={};this._history=[];_initDefineProp(this,'_currentRoute',_descriptor,this);this.getCurrentRoute=function(path){var current=_this._currentRoute.path;if(!path)return current;if(current.indexOf(path)===-1)return null;return current.replace(path,"").split("/").filter(function(p){return p;})[0];};_initDefineProp(this,'go',_descriptor2,this);_initDefineProp(this,'_setDefaultRoute',_descriptor3,this);_initDefineProp(this,'goBack',_descriptor4,this);this.








getView=function(path){var props=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var asComponent=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;


if(!path)return null;
var obj=(0,_routines.getDescendantProp)(_this._views,path,"/");

if(!obj||!obj.__component)return null;
var condition=obj.__condition;
var check=typeof condition==='function'?condition():true;


return check?
asComponent?
[obj.__component,_extends({},obj.__props,props)]:
_react2.default.createElement(obj.__component,_extends({},obj.__props,props)):

_this.getView(obj.__fallback||_this._defaultFallback,{_doNotTrack:true},asComponent);
};this.
getSubViews=function(path){

var routeDef=(0,_routines.getDescendantProp)(_this._views,path,"/");


return Object.keys(routeDef).
filter(function(key){return key.indexOf('__')!==0;}).
map(function(key){return _this.getView(
path+'/'+key,_extends({},
_this._currentRoute.props,routeDef[key].__props,{key:key}));});

};this.
getCurrentSubView=function(path){var props=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var asComponent=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;

var key=_this.getCurrentRoute(path,'Router/getCurrentSubView');

if(!key)return null;
return _this.getView(path+'/'+key,_extends({},_this._currentRoute.props,props),asComponent);
};var _loop=function _loop(path){var options=routesDefs[path];var _ref2=options||{},component=_ref2.component,_ref2$props=_ref2.props,props=_ref2$props===undefined?{}:_ref2$props,condition=_ref2.condition,fallback=_ref2.fallback;if(typeof options!=='object')component=options;if(!component||component===null)component=function component(){return _this.getCurrentSubView(path);};(0,_routines.setDescendantProp)(_this._views,'/'+path,{__component:component,__props:props,__condition:condition,__fallback:fallback},"/");};for(var path in routesDefs){_loop(path);}this._setDefaultRoute(defaultRoute||Object.keys(routesDefs)[0]);this._defaultFallback=defaultFallback;},(_descriptor=_applyDecoratedDescriptor(_class.prototype,'_currentRoute',[_mobx.observable],{enumerable:true,initializer:function initializer(){return{};}}),_descriptor2=_applyDecoratedDescriptor(_class.prototype,'go',[_dec],{enumerable:true,initializer:function initializer(){var _this2=this;return function(path,props){if(_this2._currentRoute.path===path&&(0,_routines.objectsEqual)(_this2._currentRoute.props,props))return;if(!_this2._currentRoute.props||!_this2._currentRoute.props._doNotTrack)_this2._history.push(_this2._currentRoute);_this2._currentRoute={path:path,props:props};};}}),_descriptor3=_applyDecoratedDescriptor(_class.prototype,'_setDefaultRoute',[_dec2],{enumerable:true,initializer:function initializer(){var _this3=this;return function(path,props){if(!path)return;_this3._defaultRoute=path;_this3._currentRoute={path:path,props:props};};}}),_descriptor4=_applyDecoratedDescriptor(_class.prototype,'goBack',[_dec3],{enumerable:true,initializer:function initializer(){var _this4=this;return function(){var changeTop=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;var initialTop=_this4.getCurrentRoute('/','Router/goBack');if(_this4._history.length)do{_this4._currentRoute=_this4._history[_this4._history.length-1];_this4._history.pop();}while(_this4._history.length&&changeTop&&_this4.getCurrentRoute('/','Router/goBack')===initialTop);return true;};}})),_class));exports.default=Router;