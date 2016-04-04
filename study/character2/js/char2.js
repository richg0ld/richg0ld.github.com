/**
 * Created by jhkim88 on 2016-04-01.
 */
var charImage = new Image(); // 스프라이트 이미지 받아오기
charImage.src = "sprite_right.jpg";
var canvas = (function () {
    var elem = document.createElement("canvas");
    elem.innerHTML = "Hello Canvas";
    elem.width = 500;
    elem.height = 500;
    document.body.appendChild(elem);
    return elem;
})();
var Sprite = (function () {
    function Sprite(options) {
        this.context = options.context; //캔버스 컨텍스트
        this.width = options.width; //프레임 총 길이
        this.height = options.height; //높이
        this.image = options.image; //이미지
        this.isLoop = options.isLoop; //반복 할지 않할지
        this.numberOfFrames = options.numberOfFrames || 1; //프레임 수
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 0;
    }
    Sprite.prototype.render = function () {
        this.context.clearRect(0, 0, this.width, this.height); //화면지우기
        this.context.drawImage(//이미지 그리기
        this.image, this.frameIndex * this.width / this.numberOfFrames, 70, this.width / this.numberOfFrames, this.height, 10, 10, this.width / this.numberOfFrames, this.height);
    };
    Sprite.prototype.update = function () {
        this.tickCount += 1; //카운트 증가
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0; // 카운트 0으로 초기화 후
            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex += 1; //프레임인덱스 증가
            }
            else if (this.isLoop) {
                this.frameIndex = 0; //프레임인덱스 0으로 초기화
            }
        }
    };
    Sprite.prototype.loop = function (frameSpeed) {
        var _this = this;
        frameSpeed = frameSpeed || 50;
        setTimeout(function () {
            window.requestAnimationFrame(function () { return _this.loop(frameSpeed); });
            _this.update();
            _this.render();
        }, frameSpeed);
    };
    return Sprite;
}());
;
var char = new Sprite({
    context: canvas.getContext("2d"),
    width: 700,
    height: 70,
    image: charImage,
    numberOfFrames: 14,
    isLoop: true
});
charImage.addEventListener("load", function () { return char.loop(32); }); //렌더링 루프 시작
// charImage.onload = ()=> {//바로그리면 이미지가 로드가 다 안된 상태에서 그려서 흰색 바탕이 되기 떄문에 온로드로 이미지 로드 상태 체크 후 다음 작업 실행
//     char.render();
// }
