/* ----------------------------------------------
 * RGSlider v2.1 JavaScript
 * Author - jhkim88@hanbitsoft.co.kr
 ------------------------------------------------- */

class RGSlider {
    constructor(container, options){
        this.container = document.querySelectorAll(container)[0];
        this.settings = new Map([
            ["type", "default"],
            ["speed", 250],
            ["current", 0], // 시작하는 값
            ["activeClass", "on"],
            ["sliderClass", ".slider"],
            ["sliderList", ".slider_list"],
            ["sliderLists", ".slider_list>li"],
            ["dotButtons", ".dot"],
            ["listContents", ".content"],
            ["prevButton", ".btn_prev"],
            ["nextButton", ".btn_next"],
            ["playButton", ".btn_play"],
            ["stopButton", ".btn_stop"],
            ["currentSlide", ".current_slide"],
            ["totalSlide", ".total_slide"]
        ]);

        if(options){
            for(const k of options){
                this.settings.set(k, options.get(k))
            }
        }

        this.set();
        this.init();
        this.eventHandler();
    }
    set(){
        const settings = this.settings;
        const container = this.container;

        this._evtCnt = 0;
        for(const k of ["_curIdx", "_actIdx"]){
            this[k] = settings.get("current")
        }

        switch(settings.get("type")){
            case "slide" :
                this.move = this.slideMove;
                this.next = this.rightMove;
                this.prev = this.leftMove;
                break;
            case "default" :
                this.move = this.slideMove;
                this.next = this.rightMove;
                this.prev = this.leftMove;
                break;
        }

        this.currentPage = settings.get("current")+1; //현재 페이지 숫자
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.length = container.querySelectorAll(settings.get("sliderLists")).length;
        
        this.elements = new Map();
        const elemsKey = ["sliderClass", "sliderList" ,"dotButtons", "listContents", "sliderLists", "prevButton", "nextButton", "playButton", "stopButton", "currentSlide", "totalSlide"];
        for(const k of elemsKey){
            this.elements.set(k, container.querySelectorAll(settings.get(k)));
        }

    }
    getElems(name){
        return this.elements.get(name).length > 1 ? this.elements.get(name) : this.elements.get(name)[0] ;
    }
    init(){
        const ElemsArray = el=>{
            let arr = [];
            for(let n = 0; n < el.length; n++){
                arr.push(el[n]);
            }
            return arr;
        };
        const sliderLists = ElemsArray(this.getElems("sliderLists"));
        this.getElems("sliderLists")[this._curIdx].setAttribute("class", this.settings.get("activeClass"));
        this.getElems("sliderList").style.width = 100*this.length + "%";

        sliderLists.forEach( item => item.style.width = 100/this.length + "%" );
    }
    slideMove(idx){
        this.elements.get("sliderList")[0].style.transitionDuration = `${this.settings.get("speed")}ms`;
        this.elements.get("sliderList")[0].style.transform = `translate3d(${-idx*this.width}px, 0px, 0px)`;
        this._curIdx = idx;
    }
    rightMove(){
        this._curIdx = ++this._curIdx > this.length-1 ?  0 : this._curIdx ;
        console.log(this._curIdx);
        this.slideMove(this._curIdx);
    }
    leftMove(){
        this._curIdx = --this._curIdx < 0 ? this.length-1 : this._curIdx ;
        this.slideMove(this._curIdx);
    }
    eventHandler(){
        this.getElems("prevButton").addEventListener("click",()=>{
            this.prev()
        });
        this.getElems("nextButton").addEventListener("click", ()=>{
            this.next()
        });
    }
}