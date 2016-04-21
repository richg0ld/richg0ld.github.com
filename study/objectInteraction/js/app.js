function canvasSupport() {
    return Modernizr.canvas;
}
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 300;
var Obj = (function () {
    function Obj(options) {
        this.name = options.name || "통";
        this.x = Math.random() * 200;
        this.y = Math.random() * 200;
        this.textWidth = 0;
        this.textHeight = 0;
        this.speedX = options.speed || 2;
        this.speedY = options.speed || 2;
    }
    Obj.prototype.draw = function () {
        context.beginPath();
        context.font = "30px Verdana";
        context.fillStyle = "white";
        context.textBaseline = 'top';
        context.fillText(this.name, this.x, this.y);
        this.textWidth = context.measureText(this.name).width;
        this.textHeight = 30;
        context.closePath();
    };
    Obj.prototype.update = function () {
        this.wallHit();
        this.x = this.x + this.speedX;
        this.y = this.y + this.speedY;
    };
    Obj.prototype.hit = function () {
    };
    Obj.prototype.wallHit = function () {
        if (this.x < 0) {
            this.speedX = Math.abs(this.speedX);
        }
        else if (this.x > canvas.width - this.textWidth) {
            this.speedX = -this.speedX;
        }
        if (this.y < 0) {
            this.speedY = Math.abs(this.speedY);
        }
        else if (this.y > canvas.height - this.textHeight) {
            this.speedY = -this.speedY;
        }
    };
    return Obj;
}());
var num = 10;
var objs = [];
for (var n = 0; n < num; n++) {
    objs.push(new Obj({ name: "obj" + n, speed: 3 }));
}
var Render = function (func) {
    window.requestAnimationFrame(function () { return Render(func); }); //애니메이션 요청
    func();
};
var Clear = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
};
var Draw = function () {
    for (var i = 0; i < num; i++) {
        objs[i].draw();
    }
};
var Update = function () {
    for (var j = 0; j < num; j++) {
        objs[j].update();
    }
};
canvasSupport();
Render(function () {
    Clear();
    Draw();
    Update();
    console.log(objs[0].x, objs[0].y);
});
