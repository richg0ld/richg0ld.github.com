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
    elem.width = 500;
    elem.height = 500;
    document.body.appendChild(elem);
    return elem;
})();
var Sprite = (function () {
    function Sprite(canvas, options) {
        var _this = this;
        this.cvs = document.getElementById(canvas); // 캔버스 가져오기
        this.context = this.cvs.getContext("2d"); // 캔버스 컨텍스트
        this.src = options.src; // 이미지 경로
        this.width = options.width; // 프레임 총 길이
        this.height = options.height; // 높이
        this.numberOfFrames = options.numberOfFrames || 1; // 프레임 수
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
        this.moveX = 0;
        this.moveY = 0;
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
        this.context.clearRect(0, 0, this.cvs.height, this.cvs.width); // 화면지우기
        this.context.drawImage(// 이미지 그리기
        this.image, // 스프라이트 시킬 이미지
        this.frameIndex * this.width / this.numberOfFrames, // 보여지는 이미지 x방향 위치
        curStat[this.status], // 보여지는 이미지 y방향 위치
        this.width / this.numberOfFrames, // 보여질 프레임의 x방향 크기
        this.height, // 보여질 프레임의 y방향 크기
        this.moveX, // 캔버스에 뿌려질 x방향 위치값
        this.moveY, // 캔버스에 뿌려질 y방향 위치값
        this.width / this.numberOfFrames, // 목적지 좌표 라고 되어있는데.. 결국 마지막에 비율을 어떻게 할지 결정하는 부분 높이 너비 값 그대로 가져오면 1:1 비율이되고 그외의 수치를 집어넣으면 크값에 맞춰 크기 변환
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
    Sprite.prototype.loop = function () {
        var _this = this;
        window.requestAnimationFrame(function () { return _this.loop(); }); //애니메이션 요청
        this.update(); // 수치 업뎃
        this.render(); //렌더링(그리기와 지우기 반복 기능);
    };
    return Sprite;
}());
var Motion = (function (_super) {
    __extends(Motion, _super);
    function Motion() {
        _super.call(this, "canvas", {
            src: "sprite.jpg",
            width: 600,
            height: 70,
            numberOfFrames: 12,
            ticksPerFrame: 2,
            status: "standingRight",
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
        this.width = width;
        this.numberOfFrames = numberOfFrames;
        this.direction(this.currentDirection, action);
    };
    Motion.prototype.direction = function (dir, action) {
        this.currentDirection = dir;
        this.currentDirection === "right" ? this.status = action + "Right" : this.status = action + "Left";
    };
    return Motion;
}(Sprite));
var Move = (function (_super) {
    __extends(Move, _super);
    function Move() {
        _super.call(this);
        this.speed = 2;
        this.isMoving = false;
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
        _super.prototype.direction.call(this, "right", "run");
        this.isMoving = true;
        this.moveX += this.speed;
    };
    Move.prototype.left = function () {
        _super.prototype.direction.call(this, "left", "run");
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
        this.isActing = false;
        this.isOnceKeyDown = false;
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
            this["right"]();
        if (this.keyMap["left"])
            this["left"]();
        if (this.keyMap["up"])
            this["up"]();
        if (this.keyMap["down"])
            this["down"]();
        for (var k in this.keyMap) {
            if (this.keyMap[k]) {
                if (this.isMoving && !this.isActing) {
                    this.isActing = true;
                    this.run();
                }
                return;
            }
        }
        if (this.isActing) {
            this.isActing = false; //이동중이 아닌데 동작이 움직일 경우
            this.standing();
        }
        this.stop();
    };
    return Control;
}(Move));
var char = new Control();
char.image.addEventListener("load", function () { return char.loop(); }); //렌더링 루프 시작
