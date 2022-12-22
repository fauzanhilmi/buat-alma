/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/animations/interactive-flowers.ts":
/*!***********************************************!*\
  !*** ./src/animations/interactive-flowers.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InteractiveFlowers = void 0;
var point_1 = __webpack_require__(/*! ../models/point */ "./src/models/point.ts");
var flower_randomization_service_1 = __webpack_require__(/*! ../services/flower-randomization.service */ "./src/services/flower-randomization.service.ts");
var InteractiveFlowers = (function () {
    function InteractiveFlowers(canvas) {
        this.canvas = canvas;
        this.flowers = [];
        this.randomizationService = new flower_randomization_service_1.FlowerRandomizationService();
        this.ctrlIsPressed = false;
        this.mousePosition = new point_1.Point(-100, -100);
        this.context = this.canvas.getContext('2d');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.addShadowEffect();
        this.addInteractions();
    }
    InteractiveFlowers.prototype.clearCanvas = function () {
        this.flowers = [];
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    };
    InteractiveFlowers.prototype.animateFlowers = function () {
        var _this = this;
        if (this.flowers.every(function (f) { return f.stopChanging; })) {
            return;
        }
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.flowers.forEach(function (flower) {
            flower.increasePetalRadiusWithLimit();
            flower.draw(_this.context);
        });
        window.requestAnimationFrame(function () { return _this.animateFlowers(); });
    };
    InteractiveFlowers.prototype.addInteractions = function () {
        var _this = this;
        this.canvas.addEventListener('click', function (e) {
            if (_this.ctrlIsPressed) {
                _this.clearCanvas();
                return;
            }
            _this.calculateMouseRelativePositionInCanvas(e);
            var flower = _this.randomizationService.getFlowerAt(_this.mousePosition);
            _this.flowers.push(flower);
            _this.animateFlowers();
        });
        window.addEventListener('keydown', function (e) {
            if (e.which === 17 || e.keyCode === 17) {
                _this.ctrlIsPressed = true;
            }
        });
        window.addEventListener('keyup', function () {
            _this.ctrlIsPressed = false;
        });
    };
    InteractiveFlowers.prototype.calculateMouseRelativePositionInCanvas = function (e) {
        this.mousePosition = new point_1.Point(e.clientX +
            (document.documentElement.scrollLeft || document.body.scrollLeft) -
            this.canvas.offsetLeft, e.clientY +
            (document.documentElement.scrollTop || document.body.scrollTop) -
            this.canvas.offsetTop);
    };
    InteractiveFlowers.prototype.addShadowEffect = function () {
        this.context.shadowBlur = 5;
        this.context.shadowOffsetX = 2;
        this.context.shadowOffsetY = 2;
        this.context.shadowColor = '#333';
        this.context.globalAlpha = 0.8;
    };
    return InteractiveFlowers;
}());
exports.InteractiveFlowers = InteractiveFlowers;


/***/ }),

/***/ "./src/models/flower-center.ts":
/*!*************************************!*\
  !*** ./src/models/flower-center.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlowerCenter = void 0;
var FlowerCenter = (function () {
    function FlowerCenter(centerPoint, centerRadius, centerColor) {
        this.centerPoint = centerPoint;
        this.centerRadius = centerRadius;
        this.centerColor = centerColor;
    }
    FlowerCenter.prototype.draw = function (context) {
        context.save();
        context.beginPath();
        context.arc(this.centerPoint.x, this.centerPoint.y, this.centerRadius, 0, 2 * Math.PI);
        context.fillStyle = this.centerColor;
        context.fill();
        context.restore();
    };
    return FlowerCenter;
}());
exports.FlowerCenter = FlowerCenter;


/***/ }),

