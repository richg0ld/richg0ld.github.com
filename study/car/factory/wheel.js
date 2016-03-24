function Wheel(wheelName){//휠 공장
    this.name = wheelName;
    this.visual = (function(n){ //실제 바퀴 모양 
        var w = document.createElement("div");
        w.setAttribute("class","wheel");
        w.innerHTML = n;
        w.style.textAlign = "center";
        w.style.color = "white"
        w.style.fontSize = "10px"
        w.style.lineHeight = "65px"
        w.style.width = "70px",
        w.style.height = "70px";
        w.style.borderRadius = "35px"
        w.style.backgroundColor = "black";
        return w;
    })(this.name)
    Wheel.prototype.rotate = function(horsePower){
        var rotatePerSec;
        var bgMoveVal;
        if(!horsePower){// 마력이 영일 경우 멈춤
            rotatePerSec = 0;
            bgMoveVal = 0;
        }else{// 값이 있을 경우 각각 필요로 하는 값으로 변환하여 전달
            rotatePerSec = 20 - (horsePower-1)*0.3; //바퀴가 한바퀴 도는데 걸리는 시간값으로 변환 하여 전달.
            bgMoveVal = horsePower; // 배경 움직임은 걍 전달.. 수치 계산이 너무 어렵..
        }
        rotatePerSec < 0 ? rotatePerSec = 0.1 : rotatePerSec //바퀴에 전달 될 에너지가 마이너스로 될 순 없으니 0.1초를 최대 값으로 해둠.
        this.visual.style.animationDuration = rotatePerSec+"s";//바퀴야 굴러라
        Move(bgMoveVal);
        
        this.horsePower = horsePower, this.rotatePerSec = rotatePerSec, this.bgMoveVal = bgMoveVal // 계기판 전달용
    }
}