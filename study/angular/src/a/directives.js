
myApp.directive('searchResult2',function(){
    return {
        templateUrl: 'directive/search-result2.html',
        compile: function(element, attrs){
            console.log('compile...');
            console.log(element, attrs);
            console.log(element.find(".panel"));
            return {
                // 쓰지말라고함
                // pre: function(scope, elements, attrs){
                //     console.log('pre...');
                //     console.log(scope, elements, attrs);
                // },
                post : function(scope, element, attrs){
                    console.log('post...');
                    console.log(scope, element, attrs);
                    scope.r.title === "가나다라" ? element.children().css({"background-color":"red"}) : console.log(false) ;
                }
            }
        }
    }
});