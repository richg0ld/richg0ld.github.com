var Car = (function(){
    function Car(name, frame, enigne, frontWheel, backWheel, skin, frontGlass, sideGlass,light, fuelTank){//자동차 공장
        var _this = this;
        
        this.version = "1.4.0" 
        this.name = name; //차량 고유 이름
        this.speed = 0; // 초기 속도값
        this.isBoost = false; //부스트 상태
        this.frame = frame; //골격
        this.skin = skin; //겉면
        this.fuelTank = fuelTank //연료탱크
        this.engine = enigne; //엔진
        this.backWheel = backWheel; //뒷바퀴
        this.frontWheel = frontWheel; //앞바퀴
        this.frontGlass = frontGlass; //앞유리
        this.sideGlass = sideGlass; //옆유리
        this.light = light; //상향등
        
        var assembly = (function(name){//조립
            var car = document.createElement("div");
            car.setAttribute("id",name);
            
            document.body.appendChild(car);
            car.appendChild(_this.frame.shaped);
            car.style.position = "absolute"
            
            for ( k in _this){
                if(_this[k].visual){
                    car.appendChild(_this[k].visual);
                    _this[k].visual.style.position = "absolute"
                }
            }
            
            _this.skin.visual.style.left = 0;            _this.skin.visual.style.top = 0;
            _this.engine.visual.style.left = "30px";            _this.engine.visual.style.top = "60px";
            _this.backWheel.visual.style.left = "30px";            _this.backWheel.visual.style.top = "160px";
            _this.frontWheel.visual.style.left = "300px";            _this.frontWheel.visual.style.top = "160px";
            _this.frontGlass.visual.style.left = "330px";            _this.frontGlass.visual.style.top = "20px";
            _this.sideGlass.visual.style.left = "220px";            _this.sideGlass.visual.style.top = "20px";
            _this.light.visual.style.left = "380px";            _this.light.visual.style.top = "150px";
            _this.fuelTank.visual.style.left = "160px";            _this.fuelTank.visual.style.top = "140px";
        })(this.name);
        
        this.sensor(); //에러를 캐치하는 센서 실행;
    }
    Car.prototype.speedUp = function (value){
        value < 0 ? value = 0 : value;
        value >= 0 ? this.speed+=value : ++this.speed;
        this.fuelTank.supply(this.engine, "gainEnergy", this.speed); //연료탱크의 공급소에서 엔진에 에너지로 스피드 값에 알맞는 연료 주입
        this.engine.movement(this.speed);//엔진에서 속도 값을받음.
        this.backWheel.rotate(this.engine.horsePower); //개념을 다시 생각해보니 동력이 결국 앞바퀴 뒷바퀴 다 전달 되는게 맞는거 같음 그래서 각각 전달 하는걸로 변경
        this.frontWheel.rotate(this.engine.horsePower); //사실 지금 속도 조절하는 모든 기능들은 중앙 제어 센서 같은걸 만들어서 해야 하지만 .. 그런거 까지하면 끝도없음.. 여튼 정확하게 하려면 중앙 관리 프로세스도 만들어서 바퀴나 엔진 관련 된건 거기서 컨트롤 하게 하는게 맞는거 같음.
        this.dashboard();//계기판에 상태 표시
    }
    Car.prototype.speedDown = function (value){
        value < 0 ? value = 0 : value;
        value >= 0 ? this.speed-=value : this.speed--;
        this.speed < 0 ? this.speed = 0 : this.speed;
        this.fuelTank.supply(this.engine, "gainEnergy", this.speed);
        this.engine.movement(this.speed);
        this.backWheel.rotate(this.engine.horsePower);
        this.frontWheel.rotate(this.engine.horsePower);
        this.dashboard();
    }
    Car.prototype.changeSpeed = function (value){
        value ? this.speed += value : this.speed;
        this.speed < 0 ? this.speed = 0 : this.speed;
        this.fuelTank.supply(this.engine, "gainEnergy", this.speed);
        this.engine.movement(this.speed);
        this.backWheel.rotate(this.engine.horsePower);
        this.frontWheel.rotate(this.engine.horsePower);
        this.dashboard();
    }
    Car.prototype.boost = function(){
        
        var _this = this;
        if(this.isBoost === true) return;
        
        this.isBoost = true;
        this.speed = Math.pow(this.speed,2); // 제곱근
        setTimeout(function(){
            _this.speed = Math.sqrt(_this.speed); //루트
            _this.fuelTank.supply(_this.engine, "gainEnergy", _this.speed);
            _this.engine.movement(_this.speed);
            _this.backWheel.rotate(_this.engine.horsePower);
            _this.frontWheel.rotate(_this.engine.horsePower); 
            console.warn("부스트 해제 / " + _this.speed)
            _this.isBoost = false;
        }, 3000);
        this.fuelTank.supply(this.engine, "gainEnergy", this.speed);
        this.engine.movement(this.speed);
        this.backWheel.rotate(this.engine.horsePower);
        this.frontWheel.rotate(this.engine.horsePower); 
        console.warn("부스트 온!!!!!! / " + this.speed);
        this.dashboard();
    }
    Car.prototype.sensor = function(){ //부품에 문제가 있는지 체크
        var _this = this;
        var fuelSensor = setInterval(function(){//연료량체크
            if(_this.fuelTank.error){
                console.error("센서알림 :", _this.fuelTank.error);
                _this.fuelTank.supply(_this.engine, "gainEnergy", 0);
                _this.engine.movement(0);
                _this.speed = 0;
                _this.backWheel.rotate(0);
                _this.frontWheel.rotate(0);
            }
        }, 50);
        var engineSensor = setInterval(function(){ //0.05초당 엔진에 에러가 있는지 체크
            if(_this.engine.error){//엔진에 문제 있으면 멈춤
                console.error("센서알림 :", _this.engine.error);
                clearInterval(engineSensor);
                _this.speed = NaN;
                _this.backWheel.rotate(0);
                _this.frontWheel.rotate(0);
                for (k in _this){
                    if(typeof _this[k] === "object" && k !== "frame") _this.explosion(k); //차 폭팔!!
                }
            }
        },50);
    }
    Car.prototype.dashboard = function(){ //계기판
        console.log("현재 속도 :", this.speed);
        console.log("바퀴가 한바퀴 도는데 걸리는 시간(초) :", this.backWheel.rotatePerSec);
        console.log("0.016초당 이동하는 거리 :", this.backWheel.bgMoveVal);
    }
    Car.prototype.addFuel = function(){//연료 주입 (자기자신이 자가로 연료를 주입하고있다.. 이 역시 이상하지만 넣었다.)
        this.fuelTank.volume+=100
    }
    Car.prototype.explosion = function(component){ //폭발 .. 차량 폭파를 프로토타입 기능으로 넣는게 약간 이상하긴 하다..
        var _this = this;
        var p={ //현재의 구성품 위치값을 p객체에 저장
            left:parseInt(this[component].visual.style.left),
            top:parseInt(this[component].visual.style.top)
        }
        var d={ //날아갈 방향 초기값 d객체 생성
            left:0,
            top:0
        }
        
        for ( k in d ){ // d 객체 값을 랜덤으로 지정
            var r = Math.floor(Math.random()*10);
            if(r === 0){
                d[k] = 0 //원래 그 자리
            }else if( r >= 1 && r < 5 ){
                d[k] = -10 // 위 또는 왼쪽 방향
            }else if(r >= 5 && r < 10){
                d[k] = 10 // 아래 또는 오른쪽 방향
            }
        }
        
        var explosing = setInterval(function(){ //0.001초당 각 방향으로 10씩 움직인다.
            _this[component].visual.style.left = (p.left+=d.left)+"px" ; 
            _this[component].visual.style.top = (p.top+=d.top)+"px" ;
        },1)
        
        setTimeout(function(){//그러다 0.1초후 멈춘다.
            clearInterval(explosing);
        },100);
    }
    return Car;
})();
