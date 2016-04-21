/**
 * Created by jhkim88 on 2016-04-21.
 */
declare let Modernizr;


function canvasSupport () {
    return Modernizr.canvas;
}

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 300;

class Obj {
    name:string;
    x: number;
    y: number;
    textWidth: number;
    textHeight: number;
    speedX:number;
    speedY:number;
    constructor(options){
        this.name = options.name || "통";
        this.x = Math.random()*200;
        this.y = Math.random()*200;
        this.textWidth = 0;
        this.textHeight = 0;
        this.speedX = options.speed || 2;
        this.speedY = options.speed || 2;
    }
    draw(){
        context.beginPath();
        context.font="30px Verdana";
        context.fillStyle = "white";
        context.textBaseline = 'top';
        context.fillText(this.name,this.x,this.y);
        this.textWidth = context.measureText(this.name).width;
        this.textHeight = 30;
        context.closePath();
    }
    update(){
        this.wallHit();
        this.x = this.x + this.speedX;
        this.y = this.y + this.speedY;
    }
    hit(){

    }
    wallHit(){
        if(this.x < 0){
            this.speedX = Math.abs(this.speedX);
        }else if(this.x > canvas.width - this.textWidth){
            this.speedX = -this.speedX;
        }
        if(this.y < 0){
            this.speedY = Math.abs(this.speedY);
        }else if(this.y > canvas.height - this.textHeight){
            this.speedY = -this.speedY;
        }
    }
}
let num = 10;
let objs = [];
for(var n=0; n<num; n++){
    objs.push(new Obj({name: "obj"+n, speed:3}));
}

const Render = (func) => {
    window.requestAnimationFrame(()=> Render(func) );//애니메이션 요청
    func();
};
const Clear =()=> {
    context.clearRect( 0, 0, canvas.width, canvas.height );
    context.fillStyle = 'black';
    context.fillRect( 0, 0, canvas.width, canvas.height );
};
const Draw =()=> {
    for(var i=0; i<num; i++){
        objs[i].draw();
    }
};
const Update =()=> {
    for(var j=0; j<num; j++){
        objs[j].update();
    }
};
canvasSupport();
Render(function(){
    Clear();
    Draw();
    Update();
    console.log(objs[0].x, objs[0].y)
});

