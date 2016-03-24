function Glass(width){// 차량 유리 공장
    this.width = width || "100px";
    this.visual = (function(w){//유리 실제 모양
        var g = document.createElement("div");
    g.setAttribute("class","glass");
    g.style.width = w,
    g.style.height = "100px";
    g.style.backgroundColor = "skyblue";
    g.style.border = "2px solid white";
    return g;
    })(this.width)
}
