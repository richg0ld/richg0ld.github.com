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

    RGSlider.prototype = {
        getElems: function(name){
            return this.elements[name].length > 1 ? this.elements[name] : this.elements[name][0];
        },
        set: function(){
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
                default :
                    this.move = this.slideShow;
                    this.next = this.rightShow;
                    this.prev = this.leftShow;
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
        },
        init: function(){
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
        },
        rightMove: function(){
            this._curIdx = ++this._curIdx > this.length-1 ?  0 : this._curIdx ;
            this.slideMove(this._curIdx);
        },
        leftMove: function(){
            this._curIdx = --this._curIdx < 0 ? this.length-1 : this._curIdx ;
            this.slideMove(this._curIdx);
        },
        animate: function(position, speed){
            console.log(position, speed);
            speed = speed || 0;
            this.getElems("sliderList").style.transitionDuration = speed +"ms";
            this.getElems("sliderList").style.transform = "translate3d("+ position +"px, 0px, 0px)";
        },
        rightShow: function(){
            this._curIdx = ++this._curIdx > this.length-1 ?  0 : this._curIdx ;
            this.slideShow(this._curIdx);
        },
        leftShow: function(){
            this._curIdx = --this._curIdx < 0 ? this.length-1 : this._curIdx ;
            this.slideShow(this._curIdx);
        },
        slideShow: function(idx){
            this.curPos = -idx*this.width;
            this.animate(this.curPos);
        },
        slideMove: function(idx){
            this.curPos = -idx*this.width;
            this.animate(this.curPos, this.settings.speed);
            this._curIdx = idx;
        },
        eventHandler: function(){
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
            if(this.settings.type === "slide"){
                this.getElems("sliderList").addEventListener("touchstart",function(e){
                    _this.tPos.start = e.touches[0].clientX;
                });
                this.getElems("sliderList").addEventListener("touchmove",function(e){
                    _this.tPos.move = e.touches[0].clientX;
                    _this.curPos -= (_this.tPos.start - _this.tPos.move);
                    _this.animate(_this.curPos);
                    _this.tPos.start = _this.tPos.move;
                });
                this.getElems("sliderList").addEventListener("touchend",function(){
                    var nextPoint = _this.width*_this._curIdx + _this.width/5; //오른쪽으로 넘어가는 기준이 되는 뷰 중앙 값
                    var prevPoint = _this.width*_this._curIdx - _this.width/5; //왼쪽으로 넘어가는기준이 되는 뷰 중앙 값
                    if(_this.curPos > -prevPoint){
                        _this._curIdx = --_this._curIdx < 0 ? 0 : _this._curIdx ;
                    }else if(_this.curPos < -nextPoint){
                        _this._curIdx = ++_this._curIdx > _this.length-1 ?  _this.length-1 : _this._curIdx ;
                    }
                    _this.slideMove(_this._curIdx);
                });
            }
        }
    };
    function RGSlide(){

    }

    function Selector(){

    }

    function CSS3(){}
    CSS3.prototype = {
        transformSpeed: function(speed){ this.getElems("sliderList").style.transitionDuration = speed +"ms"},
        transformY: function(position){ this.getElems("sliderList").style.transform = "translate3d(0, "+ position +"px, 0)"},
        transformX: function(position){ this.getElems("sliderList").style.transform = "translate3d("+ position +"px, 0, 0)"}
    };
    return RGSlider;
})();