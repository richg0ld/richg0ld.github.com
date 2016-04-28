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
        this.name = options.name || "obj";
        this.radius = options.radius || 30;
        this.x = canvas.width/2;
        this.y = canvas.height/2;
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
    obj: any;
    constructor(object){
        super();
        this.obj = object;
        this.render(()=>{
            this.clear();
            this.draw();
            this.update();
        });
    }
    draw(){
        let gradient = context.createLinearGradient(0, 0, this.obj.radius*2, this.obj.radius*2);
        gradient.addColorStop(0, "magenta");
        gradient.addColorStop(0.5, "blue");
        gradient.addColorStop(1.0, "red");

        context.save();
        context.translate(this.obj.x, this.obj.y);//기준점 변경
        context.rotate(this.obj.rotate);
        context.beginPath();
        context.arc(0, 0, this.obj.radius, 0, 2*Math.PI);
        context.fillStyle = gradient;
        context.fill();
        context.stroke();
        context.closePath();
        context.restore();
    }
    update(){
        this.obj.gravitySpeed += this.gravity;
        this.obj.windSpeed += this.wind;
        this.obj.x += this.obj.speedX + this.obj.windSpeed;
        this.obj.y += this.obj.speedY + this.obj.gravitySpeed;
        this.sideHit();
        this.bottomHit();
        this.obj.rotate += (Math.PI / 180)*this.obj.windSpeed;
    }
    bottomHit(){
        if(this.obj.y >= canvas.height - this.obj.radius){
            this.obj.y = canvas.height - this.obj.radius;
            this.obj.gravitySpeed = -(this.obj.gravitySpeed * this.obj.bounce);//바닥에 도착했을 때 현재 중력 가속도를 반대 방향으로 탄성만큼 곺한 값으로 바꿔주고 다시 렌더링에서 값을 양의 숫자쪽으로 증가시킨다.
        }
    }
    sideHit(){
        if(this.obj.x >= canvas.width - this.obj.radius){
            this.obj.x = canvas.width - this.obj.radius;
            this.obj.windSpeed = -(this.obj.windSpeed * this.obj.bounce);
        }else if(this.obj.x <= this.obj.radius){
            this.obj.x = this.obj.radius;
            this.obj.windSpeed = -(this.obj.windSpeed * this.obj.bounce);
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

let obj = new Ball({});
let d = new Display(obj);

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
    let gn = 0;
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

