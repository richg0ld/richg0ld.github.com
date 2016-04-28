/// <reference path="jquery.d.ts" />
/* ----------------------------------------------
 * HanbitSoft Service Development Team
 * 일리에 1차 티징 Stylesheet
 * Author - ljh619@hanbitsoft.co.kr 20151209
------------------------------------------------- */
var Teasing = (function () {
    function Teasing() {
        this.setting();
        this.setContHeight();
        this.activate();
    }
    Teasing.prototype.setting = function () {
        this.sectionIdx = 0;
        this.pageIdx = 0;
        this.WRAP = $("#wrap");
        this.sectionMoveWrap = $("#section_move_wrap");
        this.SECTIONS = $(".section");
        this.isPlay = false;
        this.setPageMove();
    };
    Teasing.prototype.setPageMove = function () {
        var hasPage = this.SECTIONS.children(".page_move_wrap");
        for (var i = 1; i <= hasPage.length; i++) {
            var idx = i - 1;
            var pageMove = hasPage.eq(idx);
            var pages = pageMove.children();
            var pageMoveWidth = 100 * pages.length; //percent
            var pageWidth = 100 / pages.length; //percent
            pageMove.css({ "width": pageMoveWidth + "%" });
            pages.css({ "width": pageWidth + "%" });
        }
    };
    Teasing.prototype.setContHeight = function () {
        this.winHeight = $(window).height();
        this.contHeight = this.winHeight - 40;
        this.WRAP.css({ "height": this.contHeight });
        this.SECTIONS.css({ "height": this.contHeight });
    };
    Teasing.prototype.MoveController = function (sectionIdx, pageIdx, deltaY) {
        var _this = this;
        var page = this.SECTIONS.eq(sectionIdx).children(".page_move_wrap").children();
        if (page.length > 0 && pageIdx <= page.length && pageIdx >= 0) {
            this.pageExceed(pageIdx, deltaY, page.length - 1, sectionIdx, function () {
                deltaY === -1 ? _this.nextPage(sectionIdx, pageIdx) : _this.prevPage(sectionIdx, pageIdx);
            });
            return;
        }
        this.sectionMove(sectionIdx, deltaY);
        this.pageIdx = 0;
    };
    Teasing.prototype.sectionMove = function (sectionIdx, deltaY) {
        var _this = this;
        this.moveExceed(sectionIdx, deltaY, function () {
            deltaY === -1 ? _this.nextSection(sectionIdx) : _this.prevSection(sectionIdx);
        });
    };
    ;
    Teasing.prototype.nextPage = function (sectionIdx, pageIdx) {
        pageIdx++;
        this.pageMove(sectionIdx, pageIdx);
    };
    Teasing.prototype.prevPage = function (sectionIdx, pageIdx) {
        pageIdx--;
        this.pageMove(sectionIdx, pageIdx);
    };
    Teasing.prototype.pageMove = function (sectionIdx, pageIdx) {
        console.log(this.isPlay);
        var _this = this;
        this.preventEvtBug(this.isPlay, function () {
            _this.isPlay = true;
            _this.pageIdx = pageIdx;
            _this.pageMoveWrap = _this.SECTIONS.eq(sectionIdx).children(".page_move_wrap");
            var pageWidth = parseInt(_this.pageMoveWrap.children().css("width"));
            var pageMoveLeft = pageWidth * pageIdx;
            _this.pageMoveWrap.stop().animate({ "left": -pageMoveLeft }, function () {
                _this.isPlay = false;
            });
        });
    };
    Teasing.prototype.moveExceed = function (sectionIdx, deltaY, func) {
        if (sectionIdx === 0 && deltaY === 1) {
            return;
        }
        else if (sectionIdx === (this.SECTIONS.length - 1) && deltaY === -1) {
            return;
        }
        func();
    };
    Teasing.prototype.pageExceed = function (pageIdx, deltaY, pageLength, sectionIdx, func) {
        var _this = this;
        if (pageIdx === 0 && deltaY === 1 || pageIdx === pageLength && deltaY === -1) {
            this.sectionMove(sectionIdx, deltaY);
            console.log(this.pageMoveWrap);
            this.pageMoveWrap.animate({ "left": 0 });
            return;
        }
        func();
    };
    Teasing.prototype.nextSection = function (sectionIdx) {
        var _this = this;
        this.preventEvtBug(this.isPlay, function () {
            _this.isPlay = true;
            sectionIdx++;
            var moveTop = sectionIdx * _this.contHeight;
            _this.sectionMoveWrap.animate({ "top": -moveTop }, function () {
                _this.isPlay = false;
                _this.sectionIdx = sectionIdx;
            });
        });
    };
    Teasing.prototype.prevSection = function (sectionIdx) {
        var _this = this;
        this.preventEvtBug(this.isPlay, function () {
            _this.isPlay = true;
            sectionIdx--;
            var moveTop = sectionIdx * _this.contHeight;
            _this.sectionMoveWrap.animate({ "top": -moveTop }, function () {
                _this.isPlay = false;
                _this.sectionIdx = sectionIdx;
            });
        });
    };
    Teasing.prototype.fixTopPosition = function (sectionIdx) {
        var fixTop = sectionIdx * this.contHeight;
        this.sectionMoveWrap.stop().animate({ "top": -fixTop });
    };
    Teasing.prototype.preventEvtBug = function (isPlay, func) {
        if (isPlay == true) {
            return;
        }
        else {
            func();
        }
    };
    Teasing.prototype.activate = function () {
        var _this = this;
        $(window).resize(function () {
            _this.setContHeight();
            _this.fixTopPosition(_this.sectionIdx);
        });
        $(window).mousewheel(function (e) {
            _this.MoveController(_this.sectionIdx, _this.pageIdx, e.deltaY);
        });
    };
    return Teasing;
}());
//# sourceMappingURL=ui.js.map