/***/ "./src/models/flower.ts":
/*!******************************!*\
  !*** ./src/models/flower.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Flower = void 0;
var petal_1 = __webpack_require__(/*! ./petal */ "./src/models/petal.ts");
var Flower = (function () {
    function Flower(flowerCenter, numberOfPetals, petal) {
        this.flowerCenter = flowerCenter;
        this.numberOfPetals = numberOfPetals;
        this.petal = petal;
        this.stopChanging = false;
        this.originalPetalRadius = this.petal.radius;
    }
    Flower.prototype.draw = function (context) {
        this.drawPetals(context);
        this.flowerCenter.draw(context);
    };
    Flower.prototype.increasePetalRadius = function () {
        this.petal = new petal_1.Petal(this.petal.centerPoint, this.petal.radius + 0.2, this.petal.tipSkewRatio, this.petal.angleSpan, this.petal.color);
    };
    Flower.prototype.increasePetalRadiusWithLimit = function () {
        if (this.petal.radius < this.originalPetalRadius + 20) {
            this.stopChanging = false;
            this.increasePetalRadius();
        }
        else {
            this.stopChanging = true;
        }
    };
    Flower.prototype.drawPetals = function (context) {
        context.save();
        var rotateAngle = (2 * Math.PI) / this.numberOfPetals;
        for (var i = 0; i < this.numberOfPetals; i++) {
            context.translate(this.petal.centerPoint.x, this.petal.centerPoint.y);
            context.rotate(rotateAngle);
            context.translate(-this.petal.centerPoint.x, -this.petal.centerPoint.y);
            this.petal.draw(context);
        }
        context.restore();
    };
    return Flower;
}());
exports.Flower = Flower;


/***/ }),

/***/ "./src/models/petal.ts":
/*!*****************************!*\
  !*** ./src/models/petal.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Petal = void 0;
var point_1 = __webpack_require__(/*! ./point */ "./src/models/point.ts");
var rad = Math.PI / 180;
var tangent = 0.2;
var Petal = (function () {
    function Petal(centerPoint, radius, tipSkewRatio, angleSpan, color) {
        this.centerPoint = centerPoint;
        this.radius = radius;
        this.tipSkewRatio = tipSkewRatio;
        this.angleSpan = angleSpan;
        this.color = color;
        this.vertices = this.getVertices();
        this.controlPoints = this.getControlPoints(this.vertices);
    }
    Petal.prototype.draw = function (context) {
        context.save();
        context.beginPath();
        context.moveTo(this.centerPoint.x, this.centerPoint.y);
        context.quadraticCurveTo(this.controlPoints[1][1].x, this.controlPoints[1][1].y, this.vertices[1].x, this.vertices[1].y);
        context.bezierCurveTo(this.controlPoints[1][0].x, this.controlPoints[1][0].y, this.controlPoints[2][1].x, this.controlPoints[2][1].y, this.vertices[2].x, this.vertices[2].y);
        context.bezierCurveTo(this.controlPoints[2][0].x, this.controlPoints[2][0].y, this.controlPoints[3][1].x, this.controlPoints[3][1].y, this.vertices[3].x, this.vertices[3].y);
        context.quadraticCurveTo(this.controlPoints[3][0].x, this.controlPoints[3][0].y, this.centerPoint.x, this.centerPoint.y);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    };
    Petal.prototype.getVertices = function () {
        var halfAngleSpan = 0.5 * this.angleSpan * rad;
        var dx = this.radius * Math.sin(halfAngleSpan);
        var dy = this.radius * Math.cos(halfAngleSpan);
        var tipRadius = this.radius * this.tipSkewRatio;
        return [
            this.centerPoint,
            new point_1.Point(this.centerPoint.x - dx, this.centerPoint.y - dy),
            new point_1.Point(this.centerPoint.x, this.centerPoint.y - tipRadius),
            new point_1.Point(this.centerPoint.x + dx, this.centerPoint.y - dy),
            this.centerPoint
        ];
    };
    Petal.prototype.getControlPoints = function (vertices) {
        var controlPoints = [];
        for (var i = 1; i < vertices.length - 1; i++) {
            var dx = (vertices[i - 1].x - vertices[i + 1].x) * tangent;
            var dy = (vertices[i - 1].y - vertices[i + 1].y) * tangent;
            controlPoints[i] = [];
            controlPoints[i].push(new point_1.Point(vertices[i].x - dx, vertices[i].y - dy));
            controlPoints[i].push(new point_1.Point(vertices[i].x + dx, vertices[i].y + dy));
        }
        return controlPoints;
    };
    return Petal;
}());
exports.Petal = Petal;


/***/ }),

/***/ "./src/models/point.ts":
/*!*****************************!*\
  !*** ./src/models/point.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Point = void 0;
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }
    return Point;
}());
exports.Point = Point;


/***/ }),

