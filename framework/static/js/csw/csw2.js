angular.module('webgisApp')
    .controller('SearchBoxCtrl', function($scope, $modal){
        $scope.text = '';

        $scope.search = function() {
            //bootbox.alert('Search geklickt: '+$scope.text);

            var modalInstance = $modal.open({
                controller: 'ModalInstanceCtrl',
                template: '<div modal-draggable class="modal-header"><h1>{{title}}</h1></div><div class="modal-body metadataModal"></div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Close</button></div>',
                resolve: {
                    data: function() {return {};},
                    title: function() {return $scope.text;}
                }
            });

        }

    })