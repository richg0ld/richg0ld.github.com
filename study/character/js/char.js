var itv; //human 클래스 전역에서 인터벌 컨트롤을 위해 컨스트럭터에 인터벌용 프로퍼티 생성
var mv;
var Human = (function () {
    function class_1(name, target) {
        this.visual = (function (t) {
            var v = document.createElement("div");
            v.setAttribute("class", t);
            v.style.position = "absolute",
                v.style.left = "0";
            v.style.top = "0";
            v.style.width = "50px",
                v.style.height = "70px",
                v.style.backgroundImage = "url(sprite_right.jpg)",
                v.style.backgroundPosition = "0 0",
                document.body.appendChild(v);
            return v;
        })(target);
        this.name = name; //이름
        this.element = document.getElementById(name); //두번쨰 파라미터 값은 해당 아이디 값을 불러오지만 입력을 안하면 이름 값을 아이디명으로 사용
        this.bgPosX = 0; //스프라이트 이미지 초기값
        this.bgPosY = 0; //
        this.left = 0;
        this.top = 0;
        this.standing(); //시작시 가만히 서있는 자세 실행
    }
    class_1.prototype.direction = function (direction) {
        if (direction === "right")
            this.visual.style.backgroundImage = "url(sprite_right.jpg)";
        if (direction === "left")
            this.visual.style.backgroundImage = "url(sprite_left.jpg)";
    };
    class_1.prototype.standing = function () {
        this.animate(0, 0, -600);
    };
    class_1.prototype.run = function () {
        this.animate(0, -70, -700);
    };
    class_1.prototype.jump = function (afterFunc) {
        this.animate(0, -140, -1000, "once", afterFunc);
    };
    class_1.prototype.animate = function (bgPosX, bgPosY, maxPositionX, isOnce, afterFunc) {
        var _this = this;
        this.stop(); //움직이고 있는 동작이 있다면 정지 후
        this.bgPosX = bgPosX; //인자값인 x,y값으로 초기화 후 
        this.bgPosY = bgPosY;
        itv = setInterval(function () {
            _this.visual.style.backgroundPosition = _this.bgPosX + "px " + _this.bgPosY + "px";
            loopPos(_this.bgPosX); // 포지션x값 변경 함수 실행 
        }, 48);
        var loopPos = function (x) {
            if (x <= maxPositionX + 50) {
                if (isOnce === "once") {
                    _this.stop();
                    afterFunc ? afterFunc() : _this.standing();
                    return false;
                }
                x = 0;
            }
            else {
                x -= 50;
            }
            _this.bgPosX = x;
        };
    };
    class_1.prototype.move = function (direction) {
        console.log(direction);
        this.top = parseInt(this.visual.style.top);
        this.left = parseInt(this.visual.style.left);
        if (direction === "up")
            this.movement(this.top -= 2, this.left);
        if (direction === "right")
            this.movement(this.top, this.left += 2);
        if (direction === "down")
            this.movement(this.top += 2, this.left);
        if (direction === "left")
            this.movement(this.top, this.left -= 2);
        if (direction === "upRight")
            this.movement(this.top -= 2, this.left += 2);
        if (direction === "rightDown")
            this.movement(this.top += 2, this.left += 2);
        if (direction === "downLeft")
            this.movement(this.top += 2, this.left -= 2);
        if (direction === "leftUp")
            this.movement(this.top -= 2, this.left -= 2);
    };
    class_1.prototype.movement = function (top, left) {
        this.visual.style.top = this.top + "px";
        this.visual.style.left = this.left + "px";
    };
    class_1.prototype.stay = function () {
        clearInterval(mv);
    };
    class_1.prototype.stop = function () {
        clearInterval(itv);
    };
    return class_1;
}());
var Keypad = (function () {
    function class_2(targetCharacter) {
        this.targetCharacter = targetCharacter;
        this.input = {
            38: "up",
            39: "right",
            40: "down",
            37: "left",
            32: "space"
        };
        this.keyMap = {};
        this.status = {};
        this.isOnceKeyDown = false;
        this.keySet();
    }
    class_2.prototype.keySet = function () {
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
            if (!_this.input[e.keyCode])
                return;
            _this.dispatcher(_this.input[e.keyCode], _this.keyMap[_this.input[e.keyCode]]);
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
            if (!_this.input[e.keyCode])
                return;
            _this.dispatcher(_this.input[e.keyCode], _this.keyMap[_this.input[e.keyCode]]);
        });
    };
    class_2.prototype.moveChk = function () {
        if (this.keyMap.up && this.keyMap.right)
            return "upRight";
        if (this.keyMap.right && this.keyMap.down)
            return "rightDown";
        if (this.keyMap.down && this.keyMap.left)
            return "downLeft";
        if (this.keyMap.left && this.keyMap.up)
            return "leftUp";
    };
    class_2.prototype.dispatcher = function (key, isKeyDown) {
        var _this = this;
        if (isKeyDown) {
            var moveName = this.moveChk();
            this.targetCharacter["move"](moveName || key);
            this.targetCharacter["direction"](key);
            if (key === "space" && !this.status[key]) {
                this.status[key] = "jump";
                this.targetCharacter["jump"](function () {
                    _this.status[key] = false;
                    for (var k in _this.status) {
                        if (_this.status[k]) {
                            _this.targetCharacter["run"]();
                            return;
                        }
                    }
                    _this.targetCharacter["standing"]();
                });
            }
            else if (this.status["space"] !== "jump" && this.keyMap[key] && !this.status[key]) {
                this.status[key] = "run";
                this.targetCharacter["run"]();
            }
        }
        else {
            if (key === "space")
                return; //스페이스를 눌렀다 뗀거면, 스페이스 액션 자체에서 상태값을 체크하도록 함
            this.status[key] = false;
            for (var k in this.status) {
                if (this.status[k])
                    return;
            }
            this.targetCharacter["standing"]();
        }
    };
    return class_2;
}());
var man = new Human("porte", "sprite");
var keypad = new Keypad(man);
// const Keypad = class {//키보드 입력 클래스
//     targetInstance: Object;
//     keyCode: Object;
//     isKeyDown: Object;
//     keyMethod: Object;
//     isOnceKeyDown: boolean;
//     constructor(targetInstance){
//         this.targetInstance = targetInstance;
//         this.keyCode = {
//             ArrowUp: 38,
//             ArrowRight: 39,
//             ArrowDown:40,
//             ArrowLeft: 37,
//             Space:32
//         }
//         this.isKeyDown = {
//             38: false,//ArrowUp
//             39: false,//ArrowRight
//             40: false,//ArrowDown
//             37: false,//ArrowLeft
//             32: false//Space
//         }
//         this.keyMethod = {
//             38: null,
//             39: null,
//             40: null,
//             37: null,
//             32: null
//         }
//         this.isOnceKeyDown = false;
//     }
//     loopKey(key, method, direction){
//         this.keyMethod[this.keyCode[key]] = method;
//         document.addEventListener('keydown', (e)=>{
//             if(e.keyCode === this.keyCode[key])
//             {
//                 if(direction) this.targetInstance["direction"](direction);
//                 if(this.isKeyDown[e.keyCode]) return;
//                 this.isKeyDown[e.keyCode] = true;
//                 if(this.isOnceKeyDown) return;
//                 this.targetInstance[method]();
//             }
//             console.log(this.keyMethod);
//         });
//         document.addEventListener('keyup', (e)=>{
//             if(e.keyCode === this.keyCode[key])
//             {
//                 this.isKeyDown[e.keyCode] = false;
//                 if(this.isOnceKeyDown) return;
//                 this.targetInstance["standing"]();
//                 this.isKeyDown[e.keyCode] = false;
//             }
//             console.log(this.keyMethod);
//         });
//     }
//     onceKey(key, method){
//         this.keyMethod[this.keyCode[key]] = method;
//         document.addEventListener('keydown', (e)=>{
//             if(e.keyCode === this.keyCode[key])
//             {
//                 if(this.isKeyDown[e.keyCode] || this.isOnceKeyDown) return;
//                 this.isOnceKeyDown = true;
//                 this.targetInstance[method](()=>{
//                     this.isKeyDown[e.keyCode] = false;
//                     this.isOnceKeyDown = false;
//                     this.targetInstance["standing"]();
//                     for( var k in this.isKeyDown ){
//                         this.isKeyDown[k] ? this.targetInstance[this.keyMethod[k]]() : "";
//                     }
//                 });
//             }
//         });
//     }
//     moveKey(dir){
//     }
// }
// let man = new Human("porte", "sprite");
// let keypad = new Keypad(man);
// keypad.loopKey("ArrowRight", "run", "right");
// keypad.loopKey("ArrowLeft", "run", "left");
// keypad.onceKey("Space", "jump");
// (()=>{
// 	const spArea = Symbol("spArea"),
// 		  bgPos = Symbol("spPos");
// 	const SpriteAnimation = class {
// 		constructor(){
// 			this.set();
// 		}
// 		set(){
// 			this[spArea] = document.getElementById("sprite");
// 			this[bgPos] = getComputedStyle(this[spArea]).backgroundPosition;
// 			this.bgPosX = 0;
// 			this.bgPosY = 0;
// 		}
// 		bgPosChange(){
// 			this[spArea].style.backgroundPosition = this[bgPos];
// 			this.decreasePosVal(this.bgPosX, this.bgPosY);
// 		}
// 		decreasePosVal(bgPosX, bgPosY){
// 			if(bgPosX <= -450 && bgPosY <= -140){
// 				bgPosX = 0;
// 				bgPosY = 0;
// 			}else if(bgPosX <= -450){
// 				bgPosX = 0;
// 				bgPosY -= 70
// 			}else{
// 				bgPosX -= 50;
// 			}
// 			this.bgPosX = bgPosX;
// 			this.bgPosY = bgPosY;
// 			this[bgPos] = bgPosX+"px " + bgPosY + "px";
// 		}
// 	}
// 	let spAnimation = new SpriteAnimation();
// 	setInterval(()=>spAnimation.bgPosChange(), 100);
// })() 
