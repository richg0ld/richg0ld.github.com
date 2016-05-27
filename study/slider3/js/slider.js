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
        this.cPos = -settings.current*this.width;
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

        this.getElems("sliderList").style.width = 100*this.length + "%";
        sliderLists.forEach(function(el){
            el.style.width = 100/_this.length + "%";
            el.style.height = _this.height+ "px";
        });
    };

    RGSlider.prototype.slideMove = function(idx){
        this.cPos = -idx*this.width;
        this.getElems("sliderList").style.transitionDuration = this.settings.speed +"ms";
        this.getElems("sliderList").style.transform = "translate3d("+ this.cPos +"px, 0px, 0px)";
        this._curIdx = idx;
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
        var _this = this;
        window.addEventListener("resize",function(){
            _this.width = _this.container.clientWidth;
            _this.slideMove(_this._curIdx);
        });
        this.getElems("prevButton").addEventListener("click",function(){
            _this.prev()
        });
        this.getElems("nextButton").addEventListener("click", function(){
            _this.next()
        });
        this.pos = {};
        this.getElems("sliderList").addEventListener("touchstart",function(e){
            _this.pos.start = e.touches[0].clientX;
            _this.getElems("sliderList").style.transitionDuration ="0ms";
        });
        this.getElems("sliderList").addEventListener("touchmove",function(e){
            _this.pos.move = e.touches[0].clientX;
            _this.cPos -= (_this.pos.start - _this.pos.move);
            _this.getElems("sliderList").style.transform = "translate3d("+ _this.cPos +"px, 0px, 0px)";
            _this.pos.start = _this.pos.move;
        });
        this.getElems("sliderList").addEventListener("touchend",function(e){
            var nextPoint = _this.width*_this._curIdx + _this.width/5; //오른쪽으로 넘어가는 기준이 되는 뷰 중앙 값
            var prevPoint = _this.width*_this._curIdx - _this.width/5; //왼쪽으로 넘어가는기준이 되는 뷰 중앙 값
            //현재 페이지의 위치값에서 화면 너비의 절반 값이 기준이 될 수 있다.
            if(_this.cPos > -prevPoint){
                console.log("왼쪽");
                _this._curIdx = --_this._curIdx < 0 ? 0 : _this._curIdx ;
            }else if(_this.cPos < -nextPoint){
                console.log("오른쪽");
                _this._curIdx = ++_this._curIdx > _this.length-1 ?  _this.length-1 : _this._curIdx ;
            }else{
                console.log("제자리");
            }
            _this.slideMove(_this._curIdx);
        });
    };

    return RGSlider;
})();