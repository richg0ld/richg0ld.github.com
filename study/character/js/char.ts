let itv; //human 클래스 전역에서 인터벌 컨트롤을 위해 컨스트럭터에 인터벌용 프로퍼티 생성
let mv;
const Human = class {
    name: string;
    element: HTMLElement;
    visual: any;
    bgPosX: number;
    bgPosY: number;
    left: number;
    top: number;
    constructor(name: string, target:string) {
        this.visual = (t=>{
            const v = document.createElement("div");
            v.setAttribute("class", t);
            v.style.position = "absolute",
            v.style.left = "0"
            v.style.top = "0"
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
    direction(direction){//방향
        if (direction === "right") this.visual.style.backgroundImage = "url(sprite_right.jpg)";
        if (direction === "left") this.visual.style.backgroundImage = "url(sprite_left.jpg)";
    }
    standing(){ //서있기
        this.animate(0, 0, -600); 
    }
    run(){ //달리기
        this.animate(0, -70, -700); 
    } 
    jump(afterFunc){ //점프
        this.animate(0, -140, -1000, "once", afterFunc); 
    } 
    animate(bgPosX, bgPosY, maxPositionX, isOnce?, afterFunc?){ //모등행동 애니메이션( 파라미터로 스프라이트 이미지 포지션x,y 좌표값 / x최대 포지션 값 / 스프라이트 이미지가 한바퀴만 돌아야 하는것인지 / 한바퀴가 다 돌고나서 실행 될 함수 **isOnce와 한세트임 ) 
        this.stop(); //움직이고 있는 동작이 있다면 정지 후
        this.bgPosX = bgPosX; //인자값인 x,y값으로 초기화 후 
        this.bgPosY = bgPosY;
        itv = setInterval(()=>{ // 인터벌 실행 ( 실제 애니메이션 실행은 여기 )
            this.visual.style.backgroundPosition = this.bgPosX+"px " + this.bgPosY + "px";
            loopPos(this.bgPosX);// 포지션x값 변경 함수 실행 
        },48);
        
        let loopPos = x =>{ //스프라이트 이미지 포지션x를 지속적으로 변경시켜주는 함수
            if(x <= maxPositionX+50)
            {
                if(isOnce === "once") //한바퀴만 돌거면 아래 함수 실행 후 리턴 false
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
    }
    move(direction){
        console.log(direction);
        this.top = parseInt(this.visual.style.top)
        this.left = parseInt(this.visual.style.left)
        if(direction === "up") this.movement(this.top-=2, this.left);
        if(direction === "right") this.movement(this.top, this.left+=2);
        if(direction === "down") this.movement(this.top+=2, this.left);
        if(direction === "left") this.movement(this.top, this.left-=2);
        
        if(direction === "upRight") this.movement(this.top-=2, this.left+=2);
        if(direction === "rightDown") this.movement(this.top+=2, this.left+=2);
        if(direction === "downLeft") this.movement(this.top+=2, this.left-=2);
        if(direction === "leftUp") this.movement(this.top-=2, this.left-=2);
    }
    movement(top, left){
            this.visual.style.top = this.top+"px";
            this.visual.style.left = this.left+"px";
    }
    stay(){//제자리
        clearInterval(mv);
    }
    stop(){//정지 함수
        clearInterval(itv);
    }
}
const Keypad = class {//키보드 입력 클래스
    targetCharacter: Object;
    input: any;
    keyMethod: any;
    keyMap: any;
    status: any;
    isKeyDown: Object;
    isOnceKeyDown: boolean;
    constructor(targetCharacter){
        this.targetCharacter = targetCharacter;
        this.input = {
            38: "up",
            39: "right",
            40:"down",
            37: "left",
            32:"space"
        }
        this.keyMap = {}
        this.status = {}
        this.isOnceKeyDown = false;
        this.keySet();
    }
    keySet(){
        document.addEventListener('keydown', e=>{
           switch (e.keyCode) {
               case 38: this.keyMap[this.input[38]] = true; break;
               case 39: this.keyMap[this.input[39]] = true; break;
               case 40: this.keyMap[this.input[40]] = true; break;
               case 37: this.keyMap[this.input[37]] = true; break;
               case 32: this.keyMap[this.input[32]] = true; break;
           }
           if(!this.input[e.keyCode]) return;
           this.dispatcher(this.input[e.keyCode], this.keyMap[this.input[e.keyCode]]);

        });
        document.addEventListener('keyup', e=>{
           switch (e.keyCode) {
               case 38: this.keyMap[this.input[38]] = false; break;//up
               case 39: this.keyMap[this.input[39]] = false; break;//right
               case 40: this.keyMap[this.input[40]] = false; break;//down
               case 37: this.keyMap[this.input[37]] = false; break;//left
               case 32: this.keyMap[this.input[32]] = false; break;//space
           }
           if(!this.input[e.keyCode]) return;
           this.dispatcher(this.input[e.keyCode], this.keyMap[this.input[e.keyCode]]);
        });
    }
    moveChk(){
        if(this.keyMap.up && this.keyMap.right) return "upRight";
        if(this.keyMap.right && this.keyMap.down) return "rightDown";
        if(this.keyMap.down && this.keyMap.left) return "downLeft";
        if(this.keyMap.left && this.keyMap.up) return "leftUp";
    }
    dispatcher(key, isKeyDown){
        if(isKeyDown){//키다운일 때
            var moveName = this.moveChk();
            this.targetCharacter["move"](moveName||key);
            this.targetCharacter["direction"](key);
            if(key === "space" && !this.status[key]){//키가 점프면
                this.status[key] = "jump";
                this.targetCharacter["jump"](()=>{
                    this.status[key] = false;
                    for(var k in this.status){ //hack: 키값중에 여전히 상태 값이 어딘가에 있으면 멈추지 않는다 
                        if(this.status[k]){
                            this.targetCharacter["run"]();
                            return;
                        }
                    }
                    this.targetCharacter["standing"]();
                });
            }else if(this.status["space"] !== "jump" && this.keyMap[key] && !this.status[key]){//키를 눌렀고, 오른쪽 키 함수가 실행 되지 않았다면
                this.status[key] = "run";
                this.targetCharacter["run"]()
            }
            
        }else{//키업일 때
            if(key === "space") return; //스페이스를 눌렀다 뗀거면, 스페이스 액션 자체에서 상태값을 체크하도록 함
            this.status[key] = false;
            for(var k in this.status){ //hack: 키값중에 여전히 상태 값이 어딘가에 있으면 멈추지 않는다 
                if(this.status[k]) return;
            }
            this.targetCharacter["standing"]();
        }
    }
}
let man = new Human("porte", "sprite");
let keypad = new Keypad(man);



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