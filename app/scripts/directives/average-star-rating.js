/**
 * Created by tapathan on 10/13/2015.
 */
// http://angulartutorial.blogspot.com/2014/03/rating-stars-in-angular-js-using.html

angular.module("powermeApp")
  .directive("averageStarRating",
             function () {
               return {
                 restrict: "EA",
                 template: "<div class='average-rating-container' ng-attr-style='width: {{ max * 17 }}px;' " +
                 "popover='Average Ranking : {{ averageRatingValue | number : 2 }}' popover-trigger='mouseenter'>" +
                 "  <ul class='rating background' class='readonly'>" +
                 "    <li ng-repeat='star in stars' class='star'>" +
                 "      <i class='fa fa-star-o text-lg'></i>" + //&#9733
                 "    </li>" +
                 "  </ul>" +
                 "  <ul class='rating foreground' class='readonly' ng-attr-style='width:{{averageRatingValue / max * 100}}%'>" +
                 "    <li ng-repeat='star in stars' class='star text-orange'>" +
                 "      <i class='fa fa-star text-lg'></i>" + //&#9733
                 "    </li>" +
                 "  </ul>" +
                 "</div>",
                 scope: {
                   averageRatingValue: "=ngModel",
                   max: "=?", //optional: default is 5
                 },
                 link: function (scope, elem, attrs) {
                   if (scope.max == undefined) {
                     scope.max = 5;
                   }
                   scope.stars = [];
                   for (var i = 0; i < scope.max; i++) {
                     scope.stars.push({});
                   }
                   var starContainerMaxWidth = 100; //%
                   scope.filledInStarsContainerWidth = scope.averageRatingValue / scope.max * starContainerMaxWidth;

                   function updateStars() {
                     scope.stars = [];
                     for (var i = 0; i < scope.max; i++) {
                       scope.stars.push({});
                     }
                     var starContainerMaxWidth = 100; //%
                     scope.filledInStarsContainerWidth = scope.averageRatingValue / scope.max * starContainerMaxWidth;
                   };
                   //scope.$watch("averageRatingValue", function (oldVal, newVal) {
                   //  if (newVal) {
                   //    updateStars();
                   //  }
                   //});
                 }
               };
             });

