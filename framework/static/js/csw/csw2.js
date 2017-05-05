angular.module('webgisApp')
    .controller('SearchBoxCtrl', function($modal){
        var sb2 = this;

        sb2.search = search;
        sb2.text = '';

        //--------------------------------------------------------------------------------------------------------------

        function search() {
            //bootbox.alert('Search geklickt: '+sb2.text);

            $modal.open({
                bindToController: true,
                controller: 'ModalInstanceCtrl',
                controllerAs: 'mi',
                template: '<div modal-draggable class="modal-header"><h1>{{mi.title}}</h1></div><div class="modal-body metadataModal"></div><div class="modal-footer"><button class="btn btn-primary" ng-click="mi.close()">Close</button></div>',
                resolve: {
                    data: function() {return {};},
                    title: function() {return sb2.text;}
                }
            });
        }
    });