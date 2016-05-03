declare let Modernizr;

(()=> {
    return Modernizr.canvas;
})();

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.style.border = "1px solid black";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
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
    vectorX: number;
    vectorY: number;
    elasticity: number;
    rotate: number;

    constructor(options: any){
        this.name = options.name || "obj";
        this.radius = options.radius || 30;
        this.x = canvas.width * Math.random();
        this.y = -canvas.width * Math.random()*20;
        this.weight = this.radius *0.5;
        this.color = options.weight || "red";
        this.rotate = 0;
        this.vectorX = 0;
        this.vectorY = 0;
        this.elasticity = 0.6 + (1/this.weight); //탄성
    }
}

class Gravity {
    gravity: number;
    wind: number;
    friction: number;
    constructor(){
        this.gravity = 0.9; //중력
        this.friction = 0.01; //마찰력
        this.wind = 0; //바람
    }
}

class Display extends Gravity {
    objs: any;
    constructor(object){
        super();
        this.objs = object;
        this.render(()=>{
            this.clear();
            this.objHit(this.objs);
            for(let n=0;n<this.objs.length;n++){
                this.sideHit(this.objs[n]);
                this.bottomHit(this.objs[n]);
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
        obj.vectorX = obj.vectorX + (obj.vectorY*this.friction) + this.wind;
        obj.vectorY = obj.vectorY + (obj.vectorY*this.friction) + this.gravity;
        console.log(obj.vectorY);
        obj.x += obj.vectorX;
        obj.y += obj.vectorY;
        obj.rotate += (Math.PI / 180)*obj.vectorX;
    }
    bottomHit(obj){
        if(obj.y >= canvas.height - obj.radius){
            obj.y = canvas.height - obj.radius;
            obj.vectorY = -(obj.vectorY * obj.elasticity);//바닥에 도착했을 때 현재 중력 가속도를 반대 방향으로 탄성만큼 곺한 값으로 바꿔주고 다시 렌더링에서 값을 양의 숫자쪽으로 증가시킨다.
        }
    }
    sideHit(obj){
        if(obj.x >= canvas.width - obj.radius){
            obj.x = canvas.width - obj.radius;
            obj.vectorX = -(obj.vectorX * obj.elasticity);
        }else if(obj.x <= obj.radius){
            obj.x = obj.radius;
            obj.vectorX = -(obj.vectorX * obj.elasticity);
        }
    }
    objHit(objs){
        let self, target;
        const isCrash = (self, target) =>{//충돌여부
            let diffX = target.x - self.x;
            let diffY = target.y - self.y;
            let attachedDistance = target.radius + self.radius;
            let currentDistance = Math.sqrt(diffX * diffX + diffY * diffY);
            return currentDistance <= attachedDistance;
        };
        const objCrash = (self, target) =>{// 여기 부분을 잘 모르겠음.. 다시 봐야겠다

            let collidVx = target.x - self.x;
            let collidVy = target.y - self.y;
            let distance = Math.sqrt( collidVx * collidVx + collidVy * collidVy );
            let unitCollideVx = collidVx / distance;
            let unitCollideVy = collidVy / distance;

            let beforeBall1Vp = unitCollideVx *  self.vectorX + unitCollideVy * self.vectorY;
            let beforeBall1Vn = -unitCollideVy *  self.vectorX + unitCollideVx * self.vectorY;
            let beforeBall2Vp = unitCollideVx *  target.vectorX + unitCollideVy * target.vectorY;
            let beforeBall2Vn = -unitCollideVy *  target.vectorX + unitCollideVx * target.vectorY;

            if( beforeBall1Vp - beforeBall2Vp <= 0 ) return;

            let afterBall1Vp = beforeBall1Vp + self.elasticity * ( beforeBall2Vp - beforeBall1Vp ) * target.radius / ( self.radius + target.radius ) ;
            let afterBall2Vp = beforeBall2Vp + self.elasticity * ( beforeBall1Vp - beforeBall2Vp ) * self.radius / ( self.radius + target.radius ) * self.elasticity;

            self.vectorX = afterBall1Vp*unitCollideVx - beforeBall1Vn*unitCollideVy;
            self.vectorY = afterBall1Vp*unitCollideVy + beforeBall1Vn*unitCollideVx;
            target.vectorX = afterBall2Vp*unitCollideVx - beforeBall2Vn*unitCollideVy;
            target.vectorY = afterBall2Vp*unitCollideVy + beforeBall2Vn*unitCollideVx;
        };
        for(let i=0; i<num; i++){
            self = objs[i];
            for(let j=i+1; j<num; j++){
                target = objs[j];
                if(isCrash(self, target)){
                    objCrash(self, target);
                }
            }
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
let num = 25;
let objs = [];
for(let n=0; n<num; n++){ //오브젝트들을 생성하여 objs 배열에 push 함
    objs.push(new Ball({
        name: "BALL"+n,
        radius: 60*Math.random()+10
    }));
}
let d = new Display(objs);

