/**
 * Created by jhkim88 on 2016-04-01.
 */

const canvas = (()=>{ //캔버스 생성
    var elem = document.createElement("canvas");

    elem.setAttribute("id","canvas");
    elem.innerHTML = "Hello Canvas";
    elem.width = 1440;
    elem.height = 640;

    document.body.appendChild(elem);
    return elem;
})();
const context = canvas.getContext("2d");

class Around {// 배경 및 주변 사물 클래스
    cvs: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    src: string;
    image: any;
    constructor(canvas, src){
        this.cvs = <HTMLCanvasElement> document.getElementById(canvas);
        this.context = this.cvs.getContext("2d");
        this.src = src;
        this.image = (()=>{
            const charImage = new Image();
            charImage.src = this.src;
            return charImage;
        })();
    }
    public render(){
        this.context.drawImage(
            this.image,
            0,
            0,
            this.cvs.width,
            this.cvs.height,
            0,
            0,
            this.cvs.width,
            this.cvs.height
        );
    }
}

const User =(()=> {

    let rootCanvasId;
    let rootImgSrc;

    class Sprite { // 스프라이트 클래스
        cvs: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        width: number;
        frameWidth: number;
        height: number;
        image: any;
        isLoop: any;
        status: string;
        src: string;
        frameIndex: number;
        tickCount: number;
        ticksPerFrame: number;
        numberOfFrames: number;
        moveX: number;
        moveY: number;
        constructor(canvas: string, options: any){
            this.cvs = <HTMLCanvasElement> document.getElementById(canvas); // 캔버스 가져오기
            this.context = this.cvs.getContext("2d"); // 캔버스 컨텍스트
            this.src = options.src; // 이미지 경로

            this.frameWidth = options.width; // 프레임 총 길이
            this.numberOfFrames = options.numberOfFrames || 1; // 프레임 수
            this.width = this.frameWidth / this.numberOfFrames;
            this.height = options.height; // 높이

            this.ticksPerFrame = options.ticksPerFrame || 3; // 프레임 속도 ( 약 0.016 초 * ticksPerFrame ) 라고 보면 될듯
            this.status = options.status || "standingRight"; // 스프라이트 위치
            this.isLoop = options.isLoop; // 반복 할지말지


            this.image = (()=>{
                const charImage = new Image();
                charImage.src = this.src;
                return charImage;
            })();
            this.frameIndex = 0;
            this.tickCount = 0;
            this.moveX = options.moveX || 0;
            this.moveY = options.moveY || 0;
        }
        public render(){ // 렌더링
            var curStat = { // this.status 스트링 값에 따른 스프라이트 이미지가 보여지는 위치
                standingRight: 0,
                runRight: 70,
                jumpRight:140,
                standingLeft: 210,
                runLeft: 280,
                jumpLeft:350
            };
            this.context.drawImage( // 이미지 그리기
                this.image, // 스프라이트 시킬 이미지
                this.frameIndex * this.frameWidth / this.numberOfFrames, // 보여지는 이미지 x방향 위치
                curStat[this.status], // 보여지는 이미지 y방향 위치
                this.frameWidth / this.numberOfFrames, // 보여질 프레임의 x방향 크기
                this.height, // 보여질 프레임의 y방향 크기
                this.moveX, // 캔버스에 뿌려질 x방향 위치값
                this.moveY, // 캔버스에 뿌려질 y방향 위치값
                this.frameWidth / this.numberOfFrames, // 목적지 좌표 라고 되어있는데.. 결국 마지막에 비율을 어떻게 할지 결정하는 부분 높이 너비 값 그대로 가져오면 1:1 비율이되고 그외의 수치를 집어넣으면 크값에 맞춰 크기 변환
                this.height); // 결국 사이즈 조절은 여기서 실행 된다고 보면 될듯
        }
        public update(){ // 인덱스 또는 수치값 증감
            this.tickCount += 1; // 프레임속도용카운트 증가
            if (this.tickCount > this.ticksPerFrame) { // 프레임속도용카운트가 프레임속도수보다 크면 아래 실행 아니면 넘어감
                this.tickCount = 0; // 프레임속도용카운트 0으로 초기화 후
                if (this.frameIndex < this.numberOfFrames-1){ // 프레임인덱스가 총프레임수에서 1을 뺀 수보다 작을경우
                    this.frameIndex += 1; // 프레임인덱스 증가
                } else if(this.isLoop){ // 프레임인덱스가 총프레임-1 보다 크거나 같을 경우 isLoop값이 true면 (무한반복이 트루면)
                    this.frameIndex = 0; // 프레임인덱스 0으로 초기화
                }
            }
        }
    }

    class Motion extends Sprite{// 동작, 움직임, 행동 클래스
        currentDirection: string;
        constructor() {
            super(rootCanvasId, {
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
        public standing(){//서있는 동작
            this.animation(600, 12, "standing");
        }
        public run(){//뛰는 동작
            this.animation(700, 14, "run");
        }
        public jump(){//점프 동작
            this.animation(1000, 20, "jump");
        }
        private animation(width: number, numberOfFrames: number, action: string){//애니메이션 시 프레임 셋팅
            this.frameIndex = 0;
            this.frameWidth = width;
            this.numberOfFrames = numberOfFrames;
            this.direction(action, this.currentDirection); // 보는 방향
        }
        public direction(action: string, dir: string){// 점프, 걷기, 서기 시 방향
            this.currentDirection = dir;
            this.currentDirection === "right" ? this.status = action + "Right" : this.status = action + "Left"
        }
    }

    class Move extends Motion {// 이동 클래스
        speed: number;
        isMoving: boolean;
        constructor(){
            super();
            this.speed = 2;//속도
            this.isMoving = false;//움직이는 중인지 체크
        }
        public stop(){//멈춤
            this.isMoving = false;
        }
        public up(){//위로
            this.isMoving = true;
            this.moveY-=this.speed;
        }
        public down(){//아래로
            this.isMoving = true;
            this.moveY+=this.speed;
        }
        public right(){//오른쪽으로
            super.direction("run", "right");
            this.isMoving = true;
            this.moveX+=this.speed;
        }
        public left(){//왼쪽으로
            super.direction("run", "left");
            this.isMoving = true;
            this.moveX-=this.speed;
        }
    }

    class Control extends Move {// 전체 움직임 컨트롤 / 키보드 컨트롤
        input: Object;
        keyMap: Object;
        isActing: boolean;
        isJumping: boolean;
        keyHandler: any;
        constructor(){
            super();
            this.input = {
                38: "up",
                39: "right",
                40:"down",
                37: "left",
                32:"space"
            };
            this.keyMap = {};
            this.isJumping = false;
            this.isActing = false;
            this.keySet();
            this.moveDispatcher();
        }
        private keySet(){// 키보드 이벤트 할당
            document.addEventListener('keydown', e=>{
                switch (e.keyCode) {
                    case 38: this.keyMap[this.input[38]] = true; break;
                    case 39: this.keyMap[this.input[39]] = true; break;
                    case 40: this.keyMap[this.input[40]] = true; break;
                    case 37: this.keyMap[this.input[37]] = true; break;
                    case 32: this.keyMap[this.input[32]] = true; break;
                }

            });
            document.addEventListener('keyup', e=>{
                switch (e.keyCode) {
                    case 38: this.keyMap[this.input[38]] = false; break;//up
                    case 39: this.keyMap[this.input[39]] = false; break;//right
                    case 40: this.keyMap[this.input[40]] = false; break;//down
                    case 37: this.keyMap[this.input[37]] = false; break;//left
                    case 32: this.keyMap[this.input[32]] = false; break;//space
                }
            });
        }
        private moveDispatcher(){ // 키맵 탐지
            this.keyHandler = window.requestAnimationFrame( ()=>this.moveDispatcher() );
            if(this.keyMap["right"]) super.right();
            if(this.keyMap["left"]) super.left();
            if(this.keyMap["up"]) super.up();
            if(this.keyMap["down"]) super.down();

            this.preventEscape();//움직임 영역 제한

            for(let k in this.keyMap){//keyMap 탐지
                // if(this.keyMap["space"] && !this.isJumping){
                //     this.isJumping = true;
                //     this.isLoop = false;
                //     super.jump();
                //     return;
                // }
                if(this.keyMap[k]){
                    if(this.isMoving && !this.isActing){//이동하는데 동작이 움직이는게 아닐경우
                        this.isActing =true;
                        super.run();
                    }
                    return;
                }
            }
            if(this.isActing){//이동중이 아닌데 동작이 움직일 경우
                this.isActing = false;
                super.standing();
            }
            super.stop();
        }
        private preventEscape(){//움직임 제한
            if(this.moveX < 0) this.moveX = 0;
            if(this.moveY < 440) this.moveY = 440;
            if(this.moveX > this.cvs.width - this.width ) this.moveX = this.cvs.width - this.width;
            if(this.moveY > this.cvs.height - this.height ) this.moveY = this.cvs.height - this.height;
        }
    }
    class User extends Control{//외부 노출용 사용자용
        constructor(canvas, src){
            rootCanvasId = canvas;
            rootImgSrc = src;
            super();
        }
    }
    return User;
})();

const bg = new Around("canvas", "bg.jpg");//배경
const obj = new Around("canvas", "obj.png");//맨앞 풀숲
const user = new User("canvas", "sprite.png");//닝겐

const Renderer = (func) => { //지우고 그리고 수치 업뎃 을 반복
    window.requestAnimationFrame(()=> Renderer(func) );//애니메이션 요청
    context.clearRect(0, 0, canvas.height, canvas.width); // 화면지우기
    func();
};

Renderer(function(){
    user.update();// 스프라이트용 수치 업뎃
    bg.render();//뒷배경 렌더링
    user.render();//닝겐 렌더링
    obj.render();//사물 렌더링
});