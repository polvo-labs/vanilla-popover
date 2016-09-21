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
