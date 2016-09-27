var offset = require('bloody-offset')
var assign = require('lodash/assign')
var isElement = require('lodash/isElement')
var supplant = require('small-supplant')

supplant.delimiters = ['{', '}']

module.exports = Popover

Popover.defaults = {
  customClass: 'popover-wrapper',
  content: '',
  template: '<div class="{customClass} {effect}-before"><div class="popover-content">{content}</div></div>',
  effect: 'basic',
  triangle: false,
  triangleSize: 10,
  triangleOffset: 15,
  triangleColor: '#696969'
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
  this.setPopoverPosition()

  if (this.options.triangle) {
    this.createTriangle()
    this.setTrianglePosition()
  }

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

fn.createTriangle = function () {
  var span = document.createElement('span')
  this.triangle = span
  this.triangle.classList.add('popover-triangle')
  this.triangleSize = this.options.triangleSize

  this.triangle.style.borderTopWidth = this.triangleSize + 'px'
  this.triangle.style.borderRightWidth = this.triangleSize + 'px'
  this.triangle.style.borderLeftWidth = this.triangleSize + 'px'
  this.triangle.style.borderBottomWidth = this.triangleSize + 'px'
}

fn.calculatePopoverPosition = function () {
  this.containerOffset = offset(this.container)
  this.popoverOffset = offset(this.popover)

  this.targetTop = this.containerOffset.top

  this.placeOnTop = this.targetTop - this.popoverOffset.height
  this.placeOnRight = (this.containerOffset.left + this.containerOffset.width) - this.popoverWidth
  this.placeOnBottom = this.targetTop + this.containerOffset.height
  this.placeOnLeft = this.containerOffset.left
}

fn.getAxis = function () {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  }
}

fn.setPopoverPosition = function () {
  this.calculatePopoverPosition()

  var axis = this.getAxis()

  if (this.placeOnLeft < axis.x) {
    this.popover.style.left = this.placeOnLeft + 'px'
  } else {
    this.popover.style.left = this.placeOnRight + 'px'
  }

  if (axis.y > this.targetTop) {
    this.popover.style.top = this.placeOnBottom + 'px'
  } else {
    this.popover.style.top = this.placeOnTop + 'px'
  }
}

fn.setTrianglePosition = function () {
  var axis = this.getAxis()

  var popoverContent = this.popover.querySelector('.popover-content')
  popoverContent.style.height = 'calc(100% - ' + this.triangleSize + 'px)'

  if (this.placeOnLeft < axis.x) {
    this.triangle.style.float = 'left'
    this.triangle.style.marginLeft = this.options.triangleOffset + 'px'
  } else {
    this.triangle.style.float = 'right'
    this.triangle.style.marginRight = this.options.triangleOffset + 'px'
  }

  if (axis.y > this.targetTop) {
    this.popover.insertBefore(this.triangle, this.popover.childNodes[0])
    this.triangle.style.borderBottomColor = this.options.triangleColor
    this.triangle.style.borderTopColor = 'transparent'
  } else {
    this.popover.appendChild(this.triangle)
    this.triangle.style.borderTopColor = this.options.triangleColor
    this.triangle.style.borderBottomColor = 'transparent'
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

  window.addEventListener('resize', this.setPopoverPosition.bind(this))
  window.addEventListener('scroll', this.setPopoverPosition.bind(this))
}

fn.show = function () {
  this.popover.classList.add(this.options.effect + '-after')
}

fn.hide = function () {
  this.popover.classList.remove(this.options.effect + '-after')
}
