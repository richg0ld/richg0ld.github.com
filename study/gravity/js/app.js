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
canvas.width = 500;
canvas.height = 800;
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);
canvas.style.width = "100%";
var Ball = (function () {
    function Ball(options) {
        this.name = options.name || "obj";
        this.radius = options.radius || 30;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.weight = options.weight || 10;
        this.color = options.weight || "red";
        this.rotate = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.gravitySpeed = 0; //중력 가속도
        this.windSpeed = 0;
        this.bounce = 0.6; //탄성
    }
    return Ball;
}());
var Gravity = (function () {
    function Gravity() {
        this.gravity = 0.9; //중력
        this.wind = 0; //바람
    }
    Gravity.prototype.accelerate = function () {
        this.gravity = -0.05;
    };
    return Gravity;
}());
var Display = (function (_super) {
    __extends(Display, _super);
    function Display(object) {
        var _this = this;
        _super.call(this);
        this.obj = object;
        this.render(function () {
            _this.clear();
            _this.draw();
            _this.update();
        });
    }
    Display.prototype.draw = function () {
        var gradient = context.createLinearGradient(0, 0, this.obj.radius * 2, this.obj.radius * 2);
        gradient.addColorStop(0, "magenta");
        gradient.addColorStop(0.5, "blue");
        gradient.addColorStop(1.0, "red");
        context.save();
        context.translate(this.obj.x, this.obj.y); //기준점 변경
        context.rotate(this.obj.rotate);
        context.beginPath();
        context.arc(0, 0, this.obj.radius, 0, 2 * Math.PI);
        context.fillStyle = gradient;
        context.fill();
        context.stroke();
        context.closePath();
        context.restore();
    };
    Display.prototype.update = function () {
        this.obj.gravitySpeed += this.gravity;
        this.obj.windSpeed += this.wind;
        this.obj.x += this.obj.speedX + this.obj.windSpeed;
        this.obj.y += this.obj.speedY + this.obj.gravitySpeed;
        this.sideHit();
        this.bottomHit();
        this.obj.rotate += (Math.PI / 180) * this.obj.windSpeed;
    };
    Display.prototype.bottomHit = function () {
        if (this.obj.y >= canvas.height - this.obj.radius) {
            this.obj.y = canvas.height - this.obj.radius;
            this.obj.gravitySpeed = -(this.obj.gravitySpeed * this.obj.bounce); //바닥에 도착했을 때 현재 중력 가속도를 반대 방향으로 탄성만큼 곺한 값으로 바꿔주고 다시 렌더링에서 값을 양의 숫자쪽으로 증가시킨다.
        }
    };
    Display.prototype.sideHit = function () {
        if (this.obj.x >= canvas.width - this.obj.radius) {
            this.obj.x = canvas.width - this.obj.radius;
            this.obj.windSpeed = -(this.obj.windSpeed * this.obj.bounce);
        }
        else if (this.obj.x <= this.obj.radius) {
            this.obj.x = this.obj.radius;
            this.obj.windSpeed = -(this.obj.windSpeed * this.obj.bounce);
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
var obj = new Ball({});
var d = new Display(obj);
var Controller = (function () {
    var w = document.getElementById("wind");
    var wVal = document.getElementById("wind_val");
    var wBtn = document.getElementById("wind_btn");
    var wn = 0;
    w.addEventListener("input", function () {
        wn = parseFloat((w.value * 0.1).toFixed(1));
        wVal.innerHTML = wn;
    });
    wBtn.addEventListener("click", function () {
        d.wind = wn;
    });
    var g = document.getElementById("gravity");
    var gVal = document.getElementById("gravity_val");
    var gBtn = document.getElementById("gravity_btn");
    var gn = 0;
    g.addEventListener("input", function () {
        gn = parseFloat((g.value * 0.1).toFixed(1));
        gVal.innerHTML = gn;
    });
    gBtn.addEventListener("click", function () {
        d.gravity = gn;
    });
    canvas.addEventListener("mousedown", function () { return d.gravity = -gn; });
    canvas.addEventListener("mouseup", function () { return d.gravity = gn; });
    canvas.addEventListener("touchstart", function () { return d.gravity = -gn; });
    canvas.addEventListener("touchend", function () { return d.gravity = gn; });
})();
//# sourceMappingURL=app.js.map