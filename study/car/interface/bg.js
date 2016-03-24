var pos = 0;//초기 거리 값이기 떄문에 외부에 노출이 되어도 무방 (사실 불안..ㅋㅋ 누가 바꿀 수 있기 때문)
var Move = (function(){ //배경화면 움직임
    var v;
    var itv;
    function Move(speed){
        stop();
        if(speed==0) return;
        v = speed;
        itv = setInterval(moving, 16);
    }
    function moving(){
        document.getElementsByTagName("body")[0].style.backgroundPosition = -pos+"px 0px";
        pos+=v;
    }
    function stop(){
        clearInterval(itv)
    }
    return Move;
})();