(function () {
    return Modernizr.canvas;
})();
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 300;
var Obj = (function () {
    function Obj(options) {
        this.name = options.name || "통"; //오브젝트 이름
        this.x = Math.floor(Math.random() * 200); //x좌표 값
        this.y = Math.floor(Math.random() * 200); //y좌표 값
        this.size = Math.floor(Math.random() * 10 + 7); //오브젝트 사이즈
        this.color = options.color || "white"; //오브젝트 칼라
        this.speedX = options.speed || 2; //오브젝트 움직임 속도 X
        this.speedY = options.speed || 2; //오브젝트 움직임 속도 Y
        this.draw(); //처음 화면에 한번 그리기
    }
    Obj.prototype.draw = function () {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
        context.closePath();
    };
    Obj.prototype.update = function () {
        this.x = this.x + this.speedX;
        this.y = this.y + this.speedY;
    };
    return Obj;
}());
var num = 25; //오브젝트 개수
var objs = []; //오브젝트 들이 들어갈 배열
for (var n = 0; n < num; n++) {
    objs.push(new Obj({ name: "obj" + n, speed: 3 }));
}
var Render = function (func) {
    window.requestAnimationFrame(function () { return Render(func); }); //애니메이션 요청
    func(); //콜백함수
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
        } //obj의 왼쪽 면이 x좌표값의 0보다 작으면(왼쪽 벽에 부딧히면) speedX 프로퍼티 값을 양수로
        else if (objs[i].x > canvas.width - objs[i].size) {
            objs[i].speedX = -Math.abs(objs[i].speedX);
        } //obj의 x좌표값이 캔버스 크기에서 obj의 너비 값을 뺀 것 보다 크면(obj 오른쪽 면이 오른쪽 벽에 부딧히면) speedX 프로퍼티 값을 음수로
        if (objs[i].y < 0) {
            objs[i].speedY = Math.abs(objs[i].speedY);
        } //마찬가지
        else if (objs[i].y > canvas.height - objs[i].size) {
            objs[i].speedY = -Math.abs(objs[i].speedY);
        } //마찬가지
    }
};
var isCrash = function (self, target) {
    var maxX = self.x + self.size;
    var minX = self.x - target.size;
    var maxY = self.y + self.size;
    var minY = self.y - target.size;
    if (target.x <= maxX && target.x >= minX) {
        if (target.y <= maxY && target.y >= minY) {
            return true;
        }
    }
};
var objCrash = function (self, target) {
    var diffX = Math.abs(target.x - self.x);
    var diffY = Math.abs(target.y - self.y);
    if (diffX > diffY) {
        self.speedX = -self.speedX;
        target.speedX = -target.speedX;
    }
    else if (diffX < diffY) {
        self.speedY = -self.speedY;
        target.speedY = -target.speedY;
    }
    else if (diffX === diffY) {
        self.speedX = -self.speedX;
        self.speedY = -self.speedY;
        target.speedX = -target.speedX;
        target.speedY = -target.speedY;
    }
};
var objChk = function () {
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
    objChk();
    Update();
});
//# sourceMappingURL=app.js.map