function Light(color){// 라이트 공장
    this.color = color || "yellow";
    this.visual = (function(c){//라이트 실제 모양
        var l = document.createElement("div");
        l.setAttribute("class","glass");
        l.style.width = "20px",
        l.style.height = "30px";
        l.style.backgroundColor = c;
        l.style.border = "2px solid white";
        return l;
    })(this.color)
}
