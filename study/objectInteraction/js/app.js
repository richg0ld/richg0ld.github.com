(function () {
    return Modernizr.canvas;
})();
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 300;
var Obj = (function () {
    function Obj(options) {
        this.name = options.name || "통";
        this.x = Math.random() * 200;
        this.y = Math.random() * 200;
        this.size = Math.random() * 10 + 7;
        this.textWidth = 0;
        this.textHeight = 0;
        this.speedX = options.speed || 2;
        this.speedY = options.speed || 2;
        this.draw();
    }
    Obj.prototype.draw = function () {
        context.beginPath();
        context.fillStyle = "white";
        context.fillRect(this.x, this.y, this.size, this.size);
        context.closePath();
        // context.beginPath();
        // context.font="30px Verdana";
        // context.fillStyle = "white";
        // context.textBaseline = 'top';
        // context.fillText(this.name,this.x,this.y);
        // context.closePath();
        // this.textWidth = Math.round(context.measureText(this.name).width);
        // this.textHeight = 30;
    };
    Obj.prototype.update = function () {
        this.x = this.x + this.speedX;
        this.y = this.y + this.speedY;
    };
    return Obj;
}());
var num = 25;
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
    for (var i = 0; i < num; i++) {
        objs[i].update();
    }
};
var wallHit = function () {
    for (var i = 0; i < num; i++) {
        if (objs[i].x < 0) {
            objs[i].speedX = Math.abs(objs[i].speedX);
        }
        else if (objs[i].x > canvas.width - objs[i].size) {
            objs[i].speedX = -Math.abs(objs[i].speedX);
        }
        if (objs[i].y < 0) {
            objs[i].speedY = Math.abs(objs[i].speedY);
        }
        else if (objs[i].y > canvas.height - objs[i].size) {
            objs[i].speedY = -Math.abs(objs[i].speedY);
        }
    }
};
var isCrash = function (self, target) {
    var diffX = target.x - self.x;
    var diffY = target.y - self.y;
    return self.size > Math.sqrt(diffX * diffX + diffY * diffY);
};
var objCrash = function (self, target) {
    var diffX = target.x - self.x;
    var diffY = target.y - self.y;
    self.speedX = -self.speedX;
    self.speedY = -self.speedY;
    target.speedX = -target.speedX;
    target.speedY = -target.speedY;
};
var objHit = function () {
    var self, target;
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
var objOverlap = function (self, target) {
    self.x = self.x + target.x;
    self.y = self.y + target.y;
};
var wallOverlap = function (self) {
    if (self.x < 0) {
        return self.x = 0;
    }
    else if (self.x > canvas.width - self.size) {
        return self.x = canvas.width - self.size;
    }
    if (self.y < 0) {
        return self.y = 0;
    }
    else if (self.y > canvas.width - self.size) {
        return self.y = canvas.width - self.size;
    }
};
var chkOverlap = function () {
    var self, target;
    for (var i = 0; i < num; i++) {
        self = objs[i];
        for (var j = i + 1; j < num; j++) {
            target = objs[j];
            if (isCrash(self, target)) {
                objOverlap(self, target);
                wallOverlap(self);
                chkOverlap();
            }
        }
    }
};
chkOverlap();
Render(function () {
    Clear();
    Draw();
    wallHit();
    objHit();
    Update();
});
