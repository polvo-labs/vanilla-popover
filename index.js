var offset = require('bloody-offset')
var assign = require('lodash/assign')
var isElement = require('lodash/isElement')
var supplant = require('small-supplant')
var insertAfter = require('insert-after')

supplant.delimiters = ['{', '}']

module.exports = Popover

Popover.defaults = {
  customClass: 'vanilla-popover',
  content: '',
  template: '<div class="{customClass} {effect}-before">{content}</div>',
  effect: 'basic',
  triangle: true,
  triangleOffset: 15,
  triangleColor: '#000'
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
  this.createTriangle()

  this.setPopoverPosition()
  this.setTrianglePosition()

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
  if (!this.options.triangle) return
  var span = document.createElement('span')
  this.triangle = span
  this.triangle.classList.add('vanilla-popover-triangle')
  insertAfter(this.triangle, this.popover)
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
  var axis = this.getAxis()

  this.calculatePopoverPosition()

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
  if (!this.options.triangle) return

  var chosenSpace = this.options.triangleOffset
  var axis = this.getAxis()
  this.calculatePopoverPosition()

  this.borderHeight = window.getComputedStyle(this.triangle).borderTopWidth
  this.borderWidth = this.borderHeight = parseInt(this.borderHeight)

  if (this.placeOnLeft < axis.x) {
    this.triangle.style.left = this.placeOnLeft + chosenSpace + 'px'
  } else {
    this.triangle.style.left = ((this.placeOnLeft + this.containerOffset.width) - (this.borderWidth * 2) - chosenSpace) + 'px'
  }

  if (axis.y > this.targetTop) {
    this.triangle.style.borderTopColor = 'transparent'
    this.triangle.style.borderBottomColor = this.options.triangleColor

    this.trianglePosition = this.placeOnBottom - this.borderHeight

    this.triangle.style.top = this.trianglePosition + 'px'
    this.popover.style.top = this.placeOnBottom + this.borderHeight + 'px'
  } else {
    this.triangle.style.borderBottomColor = 'transparent'
    this.triangle.style.borderTopColor = this.options.triangleColor

    this.trianglePosition = this.placeOnTop - this.borderHeight

    this.triangle.style.top = this.trianglePosition + this.popoverOffset.height + 'px'
    this.popover.style.top = this.placeOnTop - this.borderHeight + 'px'
  }
}

fn.addEvents = function () {
  var self = this

  if (this.triangle) {
    this.triangle.addEventListener('mouseover', function () {
      self.show()
    })
  }

  this.container.addEventListener('mouseover', function () {
    self.show()
  })

  this.popover.addEventListener('mouseover', function () {
    self.show()
  })

  if (this.triangle) {
    this.triangle.addEventListener('mouseout', function () {
      self.hide()
    })
  }

  this.container.addEventListener('mouseout', function () {
    self.hide()
  })

  this.popover.addEventListener('mouseout', function () {
    self.hide()
  })

  window.addEventListener('resize', this.setPopoverPosition.bind(this))
  window.addEventListener('resize', this.setTrianglePosition.bind(this))
  window.addEventListener('scroll', this.setPopoverPosition.bind(this))
  window.addEventListener('scroll', this.setTrianglePosition.bind(this))
}

fn.show = function () {
  this.popover.classList.add(this.options.effect + '-after')
}

fn.hide = function () {
  this.popover.classList.remove(this.options.effect + '-after')
}
