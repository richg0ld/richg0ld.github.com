/// <reference path="jquery.d.ts" />

/* ----------------------------------------------
 * HanbitSoft Service Development Team
 * 탬플릿 프로토타입 Stylesheet
 * Author - jhkim88@hanbitsoft.co.kr 20151231
 ------------------------------------------------- */
module Mobile {
	export class MenuController {
		HEADER: JQuery;
		btnElement: JQuery;
		layerElement: JQuery;
		gnbElement: JQuery;
		openSizeWidth: string;
		TYPE: string;
		WIDTH: number;
		direction: any;
		WRAP: JQuery;
		DIMMED: JQuery;
		moveWrap: JQuery;
		SPEED: number;
		directionValueWidthPlus: any;
		directionValueWidthMinus: any;
		directionValueZero: any;
		timer: number;
		constructor(options: any) {
			var settings = {
				header: "#header",
				btn: "#gnb_btn",//버튼 아이디 또는 클래스명(제이쿼리 방식으로 구분자 사용)
				gnbWrap: "#gnb_wrap",//gnb와 dimmed를 포함한 div 아이디 또는 클래스명(제이쿼리 방식으로 구분자 사용)
				gnb: "#gnb",//메뉴 div 아이디 또는 클래스명(제이쿼리 방식으로 구분자 사용)
				wrap: "#wrap",// 전체를 감싸는 div요소 아이디 또는 클래스명(제이쿼리 방식으로 구분자 사용)
				direction: "left",// gnb 위치 (left, right)
				dimmed: "#dimmed",// dimmed 아이디 또는 클래스명(제이쿼리 방식으로 구분자 사용)
				moveWrap: "#move_wrap",// 전체 div 안쪽에 한번더  감싼 안쪽 div 아이디 또는 클래스명, 움직임이 필요한 전체 div (제이쿼리 방식으로 구분자 사용)
				type: "default",//애니메이션 타입 (defauit, push, slide, fade)
				speed: 300,//애니메이션 속도
				gnbWidth: "300px"//gnb 너비
			}
			this.settingGnb(settings, options);
			this.activate();
			this.timer = 0;
		}
		settingGnb(settings: any, options: any) {
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
		}
		directionValueSave(direction: string, gnbWidth: string) {
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
			}
			this.directionValueWidthMinus = this.direction[direction]["widthMinus"];
			this.directionValueWidthPlus = this.direction[direction]["widthPlus"];
			this.directionValueZero = this.direction[direction]["zero"];
		}
		setOpenType(type: string, gnbWidth: string) {
			var _this = this;
			this.gnbElement.css({ "width": gnbWidth });
			var set = {
				default: function() {
					_this.layerElement.css({ "display": "none" });
					_this.DIMMED.css({ "opacity": 0.5 });
					_this.gnbElement.css(_this.directionValueZero);
				},
				slide: function() {
					_this.gnbElement.css(_this.directionValueWidthMinus);
				},
				fade: function() {
					_this.layerElement.css({ "display": "none" });
					_this.gnbElement.css({ "opacity": 0 });
					_this.gnbElement.css(_this.directionValueZero);
				},
				push: function() {
					_this.gnbElement.css(_this.directionValueWidthMinus);
				}
			}
			set[type]();
		}

