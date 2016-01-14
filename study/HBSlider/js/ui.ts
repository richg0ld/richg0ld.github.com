/// <reference path="jquery.d.ts" />

/* ----------------------------------------------
 * HanbitSoft Service Development Team
 * 슬라이드 이미지 버전업 Stylesheet
 * Author - jhkim88@hanbitsoft.co.kr 20160112
 ------------------------------------------------- */

class SlideImages {
    DIMMED: JQuery;
    HBSlider: JQuery;
    SPEED: number;
    EASING: string;
    CONTENTS: JQuery;
    ContentList: JQuery;
    HBSliderWrap: JQuery;
    PAGE: JQuery;
    sumnailLi: JQuery;
    sumnailBtn: JQuery;
    numberBtn: JQuery;
    SLIDE: JQuery;
    pageWrap: JQuery;
    numberWrap: JQuery;
    currentIdx: number;
    pageCurrentIdx: number;
    maxIdx: number;
    imgDirection: string;
    pageDirection: string;
    NextBtn: JQuery;
    PrevBtn: JQuery;
    pageCtrlBtn: JQuery;
    sliderCloseBtn: JQuery;
    isPlay: boolean;
    sliderOpenBtn: JQuery;
    constructor(options: any) {
        var settings = {
            HBSlider: "#HBSlider",
            speed: 300,
            easing: "easeInOutExpo",
            openBtn: true,
            CloseBtn: true,
            openBtnName: ".HBSliderBtn"
        }
        this.settingSlider(settings, options);
        this.activateSlider();
        this.setPosition();
        this.pageBtnChk();
    }
    settingSlider(settings: any, options: any) {
        $.extend(settings, options);
        this.setHTML(settings);
        this.setController(settings)
        this.sumnailLi.eq(0).addClass("on");
    }
    setHTML(settings: any) {
        this.setView(settings);
        this.setDimmed(settings);
        this.setSumnail(settings);
        this.setArrowTag(settings);
        this.setNumber(settings);
        this.setCloseBtn(settings);
    }
    setView(settings: any) {
        this.HBSlider = $(settings.HBSlider);
        this.CONTENTS = this.HBSlider.find("li");
        this.HBSlider.find("li").remove();
        this.HBSlider.wrap("<div id=HBSlider_Wrap></div>");
        this.HBSliderWrap = $("#HBSlider_Wrap");
        this.HBSlider.addClass("borderColor1");
        this.HBSlider.children("ul").addClass("slide clearFix");
        this.CONTENTS.first().clone().appendTo(this.HBSlider.children("ul"));
    }
    setDimmed(settings: any) {
        this.HBSliderWrap.after("<div class=\"dimmed\"></div>");

    }
    setSumnail(settings: any) {
        this.HBSliderWrap.append("<div id=page_Wrap><div class=\"page\"><ul></ul></div></div>");
        this.pageWrap = $("#page_Wrap");
        this.PAGE = $(".page");
        this.PAGE.children("ul").addClass("pageThumbnail clearFix");
        this.CONTENTS.clone().appendTo(this.PAGE.children("ul"));
        this.PAGE.find("img").wrap("<button type=\"button\"></button>");
        this.PAGE.find("button").prepend("<span class=\"borderColor1\"></span>");
    }
    setArrowTag(settings: any) {
        var addTag = "<ul class=\"pageController clearFix\">"
            addTag += "<li class=\"prev\"><button type=\"button\">이전</button></li>"
            addTag += "<li class=\"next\"><button type=\"button\" class=\"on\">다음</button></li>"
            addTag += "</ul>" 
        this.pageWrap.append(addTag);
    }
    setNumber(settings: any) {
        this.pageWrap.append("<div class=\"numberWrap\"><ul class=\"pageNumber clearFix\"></ul></div>");
        this.numberWrap = $(".numberWrap");
        var addTag = this.setPageNumberChk(this.CONTENTS.length)
        this.numberWrap.children("ul").addClass("pageNumber clearFix");
        this.numberWrap.children("ul").append(addTag);
        this.numberWrap.find("li").first().find("button").addClass("on");
    }
    setPageNumberChk(listLength: number){
        var addTag = "";
        var cntNum = Math.floor((listLength-1) / 5) + 1;
        for (var n = 1; n <= cntNum; n++){
            addTag = addTag + "<li class=\"list"+n+"\"><button type=\"button\">"+n+"</button></li>";
        }
        return addTag;
    }
    setCloseBtn(settings: any) {
        var addTag = "<p class=\"close\"> <button type=\"button\" class=\"slideColor1\">닫기</button></p>" 
        this.HBSliderWrap.append(addTag)
    }
    setController(settings: any) {
        this.isPlay = false;
        this.currentIdx = 0;
        this.pageCurrentIdx = 0;
        this.imgDirection = "Stay";
        this.pageDirection = "Stay";
        this.maxIdx = this.CONTENTS.length-1;
        this.SPEED = settings.speed;
        this.EASING = settings.easing;
        this.sumnailLi = $(".pageThumbnail li");
        this.sumnailBtn = $(".pageThumbnail li button");
        this.SLIDE = $(".slide");
        this.numberBtn = $(".pageNumber li button");
        this.NextBtn = $(".next button");
        this.PrevBtn = $(".prev button");
        this.pageCtrlBtn = $(".pageController li button");
        this.sliderOpenBtn = $(settings.openBtnName);
        this.sliderCloseBtn = $(".close button");
        this.DIMMED = $(".dimmed");
    }
    setInit() {
        this.PAGE.children("ul").removeAttr("style");
        this.sumnailLi.removeAttr("class");
        this.numberBtn.removeAttr("class");
        this.pageCtrlBtn.removeAttr("class");
        this.sumnailLi.first().addClass("on");
        this.numberBtn.first().addClass("on");
        this.NextBtn.addClass("on");
        this.imageShow(0);
        this.isPlay = false;
        this.currentIdx = 0;
        this.pageCurrentIdx = 0;
        this.imgDirection = "Stay";
        this.pageDirection = "Stay";
    }
    onSumnail(clickIdx: number){
        this.sumnailLi.removeClass("on");
        this.sumnailLi.eq(clickIdx).addClass("on");
    }
    onNumber(clickIdx: number) {
        this.numberBtn.removeClass("on");
        this.numberBtn.eq(clickIdx).addClass("on");
    }
    imgDirectionChk(clickIdx: number) {
        if (this.currentIdx === clickIdx) {
            this.imgDirection = "Stay"
        } else if (this.currentIdx < clickIdx) {
            this.imgDirection = "toTheRight"
        } else if (this.currentIdx > clickIdx) {
            this.imgDirection = "toTheLeft"
        }
        this.currentIdx = clickIdx;
    }
    pageDirectionChk(clickIdx: number) {
        if (this.pageCurrentIdx === clickIdx) {
            this.pageDirection = "Stay"
        } else if (this.pageCurrentIdx < clickIdx) {
            this.pageDirection = "toTheRight"
        } else if (this.pageCurrentIdx > clickIdx) {
            this.pageDirection = "toTheLeft"
        }
        this.pageCurrentIdx = clickIdx;
    }
    imageShow(clickIdx: number) {
        this.CONTENTS.eq(clickIdx).clone().appendTo(this.SLIDE);
        this.SLIDE.find("li").first().remove();
    }
    imageSlide(clickIdx: number, imgDirection: string) {
        var _this = this;
        var slideValue = 759;
        var slideimgDirection = {
            Stay: function() { return },
            toTheRight: function() { _this.imageSlideToRight(clickIdx, slideValue) },
            toTheLeft: function() { _this.imageSlideToLeft(clickIdx, slideValue) }
        }
        slideimgDirection[imgDirection]();
    }
    imageSlideToRight(clickIdx: number, slideValue: number ){
        var _this = this;
        this.preventEvtBug(this.isPlay, function(){
            _this.isPlay = true;
            _this.CONTENTS.eq(clickIdx).clone().appendTo(_this.SLIDE);
            _this.SLIDE.animate({ "left": -slideValue }, _this.SPEED, _this.EASING, function() {
                _this.HBSlider.children("ul").removeAttr("style");
                _this.SLIDE.find("li").first().remove();
                _this.isPlay = false;
            });
        });
    }
    imageSlideToLeft(clickIdx: number, slideValue: number) {
        var _this = this;
        this.preventEvtBug(this.isPlay, function() {
            _this.isPlay = true;
            _this.CONTENTS.eq(clickIdx).clone().prependTo(_this.SLIDE);
            _this.SLIDE.css({ "left": -slideValue });
            _this.SLIDE.animate({ "left": 0 }, _this.SPEED, _this.EASING, function() {
                _this.HBSlider.children("ul").removeAttr("style");
                _this.SLIDE.find("li").last().remove();
                _this.isPlay = false;
            });
        });
    }
    pageSlide(clickIdx: number) {
        console.log(clickIdx);
        var _this = this;
        var slideValue = clickIdx* -795;
        var sumNailIdx = clickIdx * 5;
        var slidePageDirection = {
            Stay: function() { 
                _this.isPlay = false;
            },
            toTheRight: function() { 
                _this.PAGE.children("ul").animate({ "left": slideValue }, _this.SPEED, _this.EASING, function() {
                    _this.isPlay = false;
                });
            },
            toTheLeft: function() { 
                _this.PAGE.children("ul").animate({ "left": slideValue }, _this.SPEED, _this.EASING, function() {
                    _this.isPlay = false;
                });
            }
        }
        this.preventEvtBug(this.isPlay, function() {
            _this.isPlay = true;
            _this.pageDirectionChk(clickIdx);
            slidePageDirection[_this.pageDirection]();
        });
    }
    next(){
        var nextIdx = this.currentIdx + 1;
        var numberMoveIdx = Math.floor(nextIdx / 5);
        this.imgDirectionChk(nextIdx);
        this.onSumnail(nextIdx);
        if (nextIdx % 5 === 0) {
            this.onNumber(numberMoveIdx);
            this.pageSlide(numberMoveIdx);
            this.imageShow(nextIdx);
            return;
        }
        this.imageSlide(nextIdx, this.imgDirection);
    }
    prev(){
        var prevIdx = this.currentIdx - 1;
        var numberMoveIdx = Math.floor(prevIdx / 5);
        this.imgDirectionChk(prevIdx);
        this.onSumnail(prevIdx);
        if (prevIdx % 5 === 4) {
            this.onNumber(numberMoveIdx);
            this.pageSlide(numberMoveIdx);
        }
        this.imageSlide(prevIdx, this.imgDirection);
    }
    pageBtnChk(){
        var _this = this
        if (this.currentIdx == 0){
            this.pageCtrlBtn.removeClass("on");
            this.pageCtrlBtn.unbind("click");
            this.NextBtn.addClass("on");
            this.NextBtn.bind("click", function() {
                var clickIdx = $(this).parent().index();
                _this.actPageCtrlBtnClk(clickIdx);
            });
            return;
        } else if (this.currentIdx == this.maxIdx) {
            this.pageCtrlBtn.removeClass("on");
            this.pageCtrlBtn.unbind("click");
            this.PrevBtn.addClass("on");
            this.PrevBtn.bind("click", function() {
                var clickIdx = $(this).parent().index();
                _this.actPageCtrlBtnClk(clickIdx);
            });
            return;
        }
        if (!this.NextBtn.hasClass("on")){
            this.NextBtn.addClass("on");
            this.NextBtn.bind("click", function() {
                var clickIdx = $(this).parent().index();
                _this.actPageCtrlBtnClk(clickIdx);
            });
        } else if (!this.PrevBtn.hasClass("on")){
            this.PrevBtn.addClass("on");
            this.PrevBtn.bind("click", function() {
                var clickIdx = $(this).parent().index();
                _this.actPageCtrlBtnClk(clickIdx);
            });
        }
    }
    actSumnailBtnClk(clickIdx: number){
        var _this = this;
        this.preventEvtBug(this.isPlay, function() {
            _this.onSumnail(clickIdx);
            _this.imgDirectionChk(clickIdx);
            _this.imageSlide(clickIdx, _this.imgDirection);
            _this.pageBtnChk();
        });
    }
    actNumberBtnClk(clickIdx: number) {
        var _this = this;
        var eachPageFirstIdx = clickIdx * 5;
        this.preventEvtBug(this.isPlay, function() {
            _this.onNumber(clickIdx);
            _this.pageSlide(clickIdx);
            _this.onSumnail(eachPageFirstIdx);
            _this.imgDirectionChk(eachPageFirstIdx);
            _this.imageShow(eachPageFirstIdx);
            _this.pageBtnChk();
        });
    }
    actPageCtrlBtnClk(clickIdx: number) {
        var _this = this
        var moveDirection;
        var move = {
            left: function() { _this.prev() },
            right: function() { _this.next() }
        }
        this.preventEvtBug(this.isPlay, function(){
            clickIdx == 0 ? moveDirection = "left" : moveDirection = "right";
            move[moveDirection]();
            _this.pageBtnChk();
        });
    }
    preventEvtBug(isPlay: boolean, func: any) {
        if (isPlay == true) {
            return;
        }else {
            func();
        }
    }
    setPosition(){
        var winH = $(window).height() / 2;
        var winW = $(window).width() / 2;
        var outerH = this.HBSliderWrap.outerHeight() / 2;
        var outerW = this.HBSliderWrap.outerWidth() / 2;
        var fixedH = winH - outerH;
        this.HBSliderWrap.css({ 'top': fixedH + 'px', 'left': winW - outerW + 'px' });
    }
    SliderClose(){
        this.setInit();
        this.HBSliderWrap.hide();
        this.DIMMED.hide();
    }
    SliderOpen() {
        this.DIMMED.show();
        this.HBSliderWrap.show();
        this.HBSlider.show();
    }
    activateSlider() {
        var _this = this;
        this.sumnailBtn.click(function() {
            var clickIdx = $(this).parent().index();
            _this.actSumnailBtnClk(clickIdx);
        });
        this.numberBtn.click(function() {
            var clickIdx = $(this).parent().index();
            _this.actNumberBtnClk(clickIdx);
        });
        this.pageCtrlBtn.click(function() {
            var clickIdx = $(this).parent().index();
            _this.actPageCtrlBtnClk(clickIdx);
        });
        this.sliderCloseBtn.click(function() {
            _this.SliderClose();
        });
        this.sliderOpenBtn.click(function(){
            _this.SliderOpen();
        });
        $(window).resize(function(){
            _this.setPosition();
        });
    }
}

//jQuery Easing
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0)
            return b;
        if (t == d)
            return b + c;
        if ((t /= d / 2) < 1)
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});
