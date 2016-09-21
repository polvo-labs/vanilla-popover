(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vanillaPopover = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var offset = require('bloody-offset')

function popover () {
  var popovers = [].slice.apply(document.querySelectorAll('.popover'))

  popovers.forEach(function (el) {
    var elHeight = parseInt(window.getComputedStyle(el).height)
    var elWidth = parseInt(window.getComputedStyle(el).width)
    var elLabel = el.parentNode

    var labelWidth = parseInt(window.getComputedStyle(elLabel).width)

    var labelTop = offset(elLabel).top
    var labelLeft = offset(elLabel).left
    var labelRight = (labelLeft + labelWidth) - elWidth

    var w = window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth

    var gridLine = w / 2

    el.style.top = labelTop - elHeight + 'px'

    if (labelLeft >= gridLine) {
      el.style.left = labelRight + 'px'
    } else {
      el.style.left = labelLeft + 'px'
    }
  })
}

popover()

},{"bloody-offset":2}],2:[function(require,module,exports){
function getScrolled(){
  var top = window.pageYOffset
  if(typeof top == "number") {
    return {
      top : top,
      left : window.pageXOffset
    }
  }
  return {
    top : document.documentElement.scrollTop,
    left : document.documentElement.scrollLeft
  }
}

function toInt(number){
  return parseInt(number, 10)
}

module.exports = function(element){
  var clientRect = element.getBoundingClientRect()
  var scrolled = getScrolled()
  return {
    top : toInt(clientRect.top + scrolled.top),
    left : toInt(clientRect.left + scrolled.left),
    width : toInt(clientRect.right - clientRect.left),
    height : toInt(clientRect.bottom - clientRect.top)
  }
}

},{}]},{},[1])(1)
});