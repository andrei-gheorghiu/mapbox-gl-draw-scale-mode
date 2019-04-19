const distance = require("@turf/distance").default;
const centroid = require("@turf/centroid").default;
const transformScale = require("@turf/transform-scale").default;
const EventEmitter = require("events");
const emitter = new EventEmitter();

var ScaleMode = {
  scalestart: function(selectedFeature, originalCenter) {},
  scaling: function(selectedFeature, originalCenter, lastMouseDown) {},
  scaleend: function(selectedFeature) {},

  onSetup: function(opts) {
    var state = {};

    emitter.addListener(
        "scalestart",
        function() {
          this.scalestart(state.selectedFeature, state.originalCenter);
        }.bind(this)
    );
    emitter.addListener(
        "scaling",
        function() {
          this.scaling(
              state.selectedFeature,
              state.originalCenter,
              state.lastMouseDownLngLat
          );
        }.bind(this)
    );
    emitter.addListener(
        "scaleend",
        function() {
          this.scaleend(state.selectedFeature, state.lastMouseDownLngLat);
        }.bind(this)
    );

    state.selectedFeature = opts.selectedFeature || false;
    state.lastMouseDownLngLat = false;
    state.originalCenter = false;
    state.mode = "scale" || false;
    return state;
  },

  onMouseDown: function(state, e) {
    if (e.featureTarget) {
      if (this._ctx.api.get(e.featureTarget.properties.id)) {
        e.target["dragPan"].disable();
        state.selectedFeature = this._ctx.api.get(
            e.featureTarget.properties.id
        );
        state.originalCenter = centroid(e.featureTarget);
        state.originalFeature = e.featureTarget;
        state.originalDistance = distance(state.originalCenter, [
          e.lngLat.lng,
          e.lngLat.lat
        ]);
        emitter.emit("scalestart");
      }
    }
    return state;
  },

  toDisplayFeatures: function(state, geojson, display) {
    display(geojson);
  },

  onDrag: function(state, e) {
    if (state.selectedFeature && state.mode) {
      if (state.mode === "scale") {
        state.lastMouseDownLngLat = { lng: e.lngLat.lng, lat: e.lngLat.lat };
        switch (state.originalFeature.properties["meta:type"]) {
          case "Point":
            break;
          case "LineString":
          case "Polygon":
          case "MultiLineString":
          case "MultiPolygon":
            var scaleFactor =
                distance(state.originalCenter, [e.lngLat.lng, e.lngLat.lat]) /
                Math.max(state.originalDistance, 0.1);
            break;
          default:
            return;
        }
        emitter.emit("scaling");
        state.selectedFeature.geometry = transformScale(
            state.originalFeature,
            scaleFactor
        ).geometry;
        this._ctx.api.add(state.selectedFeature);
      }
    }
  },

  onMouseUp: function(state, e) {
    e.target["dragPan"].enable();
    emitter.emit("scaleend");
    state.selectedFeature = false;
    state.lastMouseDownLngLat = false;
    state.originalCenter = false;
    state.originalDistance = false;
    return state;
  }
};

module.exports = ScaleMode;
