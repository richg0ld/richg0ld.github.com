declare let Modernizr;

(()=> {
    return Modernizr.canvas;
})();

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.style.border = "1px solid black";
canvas.width = 500;
canvas.height = 800;
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

canvas.style.width = "100%";

class Ball {
    name: string;
    radius: number;
    x: number;
    y: number;
    weight: number;
    color: string;
    speedX: number;
    speedY: number;
    gravitySpeed: number;
    windSpeed: number;
    bounce: number;
    rotate: number;

    constructor(options: any){
        let randomX = Math.random();
        let randomY = Math.random();

        this.name = options.name || "obj";
        this.radius = options.radius || 30;
        this.x = canvas.width * Math.random();
        this.y = -canvas.width * Math.random()*20;
        this.weight = options.weight || 10;
        this.color = options.weight || "red";
        this.rotate = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.gravitySpeed = 0; //중력 가속도
        this.windSpeed = 0;
        this.bounce = 0.6; //탄성
    }
}

class Gravity {
    gravity: number;
    wind: number;
    constructor(){
        this.gravity = 0.9; //중력
        this.wind = 0; //바람
    }
    accelerate(){
        this.gravity = -0.05;
    }
}

class Display extends Gravity {
    objs: any;
    constructor(object){
        super();
        this.objs = object;
        for(var n=0;n<this.objs.length;n++){
            this.draw(this.objs[n]);
        }

        this.render(()=>{
            this.clear();
            for(var n=0;n<this.objs.length;n++){
                this.draw(this.objs[n]);
                this.update(this.objs[n]);
            }
        });
    }
    draw(obj){
        let gradient = context.createLinearGradient(0, 0, obj.radius*2, obj.radius*2);
        gradient.addColorStop(0, "magenta");
        gradient.addColorStop(0.5, "blue");
        gradient.addColorStop(1.0, "red");

        context.save();
        context.translate(obj.x, obj.y);//기준점 변경
        context.rotate(obj.rotate);
        context.beginPath();
        context.arc(0, 0, obj.radius, 0, 2*Math.PI);
        context.fillStyle = gradient;
        context.fill();
        context.stroke();
        context.closePath();
        context.restore();
    }
    update(obj){
        obj.gravitySpeed += this.gravity;
        obj.windSpeed += this.wind;
        obj.x += obj.speedX + obj.windSpeed;
        obj.y += obj.speedY + obj.gravitySpeed;
        this.sideHit(obj);
        this.bottomHit(obj);
        obj.rotate += (Math.PI / 180)*obj.windSpeed;
    }
    bottomHit(obj){
        if(obj.y >= canvas.height - obj.radius){
            obj.y = canvas.height - obj.radius;
            obj.gravitySpeed = -(obj.gravitySpeed * obj.bounce);//바닥에 도착했을 때 현재 중력 가속도를 반대 방향으로 탄성만큼 곺한 값으로 바꿔주고 다시 렌더링에서 값을 양의 숫자쪽으로 증가시킨다.
        }
    }
    sideHit(obj){
        if(obj.x >= canvas.width - obj.radius){
            obj.x = canvas.width - obj.radius;
            obj.windSpeed = -(obj.windSpeed * obj.bounce);
        }else if(obj.x <= obj.radius){
            obj.x = obj.radius;
            obj.windSpeed = -(obj.windSpeed * obj.bounce);
        }
    }
    clear(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    render(func){
        window.requestAnimationFrame(()=> this.render(func));
        func();
    }
}
let num = 30;
let objs = [];
for(let n=0; n<num; n++){ //오브젝트들을 생성하여 objs 배열에 push 함
    objs.push(new Ball({
        radius: 60*Math.random()+10
    }));
}
let d = new Display(objs);

const Controller = (() =>{
    const w:any = document.getElementById("wind");
    const wVal:any = document.getElementById("wind_val");
    const wBtn:any = document.getElementById("wind_btn");
    let wn = 0;
    w.addEventListener("input", ()=>{
        wn = parseFloat( (w.value*0.1).toFixed(1) );
        wVal.innerHTML = wn
    });
    wBtn.addEventListener("click", ()=>{
        d.wind = wn;
    });

    const g:any = document.getElementById("gravity");
    const gVal:any = document.getElementById("gravity_val");
    const gBtn:any = document.getElementById("gravity_btn");
    let gn = 0.9;
    g.addEventListener("input", ()=>{
        gn = parseFloat( (g.value*0.1).toFixed(1) );
        gVal.innerHTML = gn
    });
    gBtn.addEventListener("click", ()=>{
        d.gravity = gn;
    });

    canvas.addEventListener("mousedown", ()=> d.gravity = -gn );
    canvas.addEventListener("mouseup", ()=> d.gravity = gn );

    canvas.addEventListener("touchstart", ()=> d.gravity = -gn );
    canvas.addEventListener("touchend", ()=> d.gravity = gn );
})();

