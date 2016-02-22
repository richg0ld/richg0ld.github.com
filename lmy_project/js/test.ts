/// <reference path="jquery.d.ts" />

/* ----------------------------------------------
 * HanbitSoft Service Development Team
 * 일리에 1차 티징 Stylesheet
 * Author - ljh619@hanbitsoft.co.kr 20151209
------------------------------------------------- */

class Teasing {
	winHeight: number;
	contHeight: number;
	WRAP: JQuery;
	sectionMoveWrap: JQuery;
	SECTIONS: JQuery;
	pageMoveWrap: JQuery;
	sectionIdx: number;
	pageIdx: number;
	isPlay: boolean;
	constructor() {
		this.setting();
		this.setContHeight();
		this.activate();
	}
	setting(){
		this.sectionIdx = 0;
		this.pageIdx = 0;
		this.WRAP = $("#wrap");
		this.sectionMoveWrap = $("#section_move_wrap");
		this.SECTIONS = $(".section");
		this.isPlay = false;
		this.setPageMove();
	}
	setPageMove(){
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
	}
	setContHeight(){
		this.winHeight = $(window).height();
		this.contHeight = this.winHeight - 40;
		this.WRAP.css({ "height": this.contHeight });
		this.SECTIONS.css({ "height": this.contHeight });
	}
	MoveController(sectionIdx: number, pageIdx: number, deltaY: number) {
		var _this = this;
		var page = this.SECTIONS.eq(sectionIdx).children(".page_move_wrap").children();
		if (page.length > 0 && pageIdx <= page.length && pageIdx >= 0) {
			this.pageExceed(pageIdx, deltaY, page.length-1, sectionIdx, function() {
				deltaY === -1 ? _this.nextPage(sectionIdx, pageIdx) : _this.prevPage(sectionIdx, pageIdx);
			});
			return;
		}
		this.sectionMove(sectionIdx, deltaY);
		this.pageIdx = 0;
	}
	sectionMove(sectionIdx: number, deltaY: number) {
		var _this = this;
		this.moveExceed(sectionIdx, deltaY, function() {
			deltaY === -1 ? _this.nextSection(sectionIdx) : _this.prevSection(sectionIdx);
		});
	};
	nextPage(sectionIdx: number, pageIdx: number) {
		pageIdx++;
		this.pageMove(sectionIdx, pageIdx)
	}
	prevPage(sectionIdx: number, pageIdx: number) {
		pageIdx--;
		this.pageMove(sectionIdx, pageIdx)
	}
	pageMove(sectionIdx: number, pageIdx: number) {
		console.log(this.isPlay);
		var _this = this;
		this.preventEvtBug(this.isPlay, function() {
			_this.isPlay = true;
			_this.pageIdx = pageIdx;
			_this.pageMoveWrap = _this.SECTIONS.eq(sectionIdx).children(".page_move_wrap");
			var pageWidth = parseInt(_this.pageMoveWrap.children().css("width"));
			var pageMoveLeft = pageWidth * pageIdx;
			_this.pageMoveWrap.stop().animate({ "left": -pageMoveLeft }, function(){
				_this.isPlay = false;
			});
		});
	}
	moveExceed(sectionIdx: number, deltaY: number, func: any) {
		if (sectionIdx === 0 && deltaY === 1) {
			return
		} else if (sectionIdx === (this.SECTIONS.length - 1) && deltaY === -1) {
			return
		}
		func();
	}
	pageExceed(pageIdx: number, deltaY: number, pageLength: number, sectionIdx: number, func: any) {
		var _this = this;
		if (pageIdx === 0 && deltaY === 1 || pageIdx === pageLength && deltaY === -1) {
			this.sectionMove(sectionIdx, deltaY);
			console.log(this.pageMoveWrap)
			this.pageMoveWrap.animate({ "left": 0 });
			return;
		}
		func();
	}
	nextSection(sectionIdx: number) {
		var _this = this
		this.preventEvtBug(this.isPlay, function() {
			_this.isPlay = true;
			sectionIdx++;
			var moveTop = sectionIdx * _this.contHeight;
			_this.sectionMoveWrap.animate({ "top": -moveTop }, function() {
				_this.isPlay = false;
				_this.sectionIdx = sectionIdx;
			});
		});
	}
	prevSection(sectionIdx: number) {
		var _this = this
		this.preventEvtBug(this.isPlay, function() {
			_this.isPlay = true;
			sectionIdx--;
			var moveTop = sectionIdx * _this.contHeight;
			_this.sectionMoveWrap.animate({ "top": -moveTop }, function(){
				_this.isPlay = false;
				_this.sectionIdx = sectionIdx;
			});
		});
	}
	fixTopPosition(sectionIdx: number) {
		var fixTop = sectionIdx * this.contHeight;
		this.sectionMoveWrap.stop().animate({ "top": -fixTop });
	}
	preventEvtBug(isPlay: boolean, func: any) {
        if (isPlay == true) {
            return;
        } else {
            func();
        }
    }
	activate(){
		var _this = this;
		$(window).resize(function(){
			_this.setContHeight();
			_this.fixTopPosition(_this.sectionIdx)
		});
		$(window).mousewheel(function(e) {
			_this.MoveController(_this.sectionIdx, _this.pageIdx, e.deltaY);
		});
	}
}

