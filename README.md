Mapbox GL Draw Scale Mode
==========================

Implements a scale mode in GL Draw. Module is still in active development. See [Mapbox GL Draw Scale Mode Example](https://andrei-gheorghiu.github.io/mapbox-gl-draw-scale-mode/).

Installation
------------

### npm

```
npm install mapbox-gl-draw-scale-mode

import ScaleMode from 'mapbox-gl-draw-scale-mode';
```

### browser

Get the js file from `dist/` folder and include it in your project.

```
<script type="text/javascript" src="mapbox-gl-draw-scale-mode.js"></script>
```

## Usage

Ensure you are loading draw onto your map as a control before triggering `changeMode`.

```
var draw = new MapboxDraw(
  defaultMode: 'ScaleMode'
  modes: Object.assign(
    ScaleMode: ScaleMode
  }, MapboxDraw.modes)
});

map.addControl(draw);

/*
 After load, or on events, activate or deactivate scaling:
*/

draw.changeMode('ScaleMode');
draw.changeMode('simple_select');
```

## Events

Mapbox GL Draw Scale Mode triggers the following events:

```
RotateMode.rotatestart = function(selectedFeature,originalCenter) {
   console.log('SCALESTART');
   console.log('feature: ',selectedFeature);
   console.log('center: ',originalCenter);
}

RotateMode.rotating = function(selectedFeature,originalCenter,lastMouseDown) {
   console.log('SCALING');
   console.log('feature: ',selectedFeature);
   console.log('center: ',originalCenter);
   console.log('lastMouseDown: ',lastMouseDown);
}

RotateMode.rotateend = function(selectedFeature) {
   console.log('SCALEEND');
   console.log('feature: ',selectedFeature);
}
```

---
Copyright @2019 Andrei Gheorghiu

<small>Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

<small>THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.</small>
