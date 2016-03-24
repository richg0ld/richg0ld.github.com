function Frame(material){//자동차 골격(프레임) 공장
    this.material = material || "steel";
    this.shaped = (function(){//.car:after에다 clearfix를 못해서 골격 프래임으로 높이값 주어서 사용.. 뭔소리지ㅋㅋ 마크업 관련 된거니 이해안되면 무시하셔도됨
        var f = document.createElement("div");
        f.setAttribute("class","Frame");
        f.style.width = "400px";
        f.style.height = "230px";
        return f;
    })();
}