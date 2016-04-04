/**
 * Created by jhkim88 on 2016-04-01.
 */

const charImage = new Image(); // 스프라이트 이미지 받아오기
charImage.src = "sprite_right.jpg";

const canvas = (()=>{ //캔버스 생성
    var elem = document.createElement("canvas");

    elem.innerHTML = "Hello Canvas";
    elem.width = 500;
    elem.height = 500;

    document.body.appendChild(elem);
    return elem;
})();

 class Sprite { // 스프라이트 클래스
    context: any;
    width: number;
    height: number;
    image: HTMLElement;
    isLoop: any;

    frameIndex: number;
    tickCount: number;
    ticksPerFrame: number;
    numberOfFrames: number;
    constructor(options: any){
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
    render(){ // 렌더링
        this.context.clearRect(0, 0, this.width, this.height); //화면지우기
        
        this.context.drawImage(//이미지 그리기
        this.image,
        this.frameIndex * this.width / this.numberOfFrames,
        70,
        this.width / this.numberOfFrames,
        this.height,
        10,
        10,
        this.width / this.numberOfFrames,
        this.height);
    }
    update(){ // 인덱스 또는 수치값 증감
        this.tickCount += 1; //카운트 증가
        if (this.tickCount > this.ticksPerFrame) { // 카운트가 총프레임수보다 크면 아래 실행 아니면 넘어감
            this.tickCount = 0; // 카운트 0으로 초기화 후
            if (this.frameIndex < this.numberOfFrames-1){ // 프레임인덱스가 총프레임수에서 1을 뺀 수보다 작을경우
                this.frameIndex += 1; //프레임인덱스 증가
            } else if(this.isLoop){ //프레임인덱스가 총프레임-1 보다 크거나 같을 경우 isLoop값이 true면 (무한반복이 트루면)
                this.frameIndex = 0; //프레임인덱스 0으로 초기화
            }
        }
    }
    loop(frameSpeed){ //지우고 그리고 수치 업뎃 을 반복
        frameSpeed = frameSpeed || 50;
        setTimeout(()=>{
            window.requestAnimationFrame(()=> this.loop(frameSpeed) );
            this.update();
            this.render();
        },frameSpeed);
    }
};

var char = new Sprite({
    context: canvas.getContext("2d"),
    width:700,
    height:70,
    image: charImage,
    numberOfFrames: 14,//프레임 컷 수
    isLoop: true
});
charImage.addEventListener("load",()=> char.loop(32) )//렌더링 루프 시작

// charImage.onload = ()=> {//바로그리면 이미지가 로드가 다 안된 상태에서 그려서 흰색 바탕이 되기 떄문에 온로드로 이미지 로드 상태 체크 후 다음 작업 실행
//     char.render();
// }


