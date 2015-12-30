starterControllers.directive('learn_player', function($ionicPopup, LocalDataService){
  
    return {
        restrict: 'E',
        link: link,
        tranclude: true,
        template: 'flashcard | remembered | stat'
    }
});
