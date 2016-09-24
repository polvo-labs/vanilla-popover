# vanilla-popover

Small vanilla module for popovers.

[See live demo](https://polvo-labs.github.io/vanilla-popover/index.html)

## Installation

`npm install polvo-labs/vanilla-popover --save`

Make sure to include css too.

## Usage

```html
<div data-popover="Place your content here..."></div>
```

```js
var popover = new VanillaPopover('[data-popover]', {})
```

## API

### customClass

- Type: `String`
- Default: `vanilla-popover`

### content

- Type: `String`
- Default: `null`

### template

- Type: `String`
- Default: `<div class="{customClass}">{content}</div>`

### effect

- Type: `String`
- Default: `show`
- Options:
  - `show`: it will only show
  - `fade`: it will fade

### triangle

- Type: `Boolean`
- Default: `false`

### triangleOffset

- Type: `Number`
- Default: `0`

### triangleColor

- Type: `String`
- Default: `#000`
  - RGB are preferred