		openGnb(type: string) {
			var _this = this;
			this.layerElement.css({ "display": "block" });
			$(window).bind("scroll", function(e) {
				e.preventDefault();
			});
			var open = {
				default: function() {
					//
				},
				slide: function() {
					_this.gnbElement.stop().animate(_this.directionValueZero, _this.SPEED);
					_this.DIMMED.stop().animate({ "opacity": 0.5 }, _this.SPEED);
				},
				fade: function() {
					_this.gnbElement.stop().animate({ "opacity": 1 }, _this.SPEED);
					_this.DIMMED.stop().animate({ "opacity": 0.5 }, _this.SPEED);
				},
				push: function() {
					_this.HEADER.stop().animate(_this.directionValueWidthPlus, _this.SPEED);
					_this.moveWrap.stop().animate(_this.directionValueWidthPlus, _this.SPEED);
					_this.DIMMED.stop().animate({ "opacity": 0.5 }, _this.SPEED);
				}
			}
			open[this.TYPE]();
		}
		closeGnb(type: string) {
			var _this = this
			$(window).unbind("scroll", function() {
				_this.activate();
			});
			var close = {
				default: function() {
					_this.layerElement.css({ "display": "none" });
				},
				slide: function() {
					_this.gnbElement.stop().animate(_this.directionValueWidthMinus, _this.SPEED);
					_this.DIMMED.stop().animate({ "opacity": 0 }, _this.SPEED);
				},
				fade: function() {
					_this.gnbElement.stop().animate({ "opacity": 0 }, _this.SPEED);
					_this.DIMMED.stop().animate({ "opacity": 0 }, _this.SPEED);
				},
				push: function() {
					_this.HEADER.stop().animate(_this.directionValueZero, _this.SPEED);
					_this.moveWrap.stop().animate(_this.directionValueZero, _this.SPEED)
					_this.DIMMED.stop().animate({ "opacity": 0 }, _this.SPEED);
				}
			}
			close[this.TYPE]();

			setTimeout(function() {
				_this.layerElement.css({ "display": "none" });
				_this.WRAP.removeAttr("style");
			}, _this.SPEED);
		}
		activate() {
			var _this = this
			this.btnElement.click(function() {
				if (!_this.DIMMED.is(":animated")) _this.openGnb(_this.TYPE);
			});
			this.DIMMED.click(function() {
				if (!_this.DIMMED.is(":animated")) _this.closeGnb(_this.TYPE);
			});
		}
	}

	export class HeadController {
		HEADER: JQuery;
		LOGO: JQuery;
		BTN: JQuery;
		TYPE: string;
		WIN: JQuery;
		FOOTER: JQuery;
		currentScrollTop: number;
		moveScrollTop: number;
		scrollState: string;
		headMove: any;
		footerOffsetTop: number;
		winHeight: number;
		timer: number;
		constructor(options: any) {
			var settings = {
				header: "#header",
				logo: "#logo",
				btn: "#gnb_btn",
				type: "parallax",
				footer: "#footer"
			}
			this.setting(settings, options);
			this.activate();
		}
		setting(settings: any, options: any) {
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
		}
		show() {
			if (parseInt(this.HEADER.css("top")) === -52) this.HEADER.stop().animate({ "top": "0px" });
		}
		hide() {
			if (parseInt(this.HEADER.css("top")) === 0) this.HEADER.stop().animate({ "top": "-52px" });
		}
		judgeScroll() {
			this.currentScrollTop = this.WIN.scrollTop();
			this.moveScrollTop < this.currentScrollTop ? this.scrollState = "scrollDown" : this.scrollState = "scrollUp";
			this.moveScrollTop = this.currentScrollTop;
		}
		callHeadMove() {
			var _this = this
			this.headMove = {
				move: {
					scrollUp: function() { _this.show() },
					scrollDown: function() { _this.hide() }
				}
			}
		}
		cdtScrollStop(){
			var _this = this;
			if (this.currentScrollTop <= this.HEADER.height() || this.currentScrollTop >= this.footerOffsetTop - this.winHeight) {
				this.HEADER.stop().animate({ "top": "0px" });
			}
		}
		activate() {
			var _this = this
			$(window).scroll(function(e) {
				_this.judgeScroll()
				_this.headMove[_this.TYPE][_this.scrollState]();
				if(_this.timer) {
					clearTimeout(_this.timer);
				}
				_this.timer = setTimeout(function() {
					_this.cdtScrollStop()
				}, 100);
			});
		}
	}
}