/***/ "./src/services/flower-randomization.service.ts":
/*!******************************************************!*\
  !*** ./src/services/flower-randomization.service.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlowerRandomizationService = void 0;
var flower_1 = __webpack_require__(/*! ../models/flower */ "./src/models/flower.ts");
var point_1 = __webpack_require__(/*! ../models/point */ "./src/models/point.ts");
var flower_center_1 = __webpack_require__(/*! ../models/flower-center */ "./src/models/flower-center.ts");
var petal_1 = __webpack_require__(/*! ../models/petal */ "./src/models/petal.ts");
var FlowerRandomizationService = (function () {
    function FlowerRandomizationService() {
        this.colors = [
            '#f10e57',
            '#ea767a',
            '#ff6d3d',
            '#ecac43',
            '#fb9983',
            '#f9bc9f',
            '#f8ed38',
            '#a8e3f9',
            '#d1f2fd',
            '#ecd5f5',
            '#fee4fd',
            '#8520b4',
            '#fa2e59',
            '#ff703f',
            '#ff703f',
            '#f7bc05',
            '#ecf6bb',
            '#76bcad'
        ];
    }
    FlowerRandomizationService.prototype.getFlowerAt = function (point) {
        var flowerCenter = new flower_center_1.FlowerCenter(point, this.randomIntFromInterval(5, 16), this.randomColor());
        var numberOfPetals = this.randomIntFromInterval(4, 8);
        var petalAngleSpacing = this.randomIntFromInterval(5, 25);
        var petalAngleSpan = 360 / numberOfPetals - petalAngleSpacing;
        var petal = new petal_1.Petal(point, this.randomIntFromInterval(20, 50), this.randomIntFromInterval(9, 14) / 10, petalAngleSpan, this.randomColor());
        return new flower_1.Flower(flowerCenter, numberOfPetals, petal);
    };
    FlowerRandomizationService.prototype.getFlowerOnCanvas = function (canvasWidth, canvasHeight) {
        return this.getFlowerAt(new point_1.Point(this.randomIntLessThan(canvasWidth), this.randomIntLessThan(canvasHeight)));
    };
    FlowerRandomizationService.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    FlowerRandomizationService.prototype.randomIntLessThan = function (n) {
        return this.randomIntFromInterval(0, n);
    };
    FlowerRandomizationService.prototype.randomColor = function () {
        return this.colors[this.randomIntLessThan(this.colors.length)];
    };
    return FlowerRandomizationService;
}());
exports.FlowerRandomizationService = FlowerRandomizationService;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var interactive_flowers_1 = __webpack_require__(/*! ./animations/interactive-flowers */ "./src/animations/interactive-flowers.ts");
function main() {
    if (navigator.serviceWorker.controller) {
        console.log('Active service worker found, no need to register');
    }
    else {
        navigator.serviceWorker
            .register('sw.js', {
            scope: './'
        })
            .then(function (reg) {
            console.log("SW has been registered for scope (" + reg.scope + ")");
        });
    }
    var canvas = document.getElementById('flowers');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    var flowers = new interactive_flowers_1.InteractiveFlowers(canvas);
    var btn = document.getElementById('clearBtn');
    btn.addEventListener('click', function () {
        flowers.clearCanvas();
    });
}
main();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtYW5pbWF0aW9uLXN0ZXAtYnktc3RlcC8uL3NyYy9hbmltYXRpb25zL2ludGVyYWN0aXZlLWZsb3dlcnMudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWFuaW1hdGlvbi1zdGVwLWJ5LXN0ZXAvLi9zcmMvbW9kZWxzL2Zsb3dlci1jZW50ZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWFuaW1hdGlvbi1zdGVwLWJ5LXN0ZXAvLi9zcmMvbW9kZWxzL2Zsb3dlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtYW5pbWF0aW9uLXN0ZXAtYnktc3RlcC8uL3NyYy9tb2RlbHMvcGV0YWwudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWFuaW1hdGlvbi1zdGVwLWJ5LXN0ZXAvLi9zcmMvbW9kZWxzL3BvaW50LnRzIiwid2VicGFjazovL2NhbnZhcy1hbmltYXRpb24tc3RlcC1ieS1zdGVwLy4vc3JjL3NlcnZpY2VzL2Zsb3dlci1yYW5kb21pemF0aW9uLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLWFuaW1hdGlvbi1zdGVwLWJ5LXN0ZXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FudmFzLWFuaW1hdGlvbi1zdGVwLWJ5LXN0ZXAvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0Esa0ZBQXdDO0FBQ3hDLDJKQUFzRjtBQUV0RjtJQVNFLDRCQUE2QixNQUF5QjtRQUF6QixXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUw5QyxZQUFPLEdBQWEsRUFBRSxDQUFDO1FBQ2QseUJBQW9CLEdBQUcsSUFBSSx5REFBMEIsRUFBRSxDQUFDO1FBQ2pFLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLGtCQUFhLEdBQUcsSUFBSSxhQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUc1QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxD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QUFNLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNDLElBQU0sT0FBTyxHQUFHLElBQUksd0NBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFL0MsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoRCxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO1FBQzVCLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiJtYWluLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZsb3dlciB9IGZyb20gJy4uL21vZGVscy9mbG93ZXInO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuLi9tb2RlbHMvcG9pbnQnO1xuaW1wb3J0IHsgRmxvd2VyUmFuZG9taXphdGlvblNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9mbG93ZXItcmFuZG9taXphdGlvbi5zZXJ2aWNlJztcblxuZXhwb3J0IGNsYXNzIEludGVyYWN0aXZlRmxvd2VycyB7XG4gIHByaXZhdGUgcmVhZG9ubHkgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwcml2YXRlIHJlYWRvbmx5IGNhbnZhc1dpZHRoOiBudW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgY2FudmFzSGVpZ2h0OiBudW1iZXI7XG4gIHByaXZhdGUgZmxvd2VyczogRmxvd2VyW10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSByYW5kb21pemF0aW9uU2VydmljZSA9IG5ldyBGbG93ZXJSYW5kb21pemF0aW9uU2VydmljZSgpO1xuICBwcml2YXRlIGN0cmxJc1ByZXNzZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBtb3VzZVBvc2l0aW9uID0gbmV3IFBvaW50KC0xMDAsIC0xMDApO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5jYW52YXNXaWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xuICAgIHRoaXMuY2FudmFzSGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuXG4gICAgdGhpcy5hZGRTaGFkb3dFZmZlY3QoKTtcbiAgICB0aGlzLmFkZEludGVyYWN0aW9ucygpO1xuICB9XG5cbiAgY2xlYXJDYW52YXMoKSB7XG4gICAgdGhpcy5mbG93ZXJzID0gW107XG4gICAgdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XG4gIH1cblxuICBwcml2YXRlIGFuaW1hdGVGbG93ZXJzKCkge1xuICAgIGlmICh0aGlzLmZsb3dlcnMuZXZlcnkoZiA9PiBmLnN0b3BDaGFuZ2luZykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XG4gICAgdGhpcy5mbG93ZXJzLmZvckVhY2goZmxvd2VyID0+IHtcbiAgICAgIGZsb3dlci5pbmNyZWFzZVBldGFsUmFkaXVzV2l0aExpbWl0KCk7XG4gICAgICBmbG93ZXIuZHJhdyh0aGlzLmNvbnRleHQpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hbmltYXRlRmxvd2VycygpKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkSW50ZXJhY3Rpb25zKCkge1xuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICBpZiAodGhpcy5jdHJsSXNQcmVzc2VkKSB7XG4gICAgICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5jYWxjdWxhdGVNb3VzZVJlbGF0aXZlUG9zaXRpb25JbkNhbnZhcyhlKTtcbiAgICAgIGNvbnN0IGZsb3dlciA9IHRoaXMucmFuZG9taXphdGlvblNlcnZpY2UuZ2V0Rmxvd2VyQXQodGhpcy5tb3VzZVBvc2l0aW9uKTtcbiAgICAgIHRoaXMuZmxvd2Vycy5wdXNoKGZsb3dlcik7XG4gICAgICB0aGlzLmFuaW1hdGVGbG93ZXJzKCk7XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoZS53aGljaCA9PT0gMTcgfHwgZS5rZXlDb2RlID09PSAxNykge1xuICAgICAgICB0aGlzLmN0cmxJc1ByZXNzZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsICgpID0+IHtcbiAgICAgIHRoaXMuY3RybElzUHJlc3NlZCA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjdWxhdGVNb3VzZVJlbGF0aXZlUG9zaXRpb25JbkNhbnZhcyhlOiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5tb3VzZVBvc2l0aW9uID0gbmV3IFBvaW50KFxuICAgICAgZS5jbGllbnRYICtcbiAgICAgICAgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCkgLVxuICAgICAgICB0aGlzLmNhbnZhcy5vZmZzZXRMZWZ0LFxuICAgICAgZS5jbGllbnRZICtcbiAgICAgICAgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC1cbiAgICAgICAgdGhpcy5jYW52YXMub2Zmc2V0VG9wXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkU2hhZG93RWZmZWN0KCkge1xuICAgIHRoaXMuY29udGV4dC5zaGFkb3dCbHVyID0gNTtcbiAgICB0aGlzLmNvbnRleHQuc2hhZG93T2Zmc2V0WCA9IDI7XG4gICAgdGhpcy5jb250ZXh0LnNoYWRvd09mZnNldFkgPSAyO1xuICAgIHRoaXMuY29udGV4dC5zaGFkb3dDb2xvciA9ICcjMzMzJztcbiAgICB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSAwLjg7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9wb2ludCc7XG5cbmV4cG9ydCBjbGFzcyBGbG93ZXJDZW50ZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNlbnRlclBvaW50OiBQb2ludCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNlbnRlclJhZGl1czogbnVtYmVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2VudGVyQ29sb3I6IHN0cmluZ1xuICApIHt9XG5cbiAgZHJhdyhjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjb250ZXh0LnNhdmUoKTtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIGNvbnRleHQuYXJjKFxuICAgICAgdGhpcy5jZW50ZXJQb2ludC54LFxuICAgICAgdGhpcy5jZW50ZXJQb2ludC55LFxuICAgICAgdGhpcy5jZW50ZXJSYWRpdXMsXG4gICAgICAwLFxuICAgICAgMiAqIE1hdGguUElcbiAgICApO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5jZW50ZXJDb2xvcjtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGV0YWwgfSBmcm9tICcuL3BldGFsJztcbmltcG9ydCB7IEZsb3dlckNlbnRlciB9IGZyb20gJy4vZmxvd2VyLWNlbnRlcic7XG5cbmV4cG9ydCBjbGFzcyBGbG93ZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IG9yaWdpbmFsUGV0YWxSYWRpdXM6IG51bWJlcjtcbiAgcHVibGljIHN0b3BDaGFuZ2luZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmxvd2VyQ2VudGVyOiBGbG93ZXJDZW50ZXIsXG4gICAgcHJpdmF0ZSByZWFkb25seSBudW1iZXJPZlBldGFsczogbnVtYmVyLFxuICAgIHByaXZhdGUgcGV0YWw6IFBldGFsXG4gICkge1xuICAgIHRoaXMub3JpZ2luYWxQZXRhbFJhZGl1cyA9IHRoaXMucGV0YWwucmFkaXVzO1xuICB9XG5cbiAgZHJhdyhjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICB0aGlzLmRyYXdQZXRhbHMoY29udGV4dCk7XG4gICAgdGhpcy5mbG93ZXJDZW50ZXIuZHJhdyhjb250ZXh0KTtcbiAgfVxuXG4gIGluY3JlYXNlUGV0YWxSYWRpdXMoKSB7XG4gICAgdGhpcy5wZXRhbCA9IG5ldyBQZXRhbChcbiAgICAgIHRoaXMucGV0YWwuY2VudGVyUG9pbnQsXG4gICAgICB0aGlzLnBldGFsLnJhZGl1cyArIDAuMixcbiAgICAgIHRoaXMucGV0YWwudGlwU2tld1JhdGlvLFxuICAgICAgdGhpcy5wZXRhbC5hbmdsZVNwYW4sXG4gICAgICB0aGlzLnBldGFsLmNvbG9yXG4gICAgKTtcbiAgfVxuXG4gIGluY3JlYXNlUGV0YWxSYWRpdXNXaXRoTGltaXQoKSB7XG4gICAgaWYgKHRoaXMucGV0YWwucmFkaXVzIDwgdGhpcy5vcmlnaW5hbFBldGFsUmFkaXVzICsgMjApIHtcbiAgICAgIHRoaXMuc3RvcENoYW5naW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmluY3JlYXNlUGV0YWxSYWRpdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdG9wQ2hhbmdpbmcgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZHJhd1BldGFscyhjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjb250ZXh0LnNhdmUoKTtcbiAgICBjb25zdCByb3RhdGVBbmdsZSA9ICgyICogTWF0aC5QSSkgLyB0aGlzLm51bWJlck9mUGV0YWxzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZlBldGFsczsgaSsrKSB7XG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSh0aGlzLnBldGFsLmNlbnRlclBvaW50LngsIHRoaXMucGV0YWwuY2VudGVyUG9pbnQueSk7XG4gICAgICBjb250ZXh0LnJvdGF0ZShyb3RhdGVBbmdsZSk7XG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSgtdGhpcy5wZXRhbC5jZW50ZXJQb2ludC54LCAtdGhpcy5wZXRhbC5jZW50ZXJQb2ludC55KTtcbiAgICAgIHRoaXMucGV0YWwuZHJhdyhjb250ZXh0KTtcbiAgICB9XG4gICAgY29udGV4dC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9wb2ludCc7XG5cbmNvbnN0IHJhZCA9IE1hdGguUEkgLyAxODA7XG5jb25zdCB0YW5nZW50ID0gMC4yO1xuXG5leHBvcnQgY2xhc3MgUGV0YWwge1xuICBwcml2YXRlIHJlYWRvbmx5IHZlcnRpY2VzOiBQb2ludFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IGNvbnRyb2xQb2ludHM6IFBvaW50W11bXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2VudGVyUG9pbnQ6IFBvaW50LFxuICAgIHB1YmxpYyByZWFkb25seSByYWRpdXM6IG51bWJlcixcbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlwU2tld1JhdGlvOiBudW1iZXIsXG4gICAgcHVibGljIHJlYWRvbmx5IGFuZ2xlU3BhbjogbnVtYmVyLFxuICAgIHB1YmxpYyByZWFkb25seSBjb2xvcjogc3RyaW5nXG4gICkge1xuICAgIHRoaXMudmVydGljZXMgPSB0aGlzLmdldFZlcnRpY2VzKCk7XG4gICAgdGhpcy5jb250cm9sUG9pbnRzID0gdGhpcy5nZXRDb250cm9sUG9pbnRzKHRoaXMudmVydGljZXMpO1xuICB9XG5cbiAgZHJhdyhjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjb250ZXh0LnNhdmUoKTtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIGNvbnRleHQubW92ZVRvKHRoaXMuY2VudGVyUG9pbnQueCwgdGhpcy5jZW50ZXJQb2ludC55KTtcbiAgICBjb250ZXh0LnF1YWRyYXRpY0N1cnZlVG8oXG4gICAgICB0aGlzLmNvbnRyb2xQb2ludHNbMV1bMV0ueCxcbiAgICAgIHRoaXMuY29udHJvbFBvaW50c1sxXVsxXS55LFxuICAgICAgdGhpcy52ZXJ0aWNlc1sxXS54LFxuICAgICAgdGhpcy52ZXJ0aWNlc1sxXS55XG4gICAgKTtcbiAgICBjb250ZXh0LmJlemllckN1cnZlVG8oXG4gICAgICB0aGlzLmNvbnRyb2xQb2ludHNbMV1bMF0ueCxcbiAgICAgIHRoaXMuY29udHJvbFBvaW50c1sxXVswXS55LFxuICAgICAgdGhpcy5jb250cm9sUG9pbnRzWzJdWzFdLngsXG4gICAgICB0aGlzLmNvbnRyb2xQb2ludHNbMl1bMV0ueSxcbiAgICAgIHRoaXMudmVydGljZXNbMl0ueCxcbiAgICAgIHRoaXMudmVydGljZXNbMl0ueVxuICAgICk7XG4gICAgY29udGV4dC5iZXppZXJDdXJ2ZVRvKFxuICAgICAgdGhpcy5jb250cm9sUG9pbnRzWzJdWzBdLngsXG4gICAgICB0aGlzLmNvbnRyb2xQb2ludHNbMl1bMF0ueSxcbiAgICAgIHRoaXMuY29udHJvbFBvaW50c1szXVsxXS54LFxuICAgICAgdGhpcy5jb250cm9sUG9pbnRzWzNdWzFdLnksXG4gICAgICB0aGlzLnZlcnRpY2VzWzNdLngsXG4gICAgICB0aGlzLnZlcnRpY2VzWzNdLnlcbiAgICApO1xuICAgIGNvbnRleHQucXVhZHJhdGljQ3VydmVUbyhcbiAgICAgIHRoaXMuY29udHJvbFBvaW50c1szXVswXS54LFxuICAgICAgdGhpcy5jb250cm9sUG9pbnRzWzNdWzBdLnksXG4gICAgICB0aGlzLmNlbnRlclBvaW50LngsXG4gICAgICB0aGlzLmNlbnRlclBvaW50LnlcbiAgICApO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VmVydGljZXMoKTogUG9pbnRbXSB7XG4gICAgY29uc3QgaGFsZkFuZ2xlU3BhbiA9IDAuNSAqIHRoaXMuYW5nbGVTcGFuICogcmFkO1xuICAgIGNvbnN0IGR4ID0gdGhpcy5yYWRpdXMgKiBNYXRoLnNpbihoYWxmQW5nbGVTcGFuKTtcbiAgICBjb25zdCBkeSA9IHRoaXMucmFkaXVzICogTWF0aC5jb3MoaGFsZkFuZ2xlU3Bhbik7XG4gICAgY29uc3QgdGlwUmFkaXVzID0gdGhpcy5yYWRpdXMgKiB0aGlzLnRpcFNrZXdSYXRpbztcbiAgICByZXR1cm4gW1xuICAgICAgdGhpcy5jZW50ZXJQb2ludCxcbiAgICAgIG5ldyBQb2ludCh0aGlzLmNlbnRlclBvaW50LnggLSBkeCwgdGhpcy5jZW50ZXJQb2ludC55IC0gZHkpLFxuICAgICAgbmV3IFBvaW50KHRoaXMuY2VudGVyUG9pbnQueCwgdGhpcy5jZW50ZXJQb2ludC55IC0gdGlwUmFkaXVzKSxcbiAgICAgIG5ldyBQb2ludCh0aGlzLmNlbnRlclBvaW50LnggKyBkeCwgdGhpcy5jZW50ZXJQb2ludC55IC0gZHkpLFxuICAgICAgdGhpcy5jZW50ZXJQb2ludFxuICAgIF07XG4gIH1cblxuICBwcml2YXRlIGdldENvbnRyb2xQb2ludHModmVydGljZXM6IFBvaW50W10pOiBQb2ludFtdW10ge1xuICAgIGNvbnN0IGNvbnRyb2xQb2ludHM6IFBvaW50W11bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdmVydGljZXMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICBjb25zdCBkeCA9ICh2ZXJ0aWNlc1tpIC0gMV0ueCAtIHZlcnRpY2VzW2kgKyAxXS54KSAqIHRhbmdlbnQ7XG4gICAgICBjb25zdCBkeSA9ICh2ZXJ0aWNlc1tpIC0gMV0ueSAtIHZlcnRpY2VzW2kgKyAxXS55KSAqIHRhbmdlbnQ7XG4gICAgICBjb250cm9sUG9pbnRzW2ldID0gW107XG4gICAgICBjb250cm9sUG9pbnRzW2ldLnB1c2gobmV3IFBvaW50KHZlcnRpY2VzW2ldLnggLSBkeCwgdmVydGljZXNbaV0ueSAtIGR5KSk7XG4gICAgICBjb250cm9sUG9pbnRzW2ldLnB1c2gobmV3IFBvaW50KHZlcnRpY2VzW2ldLnggKyBkeCwgdmVydGljZXNbaV0ueSArIGR5KSk7XG4gICAgfVxuICAgIHJldHVybiBjb250cm9sUG9pbnRzO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUG9pbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgeCA9IDAsIHB1YmxpYyByZWFkb25seSB5ID0gMCkge1xuICAgIHRoaXMueCA9IE1hdGguZmxvb3IodGhpcy54KTtcbiAgICB0aGlzLnkgPSBNYXRoLmZsb29yKHRoaXMueSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEZsb3dlciB9IGZyb20gJy4uL21vZGVscy9mbG93ZXInO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuLi9tb2RlbHMvcG9pbnQnO1xuaW1wb3J0IHsgRmxvd2VyQ2VudGVyIH0gZnJvbSAnLi4vbW9kZWxzL2Zsb3dlci1jZW50ZXInO1xuaW1wb3J0IHsgUGV0YWwgfSBmcm9tICcuLi9tb2RlbHMvcGV0YWwnO1xuXG5leHBvcnQgY2xhc3MgRmxvd2VyUmFuZG9taXphdGlvblNlcnZpY2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IGNvbG9ycyA9IFtcbiAgICAnI2YxMGU1NycsXG4gICAgJyNlYTc2N2EnLFxuICAgICcjZmY2ZDNkJyxcbiAgICAnI2VjYWM0MycsXG4gICAgJyNmYjk5ODMnLFxuICAgICcjZjliYzlmJyxcbiAgICAnI2Y4ZWQzOCcsXG4gICAgJyNhOGUzZjknLFxuICAgICcjZDFmMmZkJyxcbiAgICAnI2VjZDVmNScsXG4gICAgJyNmZWU0ZmQnLFxuICAgICcjODUyMGI0JyxcbiAgICAnI2ZhMmU1OScsXG4gICAgJyNmZjcwM2YnLFxuICAgICcjZmY3MDNmJyxcbiAgICAnI2Y3YmMwNScsXG4gICAgJyNlY2Y2YmInLFxuICAgICcjNzZiY2FkJ1xuICBdO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBnZXRGbG93ZXJBdChwb2ludDogUG9pbnQpOiBGbG93ZXIge1xuICAgIGNvbnN0IGZsb3dlckNlbnRlciA9IG5ldyBGbG93ZXJDZW50ZXIoXG4gICAgICBwb2ludCxcbiAgICAgIHRoaXMucmFuZG9tSW50RnJvbUludGVydmFsKDUsIDE2KSxcbiAgICAgIHRoaXMucmFuZG9tQ29sb3IoKVxuICAgICk7XG4gICAgY29uc3QgbnVtYmVyT2ZQZXRhbHMgPSB0aGlzLnJhbmRvbUludEZyb21JbnRlcnZhbCg0LCA4KTtcbiAgICBjb25zdCBwZXRhbEFuZ2xlU3BhY2luZyA9IHRoaXMucmFuZG9tSW50RnJvbUludGVydmFsKDUsIDI1KTtcbiAgICBjb25zdCBwZXRhbEFuZ2xlU3BhbiA9IDM2MCAvIG51bWJlck9mUGV0YWxzIC0gcGV0YWxBbmdsZVNwYWNpbmc7XG4gICAgY29uc3QgcGV0YWwgPSBuZXcgUGV0YWwoXG4gICAgICBwb2ludCxcbiAgICAgIHRoaXMucmFuZG9tSW50RnJvbUludGVydmFsKDIwLCA1MCksXG4gICAgICB0aGlzLnJhbmRvbUludEZyb21JbnRlcnZhbCg5LCAxNCkgLyAxMCxcbiAgICAgIHBldGFsQW5nbGVTcGFuLFxuICAgICAgdGhpcy5yYW5kb21Db2xvcigpXG4gICAgKTtcbiAgICByZXR1cm4gbmV3IEZsb3dlcihmbG93ZXJDZW50ZXIsIG51bWJlck9mUGV0YWxzLCBwZXRhbCk7XG4gIH1cblxuICBnZXRGbG93ZXJPbkNhbnZhcyhjYW52YXNXaWR0aDogbnVtYmVyLCBjYW52YXNIZWlnaHQ6IG51bWJlcik6IEZsb3dlciB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Rmxvd2VyQXQoXG4gICAgICBuZXcgUG9pbnQoXG4gICAgICAgIHRoaXMucmFuZG9tSW50TGVzc1RoYW4oY2FudmFzV2lkdGgpLFxuICAgICAgICB0aGlzLnJhbmRvbUludExlc3NUaGFuKGNhbnZhc0hlaWdodClcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByYW5kb21JbnRGcm9tSW50ZXJ2YWwobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAvLyBtaW46IGluY2x1c2l2ZTsgbWF4OiBleGNsdXNpdmVcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xuICB9XG5cbiAgcHJpdmF0ZSByYW5kb21JbnRMZXNzVGhhbihuOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnJhbmRvbUludEZyb21JbnRlcnZhbCgwLCBuKTtcbiAgfVxuXG4gIHByaXZhdGUgcmFuZG9tQ29sb3IoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jb2xvcnNbdGhpcy5yYW5kb21JbnRMZXNzVGhhbih0aGlzLmNvbG9ycy5sZW5ndGgpXTtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBJbnRlcmFjdGl2ZUZsb3dlcnMgfSBmcm9tICcuL2FuaW1hdGlvbnMvaW50ZXJhY3RpdmUtZmxvd2Vycyc7XG5cbmZ1bmN0aW9uIG1haW4oKSB7XG4gIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyKSB7XG4gICAgY29uc29sZS5sb2coJ0FjdGl2ZSBzZXJ2aWNlIHdvcmtlciBmb3VuZCwgbm8gbmVlZCB0byByZWdpc3RlcicpO1xuICB9IGVsc2Uge1xuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyXG4gICAgICAucmVnaXN0ZXIoJ3N3LmpzJywge1xuICAgICAgICBzY29wZTogJy4vJ1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlZykge1xuICAgICAgICBjb25zb2xlLmxvZyhgU1cgaGFzIGJlZW4gcmVnaXN0ZXJlZCBmb3Igc2NvcGUgKCR7cmVnLnNjb3BlfSlgKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgY29uc3QgY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmbG93ZXJzJyk7XG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcbiAgY29uc3QgZmxvd2VycyA9IG5ldyBJbnRlcmFjdGl2ZUZsb3dlcnMoY2FudmFzKTtcblxuICBjb25zdCBidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYXJCdG4nKTtcbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGZsb3dlcnMuY2xlYXJDYW52YXMoKTtcbiAgfSk7XG59XG5cbm1haW4oKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=