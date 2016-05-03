/**
 * Created by jhkim88 on 2016-04-21.
 */
declare let Modernizr;


(()=> {
    return Modernizr.canvas;
})();

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Obj { //네모 오브젝트 클래스
    name:string;
    x: number;
    y: number;
    size: number;
    color: string;
    speedX:number;
    speedY:number;
    constructor(options){
        this.name = options.name || "통"; //오브젝트 이름
        this.x = Math.floor(Math.random()*200); //x좌표 값
        this.y = Math.floor(Math.random()*200); //y좌표 값
        this.size = Math.floor(Math.random() * 10 + 7); //오브젝트 사이즈
        this.color = options.color || "white"; //오브젝트 칼라
        this.speedX = options.speed || 2; //오브젝트 움직임 속도 X
        this.speedY = options.speed || 2; //오브젝트 움직임 속도 Y
        this.draw(); //처음 화면에 한번 그리기
    }
    draw(){// x,y 좌표와 크기값에 맞춰 그리기
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x,this.y, this.size, this.size);
        context.closePath();
    }
    update(){ // x,y 좌표갑 갱신
        this.x = this.x + this.speedX;
        this.y = this.y + this.speedY;
    }
}

let num = 25; //오브젝트 개수
let objs = []; //오브젝트 들이 들어갈 배열
for(let n=0; n<num; n++){ //오브젝트들을 생성하여 objs 배열에 push 함
    objs.push(new Obj({name: "obj"+n, speed:3}));
}
const Render = func => { //렌더링 함수 (애니메이션 요청 함수)
    window.requestAnimationFrame(()=> Render(func) );//애니메이션 요청
    func();//콜백함수
};
const Clear =()=> { //화면 지우기 (기존에 검은색이였으니 지우고검은색으로 채우기)
    context.clearRect( 0, 0, canvas.width, canvas.height );
    context.fillStyle = 'black';
    context.fillRect( 0, 0, canvas.width, canvas.height );
};
const Draw =()=> { //그리기 함수. 
    for(let i=0; i<num; i++){//objs 배열의 모든 오브젝트 draw 메소드를 실행하여 그림
        objs[i].draw();
    }
};
const Update =()=> {// 업데이트 함수
    for(let i=0; i<num; i++){// objs 배열의 모든 오브젝트 update 메소드를 실행
        objs[i].update();
    }
};

const wallHit =()=> {//벽에 부딧힘 처리 함수
    for(let i=0; i<num; i++){//모든 오브젝트를 체크
        if(objs[i].x < 0){ objs[i].speedX = Math.abs(objs[i].speedX); } //obj의 왼쪽 면이 x좌표값의 0보다 작으면(왼쪽 벽에 부딧히면) speedX 프로퍼티 값을 양수로
        else if(objs[i].x > canvas.width - objs[i].size){  objs[i].speedX = -Math.abs(objs[i].speedX); } //obj의 x좌표값이 캔버스 크기에서 obj의 너비 값을 뺀 것 보다 크면(obj 오른쪽 면이 오른쪽 벽에 부딧히면) speedX 프로퍼티 값을 음수로
        if(objs[i].y < 0){ objs[i].speedY = Math.abs(objs[i].speedY); } //마찬가지
        else if(objs[i].y > canvas.height - objs[i].size){ objs[i].speedY = -Math.abs(objs[i].speedY); } //마찬가지
    }
};
const isCrash =(self, target)=>{ //obj 끼리 부딧혔는지 체크
    let maxX = self.x + self.size;
    let minX = self.x - target.size;
    let maxY = self.y + self.size;
    let minY = self.y - target.size;
    if(target.x <= maxX && target.x >= minX){
        if(target.y <= maxY && target.y >= minY){
            return true;
        }
    }
};

const objCrash =(self, target)=> {//obj 충돌이 생기면 실행할 함수. 자신obj 와 타켓obj의 방향 값을 반대로 바꾼다
    let diffX = Math.abs(target.x - self.x);
    let diffY = Math.abs(target.y - self.y);
    if(diffX > diffY){
        self.speedX = -self.speedX;
        target.speedX = -target.speedX;
    }else if(diffX < diffY){
        self.speedY = -self.speedY;
        target.speedY = -target.speedY;
    }
    else if(diffX === diffY){
        self.speedX = -self.speedX;
        self.speedY = -self.speedY;
        target.speedX = -target.speedX;
        target.speedY = -target.speedY;
    }
};
const objChk =()=> {// 모든 오브젝트 체크
    let self, target;
    for(let i=0; i<num; i++){
        self = objs[i];
        for(let j=i+1; j<num; j++){
            target = objs[j];
            if(isCrash(self, target)){
                objCrash(self, target);
            }
        }
    }
};
const objOverlap =(self, target)=> {// 오브젝트 겹침 방지
    self.x = self.x + target.x;
    self.y = self.y + target.y;
};

const wallOverlap = self =>{ //벽쪽에 겹쳐서 나오지 못할 경우
    if(self.x < 0){ return self.x = 0; }
    else if(self.x > canvas.width - self.size){ return self.x = canvas.width - self.size }
    if(self.y < 0){ return self.y = 0; }
    else if(self.y > canvas.width - self.size){ return self.y = canvas.width - self.size }
};
const chkOverlap =()=>{ //겹침 체크
    let self, target;
    for(let i=0; i<num; i++){
        self = objs[i];
        for(let j=i+1; j<num; j++){
            target = objs[j];
            if(isCrash(self, target)){
                objOverlap(self, target);
                wallOverlap(self);
                chkOverlap();
            }
        }
    }
};

chkOverlap();
Render(()=>{
    Clear();
    Draw();
    wallHit();
    objChk();
    Update();
});
