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
        this.bounce = 0.6; //탄성
    }
}

class Gravity {
    gravity: number;
    constructor(){
        this.gravity = 0.09; //중력
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
        this.obj.x += this.obj.speedX;
        this.obj.y += this.obj.speedY + this.obj.gravitySpeed;
        this.bottomHit();
        this.obj.rotate += Math.PI / 180;
    }
    bottomHit(){
        if(this.obj.y >= canvas.height - this.obj.radius){
            this.obj.y = canvas.height - this.obj.radius;
            this.obj.gravitySpeed = -(this.obj.gravitySpeed * this.obj.bounce);//바닥에 도착했을 때 현재 중력 가속도를 반대 방향으로 탄성만큼 곺한 값으로 바꿔주고 다시 렌더링에서 값을 양의 숫자쪽으로 증가시킨다.
        }
    }
    clear(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    };
    render(func){
        window.requestAnimationFrame(()=> this.render(func));
        func();
    }
}



let obj = new Ball({});
let d = new Display(obj);

canvas.addEventListener("mousedown", ()=> d.gravity = -0.18 );
canvas.addEventListener("mouseup", ()=> d.gravity = 0.18 );