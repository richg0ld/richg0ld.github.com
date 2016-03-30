var FuelTank = (function(){
    var consumePerSec; //초당 연료 소모를 내부적으론 공유하되 밖에서는 건들지 못하게..
    function FuelTank(fuel){ // 연료탱크
        var _this = this

        this.fuel = fuel || "gasoline";
        this.volume = 500;//연료양
        this.Consumption = 0;
        this.visual = (function(f){ // 연료탱크 모양
            var ft = document.createElement("div");
            ft.setAttribute("class","fuelTank");
            ft.innerHTML = _this.volume;
            ft.style.textAlign = "center";
            ft.style.color = "white"
            ft.style.fontSize = "14px"
            ft.style.lineHeight = "50px"
            ft.style.width = "120px",
            ft.style.height = "50px";
            ft.style.borderRadius = "35px"
            ft.style.backgroundColor = "gray";
            ft.style.opacity = "0.3";
            return ft;
        })(this.fuel)

        this.status();// 연료탱크 상태를 실행 시킴
    }
    FuelTank.prototype.supply = function(engine, gainEnergy, speed){// 연료 공급
        var _this = this;
        this.consume(speed); //공급 초기에 바로 소비
        engine[gainEnergy](this.Consumption); // 엔진인자의 에너지얻기 메소드에 소모되는 연료를 전달
        consumePerSec ? clearInterval(consumePerSec) : ""; //**첫 실행시에는 인터벌을 초기화 할핑요 없이 아래 인터벌을 실행, 이후로 연료공급 함수가 실행될 때는 기존의 인터벌을 종료하고
        consumePerSec = setInterval(function(){//**다시 인터벌을 실행한다.(consumePerSec 변수 선언은 맨~ 위에 있음.)
            _this.consume(speed);
        },1000);
    }
    FuelTank.prototype.consume = function(speed){//스피드에 따라 연료 소모량이 다름.
        if( speed >=1 &&speed < 50 ){
            this.Consumption = 1
        }else if( speed >= 50 && speed < 100){
            this.Consumption = 2
        }else if( speed >= 100 && speed < 150){
            this.Consumption = 4
        }else if( speed >= 150 ){
            this.Consumption = 16
        }else{
            this.Consumption = 0
        }
        this.volume-=this.Consumption;
    }
    FuelTank.prototype.status = function(){//연료 탱크 상태를 매0.1초 때마 확인 함 
        var _this = this;
        var checking = setInterval(function(){
            if(_this.volume <= 0){
                _this.volume = 0;
                _this.error = "연료부족" 
            }else{
                _this.error = undefined;//연료가 있으면 오류 제거
            }
            _this.visual.innerHTML = _this.volume;//확인된 연료 값을 뿌려줌
        },100);

    }
    return FuelTank;
})()
