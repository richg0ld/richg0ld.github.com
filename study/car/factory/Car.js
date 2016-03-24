var Car = (function(){
    function Car(name, frame, enigne, frontWheel, backWheel, skin, frontGlass, sideGlass,light){//자동차 공장
        var _this = this;
        
        this.version = "1.2.0" 
        this.name = name; //차량 고유 이름
        this.speed = 0; // 초기 속도값
        this.isBoost = false; //부스트 상태
        this.frame = frame; //골격
        this.skin = skin; //겉면
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
        })(this.name);
        
        this.sensor(); //에러를 캐치하는 센서 실행;
    }
    Car.prototype.speedUp = function (value){
        value < 0 ? value = 0 : value;
        value >= 0 ? this.speed+=value : ++this.speed;
        this.engine.movement(this.speed);//엔진에서 속도 값을받음.
        this.backWheel.rotate(this.engine.horsePower); //개념을 다시 생각해보니 동력이 결국 앞바퀴 뒷바퀴 다 전달 되는게 맞는거 같음 그래서 각각 전달 하는걸로 변경
        this.frontWheel.rotate(this.engine.horsePower); //사실 지금 속도 조절하는 모든 기능들은 중앙 제어 센서 같은걸 만들어서 해야 하지만 .. 그런거 까지하면 끝도없음.. 여튼 정확하게 하려면 중앙 관리 프로세스도 만들어서 바퀴나 엔진 관련 된건 거기서 컨트롤 하게 하는게 맞는거 같음.
        this.dashboard();//계기판에 상태 표시
    }
    Car.prototype.speedDown = function (value){
        value < 0 ? value = 0 : value;
        value >= 0 ? this.speed-=value : this.speed--;
        this.speed < 0 ? this.speed = 0 : this.speed;
        this.engine.movement(this.speed);
        this.backWheel.rotate(this.engine.horsePower);
        this.frontWheel.rotate(this.engine.horsePower);
        this.dashboard();
    }
    Car.prototype.changeSpeed = function (value){
        value ? this.speed += value : this.speed;
        this.speed < 0 ? this.speed = 0 : this.speed;
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
            _this.engine.movement(_this.speed);
            _this.backWheel.rotate(_this.engine.horsePower);
            _this.frontWheel.rotate(_this.engine.horsePower); 
            console.log("부스트 해제 / " + _this.speed)
            _this.isBoost = false;
        }, 3000);
        this.engine.movement(this.speed);
        this.backWheel.rotate(this.engine.horsePower);
        this.frontWheel.rotate(this.engine.horsePower); 
        console.log("부스트 온!!!!!! / " + this.speed);
        this.dashboard();
    }
    Car.prototype.sensor = function(){ //부품에 문제가 있는지 체크
        var _this = this;
        var engineSensor = setInterval(function(){ //0.05초당 엔진에 에러가 있는지 체크
            if(_this.engine.error){//엔진에 문제 있으면 멈춤
                console.error(_this.engine.error);
                clearInterval(engineSensor);
                _this.speed = 0;
                _this.changeSpeed(0);
            }
        },50);
    }
    Car.prototype.dashboard = function(){ //계기판
        console.log("현재 속도 :", this.speed);
        console.log("바퀴가 한바퀴 도는데 걸리는 시간(초) :", this.backWheel.rotatePerSec);
        console.log("0.016초당 이동하는 거리 :", this.backWheel.bgMoveVal);
    }
    return Car;
})();