//범용 에러정의
const ERROR = (() => {
	let err = Object.defineProperties({}, { //전체 에러를 정의함
		//상수코드는 대문자로 표기
		ARGUMENT: { value: Symbol() }, //인자에 문제가 있는 경우
			
		//에러함수는 카멜로 표기
		isMandatory: {
			value: ({type, location, details}) => { //필수인자누락시 발생
				throw new Error(_msg[type] + ':' + location + '(' + details + ')');
			}
		}
	}),
		_msg = { //각 에러별 메세지
			[err.ARGUMENT]: 'arguments'
		};
	return err;
});
//최상위 클래스로 이벤트시스템 및 기본 좌표계시스템을 관장함.
const Display = (() => {
	const EVENT = Symbol(), //인스턴스별로 한개만 이벤트객체를 소유하는데 이를 위한 내부용심볼
		STOP_PROPAGATION = Symbol(), //그 이벤트가 도중에 정지되는 경우를 감지하기 위한 속성
		privateData = new WeakMap(); //private속성을 담기 위한 위크맵

	const Event = class { //기본이벤트 기능을 제공하는 클래스
		constructor(target) { //생성시점에 target을 읽기전용으로 확정함
			Object.defineProperty(this, 'target', { value: this });
		}
		stopPropagation() { //전파중지시 체크
			this[STOP_PROPAGATION] = true;
		}
	};
	return class {
		constructor() {
			privateData[this] = { //생성시점에 이벤트객체를 우선적으로 private속성이 잡아둠
				[EVENT]: new Event(this)
			};
		}
		dispatch(event) {
			let data = privateData[this], //private공간에서 데이터를 얻고
				listeners = data[event], ev = data[EVENT]; //그 안에서 리스너셋 및 이벤트 객체를 가져옴
			if (!listeners) return; //해당 이벤트명으로 리스너를 등록한적도 없으면 종료
			ev.type = event; //디스패치할 이벤트로 타입을 정하고
			ev[STOP_PROPAGATION] = false; //전파를 초기함
			for (let listener of listeners) {
				listener.call(this, ev); //리스너를 차례로 콜하다가
				if (ev[STOP_PROPAGATION]) return; //전파중지되면 중지
			}
		}
		//리스너가 지정되지 않으면 기본값발동으로 인해 예외를 발생시키고 죽어버림
		addListener(event, listener = ERROR.isMandatory({ type: ERROR.ARGUMENT, location: 'Display.addListener', details: 'listener' })) {
			let data = privateData[this],
				listeners = data[event] || (data[event] = new Set()); //해당 이벤트 명으로 아직 등록한적이 없으면 set을 생성
			listeners.add(listener); //거기에 추가함. set은 알아서 중복된 객체를 무시하는 기능이 있음
		}
		removeListener(event, listener = null) { //리스너를 안주면 해당 이벤트를 다 날림
			let data = privateData[this], listeners = data[event];
			if (!listeners) return;
			listener ? listeners.delete(listener) : listeners.clear(); //해당 리스너를 지우거나 다 날림
		}
	};
})();