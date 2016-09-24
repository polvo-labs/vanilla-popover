var offset = require('bloody-offset')
var assign = require('lodash/assign')
var isElement = require('lodash/isElement')
var supplant = require('small-supplant')

supplant.delimiters = ['{', '}']

module.exports = Popover

Popover.defaults = {
  customClass: 'vanilla-popover',
  content: '',
  template: '<div class="{customClass} {effect}-before">{content}</div>',
  effect: 'basic'
}

function Popover (container, options) {
  if (!isElement(container)) {
    container = document.querySelectorAll(container)
    container = [].slice.apply(container)
    return container.map(function (el) {
      return new Popover(el, options)
    })
  }

  this.options = assign({}, Popover.defaults, options)
  this.container = this.getElement(container)
  this.options.content = this.getContent()
  this.createPopover()
  this.setPosition()
  this.addEvents()
}

var fn = Popover.prototype

fn.getElement = function (el) {
  if (isElement(el)) { return el }
  return document.querySelector(el)
}

fn.getContent = function () {
  if (this.options.content) { return this.options.content }
  return this.container.getAttribute('data-popover')
}

fn.createPopover = function () {
  var div = document.createElement('div')
  div.innerHTML = supplant(this.options.template, this.options)
  this.popover = div.children[0]
  document.body.appendChild(this.popover)
  this.popoverWidth = window.getComputedStyle(this.popover).width
  this.popoverHeight = window.getComputedStyle(this.popover).height
  this.popoverWidth = parseInt(this.popoverWidth)
  this.popoverHeight = parseInt(this.popoverHeight)
}

fn.calculatePosition = function () {
  var containerOffset = offset(this.container)
  var popoverOffset = offset(this.popover)

  this.targetTop = containerOffset.top
  this.targetLeft = containerOffset.left
  this.targetRight = (containerOffset.left + containerOffset.width) - this.popoverWidth

  this.positionateOnTop = this.targetTop - popoverOffset.height
  this.positionateOnBottom = this.targetTop + containerOffset.height
}

fn.getAxis = function () {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  }
}

fn.setPosition = function () {
  var axis = this.getAxis()

  this.calculatePosition()

  if (this.targetLeft < axis.x) {
    this.popover.style.left = this.targetLeft + 'px'
  } else {
    this.popover.style.left = this.targetRight + 'px'
  }

  if (axis.y > this.targetTop) {
    this.popover.style.top = this.positionateOnBottom + 'px'
  } else {
    this.popover.style.top = this.positionateOnTop + 'px'
  }
}

fn.addEvents = function () {
  var self = this

  this.container.addEventListener('mouseover', function () {
    self.show()
  })

  this.popover.addEventListener('mouseover', function () {
    self.show()
  })

  this.container.addEventListener('mouseout', function () {
    self.hide()
  })

  this.popover.addEventListener('mouseout', function () {
    self.hide()
  })

  window.addEventListener('resize', this.setPosition.bind(this))
  window.addEventListener('scroll', this.setPosition.bind(this))
}

fn.show = function () {
  this.popover.classList.add(this.options.effect + '-after')
}

fn.hide = function () {
  this.popover.classList.remove(this.options.effect + '-after')
}
