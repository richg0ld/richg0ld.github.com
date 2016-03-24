function Skin(color){// 차량 겉면 제조 공장
    this.color = color || "#c7c7c7";
    this.visual = (function(c){//겉모양
        var s = document.createElement("div");
        s.setAttribute("class","skin");
        s.style.width = "400px",
        s.style.height = "200px";
        s.style.backgroundColor = c;
        return s;
    })(this.color);
}