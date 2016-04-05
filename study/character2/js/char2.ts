/**
 * Created by jhkim88 on 2016-04-01.
 */

const canvas = (()=>{ //캔버스 생성
    var elem = document.createElement("canvas");

    elem.setAttribute("id","canvas");
    elem.innerHTML = "Hello Canvas";
    elem.width = 500;
    elem.height = 500;

    document.body.appendChild(elem);
    return elem;
})();

class Sprite { // 스프라이트 클래스
     cvs: HTMLCanvasElement;
     context: CanvasRenderingContext2D;
     width: number;
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

        this.width = options.width; // 프레임 총 길이
        this.height = options.height; // 높이
        this.numberOfFrames = options.numberOfFrames || 1; // 프레임 수
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
        this.moveX = 0;
        this.moveY = 0;
    }
    render(){ // 렌더링
        var curStat = { // this.status 스트링 값에 따른 스프라이트 이미지가 보여지는 위치 
            standingRight: 0,
            runRight: 70,
            jumpRight:140,
            standingLeft: 210,
            runLeft: 280,
            jumpLeft:350
        };
        this.context.clearRect(0, 0, this.cvs.height, this.cvs.width); // 화면지우기
        this.context.drawImage( // 이미지 그리기
        this.image, // 스프라이트 시킬 이미지
        this.frameIndex * this.width / this.numberOfFrames, // 보여지는 이미지 x방향 위치
        curStat[this.status], // 보여지는 이미지 y방향 위치
        this.width / this.numberOfFrames, // 보여질 프레임의 x방향 크기
        this.height, // 보여질 프레임의 y방향 크기
        this.moveX, // 캔버스에 뿌려질 x방향 위치값
        this.moveY, // 캔버스에 뿌려질 y방향 위치값
        this.width / this.numberOfFrames, // 목적지 좌표 라고 되어있는데.. 결국 마지막에 비율을 어떻게 할지 결정하는 부분 높이 너비 값 그대로 가져오면 1:1 비율이되고 그외의 수치를 집어넣으면 크값에 맞춰 크기 변환
        this.height); // 결국 사이즈 조절은 여기서 실행 된다고 보면 될듯
    }
    update(){ // 인덱스 또는 수치값 증감
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
    loop(){ //지우고 그리고 수치 업뎃 을 반복
        window.requestAnimationFrame(()=> this.loop() );//애니메이션 요청
        this.update();// 수치 업뎃
        this.render();//렌더링(그리기와 지우기 반복 기능);
    }
}

class Motion extends Sprite{
    currentDirection: string;
    constructor() {
        super("canvas", {
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
    standing(){
        this.animation(600, 12, "standing");
    }
    run(){
        this.animation(700, 14, "run");
    }
    jump(){
        this.animation(1000, 20, "jump");
    }
    animation(width, numberOfFrames, action){
        this.frameIndex = 0;
        this.width = width;
        this.numberOfFrames = numberOfFrames;
        this.direction(this.currentDirection, action);
    }
    direction(dir, action){
        this.currentDirection = dir;
        this.currentDirection === "right" ? this.status = action + "Right" : this.status = action + "Left"
    }
}

class Move extends Motion {
    speed: number;
    isMoving: boolean;
    constructor(){
        super();
        this.speed = 2;
        this.isMoving = false;
    }
    stop(){
        this.isMoving = false;
    }
    up(){
        this.isMoving = true;
        this.moveY-=this.speed;
    }
    down(){
        this.isMoving = true;
        this.moveY+=this.speed;
    }
    right(){
        super.direction("right", "run");
        this.isMoving = true;
        this.moveX+=this.speed;
    }
    left(){
        super.direction("left", "run");
        this.isMoving = true;
        this.moveX-=this.speed;
    }
}

class Control extends Move {
    input: Object;
    keyMap: Object;
    isActing: boolean;
    isOnceKeyDown: boolean;
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
        this.isActing = false;
        this.isOnceKeyDown = false;
        this.keySet();
        this.moveDispatcher();
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
    moveDispatcher(){
        this.keyHandler = window.requestAnimationFrame( ()=>this.moveDispatcher() );
        if(this.keyMap["right"]) this["right"]();
        if(this.keyMap["left"]) this["left"]();
        if(this.keyMap["up"]) this["up"]();
        if(this.keyMap["down"]) this["down"]();
        for(var k in this.keyMap){
            if(this.keyMap[k]){
                if(this.isMoving && !this.isActing){//이동하는데 동작이 움직이는게 아닐경우
                    this.isActing =true;
                    this.run();
                }
                return;
            }
        }
        if(this.isActing){
            this.isActing = false; //이동중이 아닌데 동작이 움직일 경우
            this.standing();
        }
        this.stop();
    }
}

var char = new Control();
char.image.addEventListener("load",()=> char.loop() ); //렌더링 루프 시작


