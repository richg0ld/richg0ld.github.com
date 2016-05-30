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
    }
    RGSlider.prototype.set = function(){
        
    };

    function RGSlide(){

    }

    function Selector(el){
        this.elements = JSSelectors(el)
    }
    Selector.prototype.JQSelectors = function(){};
    Selector.prototype.JSSelectors = function(el){
        return document.querySelectorAll(el).length > 1 ? document.querySelectorAll(el) : document.querySelectorAll(el)[0];
    };

    function CSS3(){}
    CSS3.prototype = {
        transformSpeed: function(speed){ this.getElems("sliderList").style.transitionDuration = speed +"ms"},
        transformY: function(position){ this.getElems("sliderList").style.transform = "translate3d(0, "+ position +"px, 0)"},
        transformX: function(position){ this.getElems("sliderList").style.transform = "translate3d("+ position +"px, 0, 0)"}
    };
    return RGSlider;
})();