
const Human = class {
    name: string;
    currentAction: any;
    target: HTMLElement;
    bgPosX: number;
    bgPosY: number;
    itv: any;
    constructor(name: string, target?:string) {
        this.name = name;
        this.currentAction = ["standing"];
        this.target = document.getElementById(target) || document.getElementById(name);
        this.bgPosX = 0;
        this.bgPosY = 0;
        this.itv;
        
        this.standing();
    }
    standing(){
        this.animate(0, 0, -600);
    }
    run(){
        this.animate(0, -70, -700);
    }
    jump(afterFunc){
        this.animate(0, -140, -1000, "once", afterFunc);
    }
    animate(bgPosX, bgPosY, maxPositionX, isIterator?, afterFunc?){
        let loopPos  = x =>{
            if(x <= maxPositionX+50)
            {
                if(isIterator === "once")
                {
                    this.stop();
                    afterFunc ? afterFunc() : this.standing();
                    return false;
                }
                x = 0;
            }
            else
            {
                x -= 50;
            } 
            this.bgPosX = x;
        }
        this.stop();
        this.bgPosX = bgPosX;
        this.bgPosY = bgPosY;
        this.itv = setInterval(()=>{
            this.target.style.backgroundPosition = this.bgPosX+"px " + this.bgPosY + "px";
            loopPos(this.bgPosX);
        },48);
    }
    stop(){
        clearInterval(this.itv);
    }
}

const Keypad = class {
    targetInstance: Object;
    keyCode: Object;
    isKeyDown: Object;
    keyMethod: Object;
    isOnceKeyDown: boolean;
    constructor(targetInstance){
        this.targetInstance = targetInstance;
        this.keyCode = {
            ArrowUp: 38,
            ArrowRight: 39,
            ArrowDown:40,
            ArrowLeft: 37,
            Space:32
        }
        this.isKeyDown = {
            38: false,//ArrowUp
            39: false,//ArrowRight
            40: false,//ArrowDown
            37: false,//ArrowLeft
            32: false//Space
        }
        this.keyMethod = {
            38: null,
            39: null,
            40: null,
            37: null,
            32: null,
        }
        this.isOnceKeyDown = false;
    }
    loopKey(key, method){
        this.keyMethod[this.keyCode[key]] = method;
        
        document.addEventListener('keydown', (e)=>{
            
            if(e.keyCode === this.keyCode[key])
            {
                if(this.isKeyDown[e.keyCode]) return;
                this.isKeyDown[e.keyCode] = true;
                if(this.isOnceKeyDown) return;
                this.targetInstance[method]();
                
            }
        });
        document.addEventListener('keyup', (e)=>{
            if(e.keyCode === this.keyCode[key])
            {
                this.isKeyDown[e.keyCode] = false;
                if(this.isOnceKeyDown) return;
                this.targetInstance["standing"]();
                this.isKeyDown[e.keyCode] = false;
            }
        });
    }
    onceKey(key, method){
        this.keyMethod[this.keyCode[key]] = method;
        
        document.addEventListener('keydown', (e)=>{
            if(e.keyCode === this.keyCode[key])
            {
                if(this.isKeyDown[e.keyCode] || this.isOnceKeyDown) return;
                this.isOnceKeyDown = true;
                this.targetInstance[method](()=>{
                    this.isKeyDown[e.keyCode] = false;
                    this.isOnceKeyDown = false;
                    this.targetInstance["standing"]();
                    for( var k in this.isKeyDown ){
                        console.log(this.isKeyDown[k])
                        this.isKeyDown[k] ? this.targetInstance[this.keyMethod[k]]() : "";
                    }
                });
            }
        });
    }
}


let man = new Human("sprite");
let keypad = new Keypad(man);
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