/* ----------------------------------------------
 * RGSlider3 v1.0 JavaScript
 * Author - jhkim88@hanbitsoft.co.kr
 ------------------------------------------------- */

var RGSlider = (function(){
    function RGSlider(container, options){
        var _this = this;
        this.container = document.querySelectorAll(container)[0];
        this.settings = {
            type: "default",
            contentSize:null,
            speed: 250,
            current: 0,
            activeClass: "on",
            sliderClass: ".slider",
            sliderList: ".slider_list",
            sliderLists: ".slider_list>li",
            dotButtons: ".dot",
            listContents: ".content",
            prevButton: ".btn_prev",
            nextButton: ".btn_next",
            playButton: ".btn_play",
            stopButton: ".btn_stop"
        };

        if(options){
            Object.keys(options).forEach(function(prop){
                _this.settings[prop] = options[prop];
            });
        }

        this.set();
        this.init();
        this.eventHandler();
    }

    RGSlider.prototype.getElems = function(name){
        return this.elements[name].length > 1 ? this.elements[name] : this.elements[name][0];
    };

    RGSlider.prototype.set = function(){
        var _this = this;
        var settings = this.settings;
        var container = this.container;

        ["_curIdx", "_actIdx"].forEach(function(prop){
            _this[prop] = settings.current
        });

        switch(settings.type){
            case "slide" :
                this.move = this.slideMove;
                this.next = this.rightMove;
                this.prev = this.leftMove;
                break;
        }
        this.elements = {};
        var elemsKey = ["sliderClass", "sliderList" ,"dotButtons", "listContents", "sliderLists", "prevButton", "nextButton", "playButton", "stopButton"];
        elemsKey.forEach(function(prop){
            _this.elements[prop] = container.querySelectorAll(settings[prop]);
        });

        this.currentPage = settings.current+1; //현재 페이지 숫자
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.length = this.getElems("sliderLists").length;
        this.curPos = -settings.current*this.width;
        this.tPos = {};
    };

    RGSlider.prototype.init = function(){
        var _this = this;
        var elemsArray = function(el){
            var arr = [];
            for(var n = 0; n < el.length; n++){
                arr.push(el[n]);
            }
            return arr;
        };
        var sliderLists = elemsArray(this.getElems("sliderLists"));
        this.getElems("sliderLists")[this._curIdx].setAttribute("class", this.settings.activeClass);

        this.getElems("sliderList").style.width = this.settings.contentSize ? this.settings.contentSize.width*this.length + "px" : 100*this.length + "%";
        sliderLists.forEach(function(el){
            if(_this.settings.contentSize){
                el.style.width = _this.settings.contentSize.width + "px";
                el.style.height = _this.settings.contentSize.height + "px";
            }else{
                el.style.width = 100/_this.length + "%";
                el.style.height = _this.height+ "px";
            }

        });
    };

    RGSlider.prototype.slideMove = function(idx){
        this.curPos = -idx*this.elements.listContents[idx].parentNode.clientWidth;
        this.getElems("sliderList").style.transitionDuration = this.settings.speed +"ms";
        this.getElems("sliderList").style.transform = "translate3d("+ this.curPos +"px, 0px, 0px)";
        this.currentPage = idx + 1;
    };
    RGSlider.prototype.rightMove = function(){
        this._curIdx = ++this._curIdx > this.length-1 ?  0 : this._curIdx ;
        this.slideMove(this._curIdx);
    };

    RGSlider.prototype.leftMove = function(){
        this._curIdx = --this._curIdx < 0 ? this.length-1 : this._curIdx ;
        this.slideMove(this._curIdx);
    };

    RGSlider.prototype.eventHandler = function(){

        var _this = this,
            contWIdth = _this.settings.contentSize ? _this.settings.contentSize.width : _this.width, //contentSize 값이 없으면 슬라이드 너비 값으로
            allContsWidth = _this.getElems("sliderList").clientWidth, //ul 너비
            limitVal = allContsWidth - _this.width; // ul 너비에서 스라이드 화면 크기 만큼 뺀 값

        window.addEventListener("resize",function(){
            _this.width = _this.container.clientWidth;
            _this.slideMove(_this._curIdx);
        });

        if(limitVal <= 0) return;
        this.getElems("prevButton").addEventListener("click",function(){
            if(_this.curPos >= 0){
                _this._curIdx = Math.ceil(limitVal >= _this.width ? limitVal / contWIdth : _this.length - (_this.width / contWIdth));
                _this.slideMove(_this._curIdx);
                return;
            }
            _this.prev();
        });
        this.getElems("nextButton").addEventListener("click", function(){
            if(allContsWidth + _this.curPos <= _this.width){
                _this._curIdx = 0;
                _this.slideMove(_this._curIdx);
                return;
            }
            _this.next();
        });
        this.getElems("sliderList").addEventListener("touchstart",function(e){
            _this.tPos.start = e.touches[0].clientX;
            _this.getElems("sliderList").style.transitionDuration ="0ms";
        });
        this.getElems("sliderList").addEventListener("touchmove",function(e){
            _this.tPos.move = e.touches[0].clientX;
            _this.curPos -= (_this.tPos.start - _this.tPos.move);
            _this.getElems("sliderList").style.transform = "translate3d("+ _this.curPos +"px, 0px, 0px)";
            _this.tPos.dir = _this.tPos.start - _this.tPos.move > 0 ? "right" : "left";
            _this.tPos.start = _this.tPos.move;
        });
        this.getElems("sliderList").addEventListener("touchend",function(){

            if(_this.tPos.dir === "right"){
                _this._curIdx = Math.abs(parseInt((_this.curPos - contWIdth*0.8) / contWIdth));
            }else if(_this.tPos.dir === "left"){
                _this._curIdx = Math.abs(parseInt((_this.curPos - contWIdth*0.2) / contWIdth));
            }

            //영역을 넘어갈 정도로 드래그 했을 때
            if(_this.curPos > 0){_this._curIdx = 0}
            else if(allContsWidth + _this.curPos <= _this.width){
                _this.curPos = -(allContsWidth -_this.width);
                _this.getElems("sliderList").style.transitionDuration = _this.settings.speed +"ms";
                _this.getElems("sliderList").style.transform = "translate3d("+ _this.curPos +"px, 0px, 0px)";
                _this._curIdx = Math.abs(parseInt(_this.curPos / contWIdth));
                return;
            }
            _this.slideMove(_this._curIdx);
        });
    };
    return RGSlider;
})();