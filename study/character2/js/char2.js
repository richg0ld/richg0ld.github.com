/**
 * Created by jhkim88 on 2016-04-01.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var canvas = (function () {
    var elem = document.createElement("canvas");
    elem.setAttribute("id", "canvas");
    elem.innerHTML = "Hello Canvas";
    elem.width = 1440;
    elem.height = 640;
    document.body.appendChild(elem);
    return elem;
})();
var context = canvas.getContext("2d");
var Around = (function () {
    function Around(canvas, src) {
        var _this = this;
        this.cvs = document.getElementById(canvas);
        this.context = this.cvs.getContext("2d");
        this.src = src;
        this.image = (function () {
            var charImage = new Image();
            charImage.src = _this.src;
            return charImage;
        })();
    }
    Around.prototype.render = function () {
        this.context.drawImage(this.image, 0, 0, this.cvs.width, this.cvs.height, 0, 0, this.cvs.width, this.cvs.height);
    };
    return Around;
}());
var User = (function () {
    var rootCanvasId;
    var rootImgSrc;
    var Sprite = (function () {
        function Sprite(canvas, options) {
            var _this = this;
            this.cvs = document.getElementById(canvas); // 캔버스 가져오기
            this.context = this.cvs.getContext("2d"); // 캔버스 컨텍스트
            this.src = options.src; // 이미지 경로
            this.frameWidth = options.width; // 프레임 총 길이
            this.numberOfFrames = options.numberOfFrames || 1; // 프레임 수
            this.width = this.frameWidth / this.numberOfFrames;
            this.height = options.height; // 높이
            this.ticksPerFrame = options.ticksPerFrame || 3; // 프레임 속도 ( 약 0.016 초 * ticksPerFrame ) 라고 보면 될듯
            this.status = options.status || "standingRight"; // 스프라이트 위치
            this.isLoop = options.isLoop; // 반복 할지말지
            this.image = (function () {
                var charImage = new Image();
                charImage.src = _this.src;
                return charImage;
            })();
            this.frameIndex = 0;
            this.tickCount = 0;
            this.moveX = options.moveX || 0;
            this.moveY = options.moveY || 0;
        }
        Sprite.prototype.render = function () {
            var curStat = {
                standingRight: 0,
                runRight: 70,
                jumpRight: 140,
                standingLeft: 210,
                runLeft: 280,
                jumpLeft: 350
            };
            this.context.drawImage(// 이미지 그리기
            this.image, // 스프라이트 시킬 이미지
            this.frameIndex * this.frameWidth / this.numberOfFrames, // 보여지는 이미지 x방향 위치
            curStat[this.status], // 보여지는 이미지 y방향 위치
            this.frameWidth / this.numberOfFrames, // 보여질 프레임의 x방향 크기
            this.height, // 보여질 프레임의 y방향 크기
            this.moveX, // 캔버스에 뿌려질 x방향 위치값
            this.moveY, // 캔버스에 뿌려질 y방향 위치값
            this.frameWidth / this.numberOfFrames, // 목적지 좌표 라고 되어있는데.. 결국 마지막에 비율을 어떻게 할지 결정하는 부분 높이 너비 값 그대로 가져오면 1:1 비율이되고 그외의 수치를 집어넣으면 크값에 맞춰 크기 변환
            this.height); // 결국 사이즈 조절은 여기서 실행 된다고 보면 될듯
        };
        Sprite.prototype.update = function () {
            this.tickCount += 1; // 프레임속도용카운트 증가
            if (this.tickCount > this.ticksPerFrame) {
                this.tickCount = 0; // 프레임속도용카운트 0으로 초기화 후
                if (this.frameIndex < this.numberOfFrames - 1) {
                    this.frameIndex += 1; // 프레임인덱스 증가
                }
                else if (this.isLoop) {
                    this.frameIndex = 0; // 프레임인덱스 0으로 초기화
                }
            }
        };
        return Sprite;
    }());
    var Motion = (function (_super) {
        __extends(Motion, _super);
        function Motion() {
            _super.call(this, rootCanvasId, {
                src: rootImgSrc,
                width: 600,
                height: 70,
                numberOfFrames: 12,
                ticksPerFrame: 2,
                status: "standingRight",
                moveX: 100,
                moveY: 500,
                isLoop: true
            });
            this.currentDirection = "right";
        }
        Motion.prototype.standing = function () {
            this.animation(600, 12, "standing");
        };
        Motion.prototype.run = function () {
            this.animation(700, 14, "run");
        };
        Motion.prototype.jump = function () {
            this.animation(1000, 20, "jump");
        };
        Motion.prototype.animation = function (width, numberOfFrames, action) {
            this.frameIndex = 0;
            this.frameWidth = width;
            this.numberOfFrames = numberOfFrames;
            this.direction(action, this.currentDirection); // 보는 방향
        };
        Motion.prototype.direction = function (action, dir) {
            this.currentDirection = dir;
            this.currentDirection === "right" ? this.status = action + "Right" : this.status = action + "Left";
        };
        return Motion;
    }(Sprite));
    var Move = (function (_super) {
        __extends(Move, _super);
        function Move() {
            _super.call(this);
            this.speed = 2; //속도
            this.isMoving = false; //움직이는 중인지 체크
        }
        Move.prototype.stop = function () {
            this.isMoving = false;
        };
        Move.prototype.up = function () {
            this.isMoving = true;
            this.moveY -= this.speed;
        };
        Move.prototype.down = function () {
            this.isMoving = true;
            this.moveY += this.speed;
        };
        Move.prototype.right = function () {
            _super.prototype.direction.call(this, "run", "right");
            this.isMoving = true;
            this.moveX += this.speed;
        };
        Move.prototype.left = function () {
            _super.prototype.direction.call(this, "run", "left");
            this.isMoving = true;
            this.moveX -= this.speed;
        };
        return Move;
    }(Motion));
    var Control = (function (_super) {
        __extends(Control, _super);
        function Control() {
            _super.call(this);
            this.input = {
                38: "up",
                39: "right",
                40: "down",
                37: "left",
                32: "space"
            };
            this.keyMap = {};
            this.isJumping = false;
            this.isActing = false;
            this.keySet();
            this.moveDispatcher();
        }
        Control.prototype.keySet = function () {
            var _this = this;
            document.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case 38:
                        _this.keyMap[_this.input[38]] = true;
                        break;
                    case 39:
                        _this.keyMap[_this.input[39]] = true;
                        break;
                    case 40:
                        _this.keyMap[_this.input[40]] = true;
                        break;
                    case 37:
                        _this.keyMap[_this.input[37]] = true;
                        break;
                    case 32:
                        _this.keyMap[_this.input[32]] = true;
                        break;
                }
            });
            document.addEventListener('keyup', function (e) {
                switch (e.keyCode) {
                    case 38:
                        _this.keyMap[_this.input[38]] = false;
                        break; //up
                    case 39:
                        _this.keyMap[_this.input[39]] = false;
                        break; //right
                    case 40:
                        _this.keyMap[_this.input[40]] = false;
                        break; //down
                    case 37:
                        _this.keyMap[_this.input[37]] = false;
                        break; //left
                    case 32:
                        _this.keyMap[_this.input[32]] = false;
                        break; //space
                }
            });
        };
        Control.prototype.moveDispatcher = function () {
            var _this = this;
            this.keyHandler = window.requestAnimationFrame(function () { return _this.moveDispatcher(); });
            if (this.keyMap["right"])
                _super.prototype.right.call(this);
            if (this.keyMap["left"])
                _super.prototype.left.call(this);
            if (this.keyMap["up"])
                _super.prototype.up.call(this);
            if (this.keyMap["down"])
                _super.prototype.down.call(this);
            this.preventEscape(); //움직임 영역 제한
            for (var k in this.keyMap) {
                // if(this.keyMap["space"] && !this.isJumping){
                //     this.isJumping = true;
                //     this.isLoop = false;
                //     super.jump();
                //     return;
                // }
                if (this.keyMap[k]) {
                    if (this.isMoving && !this.isActing) {
                        this.isActing = true;
                        _super.prototype.run.call(this);
                    }
                    return;
                }
            }
            if (this.isActing) {
                this.isActing = false;
                _super.prototype.standing.call(this);
            }
            _super.prototype.stop.call(this);
        };
        Control.prototype.preventEscape = function () {
            if (this.moveX < 0)
                this.moveX = 0;
            if (this.moveY < 440)
                this.moveY = 440;
            if (this.moveX > this.cvs.width - this.width)
                this.moveX = this.cvs.width - this.width;
            if (this.moveY > this.cvs.height - this.height)
                this.moveY = this.cvs.height - this.height;
        };
        return Control;
    }(Move));
    var User = (function (_super) {
        __extends(User, _super);
        function User(canvas, src) {
            rootCanvasId = canvas;
            rootImgSrc = src;
            _super.call(this);
        }
        return User;
    }(Control));
    return User;
})();
var bg = new Around("canvas", "bg.jpg"); //배경
var obj = new Around("canvas", "obj.png"); //맨앞 풀숲
var user = new User("canvas", "sprite.png"); //닝겐
var Renderer = function (func) {
    window.requestAnimationFrame(function () { return Renderer(func); }); //애니메이션 요청
    context.clearRect(0, 0, canvas.height, canvas.width); // 화면지우기
    func();
};
Renderer(function () {
    user.update(); // 스프라이트용 수치 업뎃
    bg.render(); //뒷배경 렌더링
    user.render(); //닝겐 렌더링
    obj.render(); //사물 렌더링
});
//# sourceMappingURL=char2.js.map