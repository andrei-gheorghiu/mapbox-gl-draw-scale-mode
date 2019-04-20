const distance = require("@turf/distance").default;
const centroid = require("@turf/centroid").default;
const transformScale = require("@turf/transform-scale").default;
const EventEmitter = require("events");
const emitter = new EventEmitter();

var ScaleMode = {
  scalestart: function() {},
  scaling: function() {},
  scaleend: function() {},

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
              state.scaleFactor
          );
        }.bind(this)
    );
    emitter.addListener(
        "scaleend",
        function() {
          this.scaleend(state.selectedFeature, state.scaleFactor);
        }.bind(this)
    );

    state.selectedFeature = opts.selectedFeature || undefined;
    state.scaleFactor = undefined;
    state.originalCenter = undefined;
    state.mode = "scale";
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
        state.originalDistance = Math.max(
            distance(state.originalCenter, [e.lngLat.lng,e.lngLat.lat]),
            0.1
        );
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
        switch (state.originalFeature.properties["meta:type"]) {
          case "Point":
            break;
          case "LineString":
          case "Polygon":
          case "MultiLineString":
          case "MultiPolygon":
            state.scaleFactor =
                (distance(state.originalCenter, [e.lngLat.lng, e.lngLat.lat]) /
                    state.originalDistance) || 1;
            break;
          default:
            return;
        }
        emitter.emit("scaling");
        state.selectedFeature.geometry = transformScale(
            state.originalFeature,
            state.scaleFactor
        ).geometry;
        this._ctx.api.add(state.selectedFeature);
      }
    }
  },

  onMouseUp: function(state, e) {
    e.target["dragPan"].enable();
    emitter.emit("scaleend");
    state.selectedFeature = undefined;
    state.scaleFactor = undefined;
    state.originalCenter = undefined;
    state.originalDistance = undefined;
    return state;
  }
};

module.exports = ScaleMode;
