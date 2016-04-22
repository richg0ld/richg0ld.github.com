/**
 * Created by jhkim88 on 2016-04-21.
 */
declare let Modernizr;


(()=> {
    return Modernizr.canvas;
})();

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 300;

class Obj {
    name:string;
    x: number;
    y: number;
    size: number;
    textWidth: number;
    textHeight: number;
    speedX:number;
    speedY:number;
    constructor(options){
        this.name = options.name || "통";
        this.x = Math.random()*200;
        this.y = Math.random()*200;
        this.size = Math.random() * 10 + 7;
        this.textWidth = 0;
        this.textHeight = 0;
        this.speedX = options.speed || 2;
        this.speedY = options.speed || 2;
        this.draw();
    }
    draw(){
        context.beginPath();
        context.fillStyle = "white";
        context.fillRect(this.x,this.y, this.size, this.size);
        context.closePath();

        // context.beginPath();
        // context.font="30px Verdana";
        // context.fillStyle = "white";
        // context.textBaseline = 'top';
        // context.fillText(this.name,this.x,this.y);
        // context.closePath();
        // this.textWidth = Math.round(context.measureText(this.name).width);
        // this.textHeight = 30;
    }
    update(){
        this.x = this.x + this.speedX;
        this.y = this.y + this.speedY;
    }
}

let num = 25;
let objs = [];
for(let n=0; n<num; n++){
    objs.push(new Obj({name: "obj"+n, speed:3}));
}

const Render = func => {
    window.requestAnimationFrame(()=> Render(func) );//애니메이션 요청
    func();
};
const Clear =()=> {
    context.clearRect( 0, 0, canvas.width, canvas.height );
    context.fillStyle = 'black';
    context.fillRect( 0, 0, canvas.width, canvas.height );
};
const Draw =()=> {
    for(let i=0; i<num; i++){
        objs[i].draw();
    }
};
const Update =()=> {
    for(let i=0; i<num; i++){
        objs[i].update();
    }
};

const wallHit =()=> {
    for(let i=0; i<num; i++){
        if(objs[i].x < 0){ objs[i].speedX = Math.abs(objs[i].speedX); }
        else if(objs[i].x > canvas.width - objs[i].size){  objs[i].speedX = -Math.abs(objs[i].speedX); }
        if(objs[i].y < 0){ objs[i].speedY = Math.abs(objs[i].speedY); }
        else if(objs[i].y > canvas.height - objs[i].size){ objs[i].speedY = -Math.abs(objs[i].speedY); }
    }
};
const isCrash =(self, target)=>{
    let diffX = target.x - self.x;
    let diffY = target.y - self.y;
    return self.size > Math.sqrt(diffX*diffX + diffY*diffY)
};

const objCrash =(self, target)=> {
        self.speedX = -self.speedX;
        self.speedY = -self.speedY;
        target.speedX = -target.speedX;
        target.speedY = -target.speedY;
};
const objHit =()=> {
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
const objOverlap =(self, target)=> {
    self.x = self.x + target.x;
    self.y = self.y + target.y;
};

const wallOverlap = self =>{
    if(self.x < 0){ return self.x = 0; }
    else if(self.x > canvas.width - self.size){ return self.x = canvas.width - self.size }
    if(self.y < 0){ return self.y = 0; }
    else if(self.y > canvas.width - self.size){ return self.y = canvas.width - self.size }
};
const chkOverlap =()=>{
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
    objHit();
    Update();
});

