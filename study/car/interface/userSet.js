var userSet = (function(){
    function userSet(){//사용자 설정 (백그라운드 이미지 교체 또는 방향키 설정)
        this.bg = function(img){
            document.getElementsByTagName("body")[0].style.backgroundImage = "url("+img+")"
        }
        this.key = function(key, newer, callback){
            var keyCode = {
                right: 39,
                left: 37,
                shift: 16,
                space: 32
            }
            document.addEventListener('keyup', function(e){
            if(e.keyCode === keyCode[key]){
                newer[callback]();
            }
            });
        }
    }
    return new userSet();
})();