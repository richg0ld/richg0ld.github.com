var Human = (function () {
    function class_1(name, target) {
        this.name = name;
        this.currentAction = ["standing"];
        this.target = document.getElementById(target) || document.getElementById(name);
        this.bgPosX = 0;
        this.bgPosY = 0;
        this.itv;
        this.standing();
    }
    class_1.prototype.standing = function () {
        this.animate(0, 0, -600);
    };
    class_1.prototype.run = function () {
        this.animate(0, -70, -700);
    };
    class_1.prototype.jump = function (afterFunc) {
        this.animate(0, -140, -1000, "once", afterFunc);
    };
    class_1.prototype.animate = function (bgPosX, bgPosY, maxPositionX, isIterator, afterFunc) {
        var _this = this;
        var loopPos = function (x) {
            if (x <= maxPositionX + 50) {
                if (isIterator === "once") {
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
        this.stop();
        this.bgPosX = bgPosX;
        this.bgPosY = bgPosY;
        this.itv = setInterval(function () {
            _this.target.style.backgroundPosition = _this.bgPosX + "px " + _this.bgPosY + "px";
            loopPos(_this.bgPosX);
        }, 48);
    };
    class_1.prototype.stop = function () {
        clearInterval(this.itv);
    };
    return class_1;
})();
var Keypad = (function () {
    function class_2(targetInstance) {
        this.targetInstance = targetInstance;
        this.keyCode = {
            ArrowUp: 38,
            ArrowRight: 39,
            ArrowDown: 40,
            ArrowLeft: 37,
            Space: 32
        };
        this.isKeyDown = {
            38: false,
            39: false,
            40: false,
            37: false,
            32: false //Space
        };
        this.keyMethod = {
            38: null,
            39: null,
            40: null,
            37: null,
            32: null
        };
        this.isOnceKeyDown = false;
    }
    class_2.prototype.loopKey = function (key, method) {
        var _this = this;
        this.keyMethod[this.keyCode[key]] = method;
        document.addEventListener('keydown', function (e) {
            if (e.keyCode === _this.keyCode[key]) {
                if (_this.isKeyDown[e.keyCode])
                    return;
                _this.isKeyDown[e.keyCode] = true;
                if (_this.isOnceKeyDown)
                    return;
                _this.targetInstance[method]();
            }
        });
        document.addEventListener('keyup', function (e) {
            if (e.keyCode === _this.keyCode[key]) {
                _this.isKeyDown[e.keyCode] = false;
                if (_this.isOnceKeyDown)
                    return;
                _this.targetInstance["standing"]();
                _this.isKeyDown[e.keyCode] = false;
            }
        });
    };
    class_2.prototype.onceKey = function (key, method) {
        var _this = this;
        this.keyMethod[this.keyCode[key]] = method;
        document.addEventListener('keydown', function (e) {
            if (e.keyCode === _this.keyCode[key]) {
                if (_this.isKeyDown[e.keyCode] || _this.isOnceKeyDown)
                    return;
                _this.isOnceKeyDown = true;
                _this.targetInstance[method](function () {
                    _this.isKeyDown[e.keyCode] = false;
                    _this.isOnceKeyDown = false;
                    _this.targetInstance["standing"]();
                    for (var k in _this.isKeyDown) {
                        console.log(_this.isKeyDown[k]);
                        _this.isKeyDown[k] ? _this.targetInstance[_this.keyMethod[k]]() : "";
                    }
                });
            }
        });
    };
    return class_2;
})();
var man = new Human("sprite");
var keypad = new Keypad(man);
keypad.loopKey("ArrowRight", "run");
keypad.onceKey("Space", "jump");
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
