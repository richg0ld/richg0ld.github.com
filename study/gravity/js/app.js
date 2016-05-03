var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function () {
    return Modernizr.canvas;
})();
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.style.border = "1px solid black";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);
canvas.style.width = "100%";
var Ball = (function () {
    function Ball(options) {
        this.name = options.name || "obj";
        this.radius = options.radius || 30;
        this.x = canvas.width * Math.random();
        this.y = -canvas.width * Math.random() * 20;
        this.weight = this.radius * 0.5;
        this.color = options.weight || "red";
        this.rotate = 0;
        this.vectorX = 0;
        this.vectorY = 0;
        this.elasticity = 0.6 + (1 / this.weight); //탄성
    }
    return Ball;
}());
var Gravity = (function () {
    function Gravity() {
        this.gravity = 0.9; //중력
        this.friction = 0.01; //마찰력
        this.wind = 0; //바람
    }
    return Gravity;
}());
var Display = (function (_super) {
    __extends(Display, _super);
    function Display(object) {
        var _this = this;
        _super.call(this);
        this.objs = object;
        this.render(function () {
            _this.clear();
            _this.objHit(_this.objs);
            for (var n = 0; n < _this.objs.length; n++) {
                _this.sideHit(_this.objs[n]);
                _this.bottomHit(_this.objs[n]);
                _this.draw(_this.objs[n]);
                _this.update(_this.objs[n]);
            }
        });
    }
    Display.prototype.draw = function (obj) {
        var gradient = context.createLinearGradient(0, 0, obj.radius * 2, obj.radius * 2);
        gradient.addColorStop(0, "magenta");
        gradient.addColorStop(0.5, "blue");
        gradient.addColorStop(1.0, "red");
        context.save();
        context.translate(obj.x, obj.y); //기준점 변경
        context.rotate(obj.rotate);
        context.beginPath();
        context.arc(0, 0, obj.radius, 0, 2 * Math.PI);
        context.fillStyle = gradient;
        context.fill();
        context.stroke();
        context.closePath();
        context.restore();
    };
    Display.prototype.update = function (obj) {
        obj.vectorX = obj.vectorX + (obj.vectorY * this.friction) + this.wind;
        obj.vectorY = obj.vectorY + (obj.vectorY * this.friction) + this.gravity;
        console.log(obj.vectorY);
        obj.x += obj.vectorX;
        obj.y += obj.vectorY;
        obj.rotate += (Math.PI / 180) * obj.vectorX;
    };
    Display.prototype.bottomHit = function (obj) {
        if (obj.y >= canvas.height - obj.radius) {
            obj.y = canvas.height - obj.radius;
            obj.vectorY = -(obj.vectorY * obj.elasticity); //바닥에 도착했을 때 현재 중력 가속도를 반대 방향으로 탄성만큼 곺한 값으로 바꿔주고 다시 렌더링에서 값을 양의 숫자쪽으로 증가시킨다.
        }
    };
    Display.prototype.sideHit = function (obj) {
        if (obj.x >= canvas.width - obj.radius) {
            obj.x = canvas.width - obj.radius;
            obj.vectorX = -(obj.vectorX * obj.elasticity);
        }
        else if (obj.x <= obj.radius) {
            obj.x = obj.radius;
            obj.vectorX = -(obj.vectorX * obj.elasticity);
        }
    };
    Display.prototype.objHit = function (objs) {
        var self, target;
        var isCrash = function (self, target) {
            var diffX = target.x - self.x;
            var diffY = target.y - self.y;
            var attachedDistance = target.radius + self.radius;
            var currentDistance = Math.sqrt(diffX * diffX + diffY * diffY);
            return currentDistance <= attachedDistance;
        };
        var objCrash = function (self, target) {
            var collidVx = target.x - self.x;
            var collidVy = target.y - self.y;
            var distance = Math.sqrt(collidVx * collidVx + collidVy * collidVy);
            var unitCollideVx = collidVx / distance;
            var unitCollideVy = collidVy / distance;
            var beforeBall1Vp = unitCollideVx * self.vectorX + unitCollideVy * self.vectorY;
            var beforeBall1Vn = -unitCollideVy * self.vectorX + unitCollideVx * self.vectorY;
            var beforeBall2Vp = unitCollideVx * target.vectorX + unitCollideVy * target.vectorY;
            var beforeBall2Vn = -unitCollideVy * target.vectorX + unitCollideVx * target.vectorY;
            if (beforeBall1Vp - beforeBall2Vp <= 0)
                return;
            var afterBall1Vp = beforeBall1Vp + self.elasticity * (beforeBall2Vp - beforeBall1Vp) * target.radius / (self.radius + target.radius);
            var afterBall2Vp = beforeBall2Vp + self.elasticity * (beforeBall1Vp - beforeBall2Vp) * self.radius / (self.radius + target.radius) * self.elasticity;
            self.vectorX = afterBall1Vp * unitCollideVx - beforeBall1Vn * unitCollideVy;
            self.vectorY = afterBall1Vp * unitCollideVy + beforeBall1Vn * unitCollideVx;
            target.vectorX = afterBall2Vp * unitCollideVx - beforeBall2Vn * unitCollideVy;
            target.vectorY = afterBall2Vp * unitCollideVy + beforeBall2Vn * unitCollideVx;
        };
        for (var i = 0; i < num; i++) {
            self = objs[i];
            for (var j = i + 1; j < num; j++) {
                target = objs[j];
                if (isCrash(self, target)) {
                    objCrash(self, target);
                }
            }
        }
    };
    Display.prototype.clear = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };
    Display.prototype.render = function (func) {
        var _this = this;
        window.requestAnimationFrame(function () { return _this.render(func); });
        func();
    };
    return Display;
}(Gravity));
var num = 25;
var objs = [];
for (var n = 0; n < num; n++) {
    objs.push(new Ball({
        name: "BALL" + n,
        radius: 60 * Math.random() + 10
    }));
}
var d = new Display(objs);
//# sourceMappingURL=app.js.map