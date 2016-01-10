/// <reference path="jquery.d.ts" />
/* ----------------------------------------------
 * HanbitSoft Service Development Team
 * 탬플릿 프로토타입 Stylesheet
 * Author - jhkim88@hanbitsoft.co.kr 20151231
 ------------------------------------------------- */
var Mobile;
(function (Mobile) {
    var MenuController = (function () {
        function MenuController(options) {
            var settings = {
                header: "#header",
                btn: "#gnb_btn",
                gnbWrap: "#gnb_wrap",
                gnb: "#gnb",
                wrap: "#wrap",
                direction: "left",
                dimmed: "#dimmed",
                moveWrap: "#move_wrap",
                type: "default",
                speed: 300,
                gnbWidth: "300px" //gnb 너비
            };
            this.settingGnb(settings, options);
            this.activate();
            this.timer = 0;
        }
        MenuController.prototype.settingGnb = function (settings, options) {
            $.extend(settings, options);
            this.HEADER = $(settings.header);
            this.btnElement = $(settings.btn);
            this.layerElement = $(settings.gnbWrap);
            this.gnbElement = $(settings.gnb);
            this.WRAP = $(settings.wrap);
            this.DIMMED = $(settings.dimmed);
            this.moveWrap = $(settings.moveWrap);
            this.openSizeWidth = settings.gnbWidth;
            this.SPEED = settings.speed;
            this.TYPE = settings.type;
            this.directionValueSave(settings.direction, this.openSizeWidth);
            this.setOpenType(this.TYPE, this.openSizeWidth);
        };
        MenuController.prototype.directionValueSave = function (direction, gnbWidth) {
            this.direction = {
                left: {
                    widthMinus: { left: "-" + gnbWidth },
                    widthPlus: { left: gnbWidth },
                    zero: { left: 0 }
                },
                right: {
                    widthMinus: { right: "-" + gnbWidth },
                    widthPlus: { right: gnbWidth },
                    zero: { right: 0 }
                }
            };
            this.directionValueWidthMinus = this.direction[direction]["widthMinus"];
            this.directionValueWidthPlus = this.direction[direction]["widthPlus"];
            this.directionValueZero = this.direction[direction]["zero"];
        };
        MenuController.prototype.setOpenType = function (type, gnbWidth) {
            var _this = this;
            this.gnbElement.css({ "width": gnbWidth });
            var set = {
                default: function () {
                    _this.layerElement.css({ "display": "none" });
                    _this.DIMMED.css({ "opacity": 0.5 });
                    _this.gnbElement.css(_this.directionValueZero);
                },
                slide: function () {
                    _this.gnbElement.css(_this.directionValueWidthMinus);
                },
                fade: function () {
                    _this.layerElement.css({ "display": "none" });
                    _this.gnbElement.css({ "opacity": 0 });
                    _this.gnbElement.css(_this.directionValueZero);
                },
                push: function () {
                    _this.gnbElement.css(_this.directionValueWidthMinus);
                }
            };
            set[type]();
        };
        MenuController.prototype.openGnb = function (type) {
            var _this = this;
            this.layerElement.css({ "display": "block" });
            $(window).bind("scroll", function (e) {
                e.preventDefault();
            });
            var open = {
                default: function () {
                    //
                },
                slide: function () {
                    _this.gnbElement.stop().animate(_this.directionValueZero, _this.SPEED);
                    _this.DIMMED.stop().animate({ "opacity": 0.5 }, _this.SPEED);
                },
                fade: function () {
                    _this.gnbElement.stop().animate({ "opacity": 1 }, _this.SPEED);
                    _this.DIMMED.stop().animate({ "opacity": 0.5 }, _this.SPEED);
                },
                push: function () {
                    _this.HEADER.stop().animate(_this.directionValueWidthPlus, _this.SPEED);
                    _this.moveWrap.stop().animate(_this.directionValueWidthPlus, _this.SPEED);
                    _this.DIMMED.stop().animate({ "opacity": 0.5 }, _this.SPEED);
                }
            };
            open[this.TYPE]();
        };
        MenuController.prototype.closeGnb = function (type) {
            var _this = this;
            $(window).unbind("scroll", function () {
                _this.activate();
            });
            var close = {
                default: function () {
                    _this.layerElement.css({ "display": "none" });
                },
                slide: function () {
                    _this.gnbElement.stop().animate(_this.directionValueWidthMinus, _this.SPEED);
                    _this.DIMMED.stop().animate({ "opacity": 0 }, _this.SPEED);
                },
                fade: function () {
                    _this.gnbElement.stop().animate({ "opacity": 0 }, _this.SPEED);
                    _this.DIMMED.stop().animate({ "opacity": 0 }, _this.SPEED);
                },
                push: function () {
                    _this.HEADER.stop().animate(_this.directionValueZero, _this.SPEED);
                    _this.moveWrap.stop().animate(_this.directionValueZero, _this.SPEED);
                    _this.DIMMED.stop().animate({ "opacity": 0 }, _this.SPEED);
                }
            };
            close[this.TYPE]();
            setTimeout(function () {
                _this.layerElement.css({ "display": "none" });
                _this.WRAP.removeAttr("style");
            }, _this.SPEED);
        };
        MenuController.prototype.activate = function () {
            var _this = this;
            this.btnElement.click(function () {
                if (!_this.DIMMED.is(":animated"))
                    _this.openGnb(_this.TYPE);
            });
            this.DIMMED.click(function () {
                if (!_this.DIMMED.is(":animated"))
                    _this.closeGnb(_this.TYPE);
            });
        };
        return MenuController;
    })();
    Mobile.MenuController = MenuController;
    var HeadController = (function () {
        function HeadController(options) {
            var settings = {
                header: "#header",
                logo: "#logo",
                btn: "#gnb_btn",
                type: "parallax",
                footer: "#footer"
            };
            this.setting(settings, options);
            this.activate();
        }
        HeadController.prototype.setting = function (settings, options) {
            $.extend(settings, options);
            this.WIN = $(window);
            this.HEADER = $(settings.header);
            this.LOGO = $(settings.logo);
            this.BTN = $(settings.btn);
            this.TYPE = settings.type;
            this.FOOTER = $(settings.footer);
            this.currentScrollTop = this.WIN.scrollTop();
            this.moveScrollTop = this.currentScrollTop;
            this.footerOffsetTop = this.FOOTER.offset().top;
            this.winHeight = this.WIN.height();
            this.callHeadMove();
        };
        HeadController.prototype.show = function () {
            if (parseInt(this.HEADER.css("top")) === -52)
                this.HEADER.stop().animate({ "top": "0px" });
        };
        HeadController.prototype.hide = function () {
            if (parseInt(this.HEADER.css("top")) === 0)
                this.HEADER.stop().animate({ "top": "-52px" });
        };
        HeadController.prototype.judgeScroll = function () {
            this.currentScrollTop = this.WIN.scrollTop();
            this.moveScrollTop < this.currentScrollTop ? this.scrollState = "scrollDown" : this.scrollState = "scrollUp";
            this.moveScrollTop = this.currentScrollTop;
        };
        HeadController.prototype.callHeadMove = function () {
            var _this = this;
            this.headMove = {
                move: {
                    scrollUp: function () { _this.show(); },
                    scrollDown: function () { _this.hide(); }
                }
            };
        };
        HeadController.prototype.cdtScrollStop = function () {
            var _this = this;
            if (this.currentScrollTop <= this.HEADER.height() || this.currentScrollTop >= this.footerOffsetTop - this.winHeight) {
                this.HEADER.stop().animate({ "top": "0px" });
            }
        };
        HeadController.prototype.activate = function () {
            var _this = this;
            $(window).scroll(function (e) {
                _this.judgeScroll();
                _this.headMove[_this.TYPE][_this.scrollState]();
                if (_this.timer) {
                    clearTimeout(_this.timer);
                }
                _this.timer = setTimeout(function () {
                    _this.cdtScrollStop();
                }, 100);
            });
        };
        return HeadController;
    })();
    Mobile.HeadController = HeadController;
})(Mobile || (Mobile = {}));
