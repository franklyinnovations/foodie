(function () {
    angular.module('ProjectMaker')
        .controller('adminDashboardController', adminDashboardController);

    function adminDashboardController (userService, restaurantService, orderTrackService) {
        var vm = this;
        vm.currActivePaneIfUser='';
        vm.mode='All';
        vm.findUsers=findUsers;
        vm.findRestaurants=findRestaurants;
        vm.findOrders=findOrders;
        vm.adminDashBoard=adminDashBoard;
        vm.deleteOrder=deleteOrder;
        vm.deleteRestaurant=deleteRestaurant;
        vm.deleteUser=deleteUser;

        function init() {

            // adminDashBoard();
            vm.mode = 'All';


            window.onload = function () {
                var chart = new CanvasJS.Chart("chartContainer",
                    {
                        title: {
                            text: "Total Customers On Board"
                        },
                        legend: {
                            maxWidth: 350,
                            itemWidth: 120
                        },
                        data: [
                            {
                                type: "pie",
                                showInLegend: true,
                                legendText: "{indexLabel}",
                                dataPoints: [
                                    {y: 4181563, indexLabel: "Consumers"},
                                    {y: 2175498, indexLabel: "Restaurant Owners"},
                                    {y: 3125844, indexLabel: "Delivery Boys"}
                                ]
                            }
                        ]
                    });
                console.log(chart.render());
                chart.render();


            }
        }init();

        var $li = $('#categories li').click(function() {
            $li.removeClass('active');
            $(this).addClass('active');
        });


        function findUsers(role) {
            vm.mode='users';
            vm.currActivePaneIfUser=role;
            var promise=userService.findUsers(role);
            promise.success(function (users) {
                vm.data=users;
            }).error(function (err) {
                console.log(err);
            })
        }

        function findRestaurants() {
            vm.mode='restaurants';
            var promise=restaurantService.findRestaurant();
            promise.success(function (restaurants) {
                vm.data=restaurants;
            }).error(function (err) {
                console.log(err);
            })
        }

        function findOrders() {
            vm.mode='orders';
            var promise=orderTrackService.findOrders();
            promise.success(function (orders) {
                vm.data=orders;
            }).error(function (err) {
                console.log(err);
            })
        }


        function adminDashBoard() {

            findUsers('ALLUSERS');

            vm.mode='All';


            window.onload = function () {
            var chart = new CanvasJS.Chart("chartContainer",
                {
                    title: {
                        text: "Total Customers On Board"
                    },
                    legend: {
                        maxWidth: 350,
                        itemWidth: 120
                    },
                    data: [
                        {
                            type: "pie",
                            showInLegend: true,
                            legendText: "{indexLabel}",
                            dataPoints: [
                                {y: 4181563, indexLabel: "Consumers"},
                                {y: 2175498, indexLabel: "Restaurant Owners"},
                                {y: 3125844, indexLabel: "Delivery Boys"}
                            ]
                        }
                    ]
                });
            console.log(  chart.render());
            chart.render();

        }}

        function deleteUser(userId) {
            var promise=userService.deleteUser(userId);
            promise.success(function (res) {
                findUsers(vm.currActivePaneIfUser);
            }).error(function (err) {
                vm.error='Unable to delete the order';
            })
        }

        function deleteOrder(orderId) {
            var promise=orderTrackService.deleteOrder(orderId);
            promise.success(function (res) {
                findOrders();
            }).error(function (err) {
                vm.error='Unable to delete the order';
            })
        }

        function deleteRestaurant(resId) {
            var promise=restaurantService.deleteRestaurant(resId);
            promise.success(function (res) {
                findRestaurants();
            }).error(function (err) {
                vm.error='Unable to delete the order';
            })
        }


    }
})();
