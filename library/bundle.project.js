require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"HomeUIScript":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cd1e4rdkaxIjKCfUg2QCvZH', 'HomeUIScript');
// Script/HomeUIScript.js

cc.Class({
    "extends": cc.Component,

    properties: {
        bgDisplay: {
            type: cc.Node,
            "default": null
        }
    },

    configDisplay: function configDisplay() {
        var sizesc = cc.director.getVisibleSize();
        if (sizesc.height > 800) {
            this.bgDisplay.scaleY = sizesc.height / 800;
            cc.log("---------size: %s %s %s", JSON.stringify(sizesc), sizesc.width, sizesc.height);
        }
    },
    // use this for initialization
    onLoad: function onLoad() {
        this.configDisplay();
    },

    actionShare: function actionShare() {},
    actionRate: function actionRate() {},
    actionAddMore: function actionAddMore() {},
    actionSettings: function actionSettings() {},
    actionBuyAll: function actionBuyAll() {}

});

cc._RFpop();
},{}]},{},["HomeUIScript"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9Ib21lVUlTY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjZDFlNHJka2F4SWpLQ2ZVZzJRQ3ZaSCcsICdIb21lVUlTY3JpcHQnKTtcbi8vIFNjcmlwdC9Ib21lVUlTY3JpcHQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGJnRGlzcGxheToge1xuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29uZmlnRGlzcGxheTogZnVuY3Rpb24gY29uZmlnRGlzcGxheSgpIHtcbiAgICAgICAgdmFyIHNpemVzYyA9IGNjLmRpcmVjdG9yLmdldFZpc2libGVTaXplKCk7XG4gICAgICAgIGlmIChzaXplc2MuaGVpZ2h0ID4gODAwKSB7XG4gICAgICAgICAgICB0aGlzLmJnRGlzcGxheS5zY2FsZVkgPSBzaXplc2MuaGVpZ2h0IC8gODAwO1xuICAgICAgICAgICAgY2MubG9nKFwiLS0tLS0tLS0tc2l6ZTogJXMgJXMgJXNcIiwgSlNPTi5zdHJpbmdpZnkoc2l6ZXNjKSwgc2l6ZXNjLndpZHRoLCBzaXplc2MuaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuY29uZmlnRGlzcGxheSgpO1xuICAgIH0sXG5cbiAgICBhY3Rpb25TaGFyZTogZnVuY3Rpb24gYWN0aW9uU2hhcmUoKSB7fSxcbiAgICBhY3Rpb25SYXRlOiBmdW5jdGlvbiBhY3Rpb25SYXRlKCkge30sXG4gICAgYWN0aW9uQWRkTW9yZTogZnVuY3Rpb24gYWN0aW9uQWRkTW9yZSgpIHt9LFxuICAgIGFjdGlvblNldHRpbmdzOiBmdW5jdGlvbiBhY3Rpb25TZXR0aW5ncygpIHt9LFxuICAgIGFjdGlvbkJ1eUFsbDogZnVuY3Rpb24gYWN0aW9uQnV5QWxsKCkge31cblxufSk7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
