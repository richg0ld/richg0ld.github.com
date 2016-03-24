var Engine = (function(){//엔진 공장
    var cnt = 0;
    function Engine(){
        this.serial = cnt++;
        this.heat = 0
        this.visual = (function(s){//실제 엔진 모양 
            var e = document.createElement("div");
            e.setAttribute("class","Engine");
            e.innerHTML = "serial : " + s;
            e.style.textAlign = "center";
            e.style.lineHeight = "70px"
            e.style.width = "140px",
            e.style.height = "70px";
            e.style.borderRadius = "20px"
            e.style.backgroundColor = "white";
            e.style.border = "2px dashed black";
            e.style.opacity = "0.5"
            return e;
        })(this.serial)
    }
    Engine.prototype.movement = function(speed){
        this.horsePower = speed; // 속도값을 마력으로 변환 지금은 그냥 대입이지만 만약에 단위나 값의 크기를 변화 시킬 수도 있으니까 요렇게 저장
        this.heat = speed;
        this.getHeat(this.heat);
    }
    Engine.prototype.getHeat = function(heat){//열을 받는다.
        var _this = this;
        if(heat >= 150 && _this.visual.style.backgroundColor === "white"){ //150도가 넘는데 엔진이 정상이라면
            b = 255;
            var Heating = setInterval(function(){ //열받기 시작 하여
                _this.visual.style.backgroundColor = "rgb(255,255,"+b+")"; //점점 노랗게 변하기 시작한다. blue값이 0.05초당 1씩 감소 (그래야 노랭이가됨)
                if (b===0){ //blue값이 0이 되면
                    clearInterval(Heating);//히팅을 멈추고 
                    _this.heat >= 150 ? _this.overHeat(_this.heat) : _this.visual.style.backgroundColor = "white" // 여전히 온도가 높으면 오버히트가 된다.
                    return;
                }
                b--;
            }, 10);
        }
    }
    Engine.prototype.overHeat = function(heat){//오버 히트가 되면
        var _this = this;
        this.visual.style.backgroundColor = "red"; //엔진이 뻘개짐
        var overHeating = setTimeout(function(){
            if(_this.heat >= 150){
              _this.movement = function(){
                  _this.horsePower = 0; 
                  _this.heat = 0;
                  _this.getHeat(0);
              }
              _this.error = "엔진과열";
              console.error("적당히좀 달리지 망가짐여!!");
            }else{
              _this.visual.style.backgroundColor = "white";
              console.log("엔진 상태 안정화 ");
            }
        },3000);
    }
    return Engine;
})();