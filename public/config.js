(function(){
    angular
        .module("ProjectMaker")
        .config(configuration);

    function configuration($routeProvider, $httpProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/",{
                templateUrl: "views/home.html",
                controller:'homeController',
                controllerAs:'model'

            })
            .when("default",{
                templateUrl: "views/home.html",
                controller:'homeController',
                controllerAs:'model'
            })

            .when("/home",{
                templateUrl: "views/home.html",
                controller:'homeController',
                controllerAs:'model'
            })

            .when("/login",{
                templateUrl: "views/users/templates/login.html",
                controller: "userLoginController",
                controllerAs: "model"})

            .when("/searchResult/name/:rn/address/:add",{
                templateUrl: "views/users/templates/user.search.result.html",
                controller: "searchResultController",
                controllerAs: "model"})


            .when("/searchResult/address/:add",{
                templateUrl: "views/users/templates/user.search.result.html",
                controller: "searchResultController",
                controllerAs: "model"})


            .when("/user/searchResult/name/:rn/address/:add",{
                templateUrl: "views/users/templates/user.search.result.html",
                controller: "searchResultController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }})


            .when("/user/searchResult/address/:add",{
                templateUrl: "views/users/templates/user.search.result.html",
                controller: "searchResultController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }})


            .when("/user/searchResult",{
                templateUrl: "views/home.html",
                controller: "homeController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })


            .when("/searchResult/name/:rn/address/:add/restaurant/:rid/:rname/menu",{
                templateUrl: "views/restaurant/templates/user.restaurant.menu.html",
                controller: "restaurantSearchMenuController",
                controllerAs: "model"})


            .when("/searchResult/address/:add/restaurant/:rid/:rname/menu",{
                templateUrl:"views/restaurant/templates/user.restaurant.menu.html",
                controller: "restaurantSearchMenuController",
                controllerAs: "model"})


            .when("/user/searchResult/name/:rn/address/:add/restaurant/:rid/:rname/menu",{
                templateUrl: "views/restaurant/templates/user.restaurant.menu.html",
                controller: "restaurantSearchMenuController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }})


            .when("/user/searchResult/address/:add/restaurant/:rid/:rname/menu",{
                templateUrl:"views/restaurant/templates/user.restaurant.menu.html",
                controller: "restaurantSearchMenuController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }})



            .when("/searchResult/address/:add/restaurant/:rid/:rname/menu",{
                templateUrl:"views/restaurant/templates/user.restaurant.menu.html",
                controller: "restaurantSearchMenuController",
                controllerAs: "model"})

            .when("/searchResult/name/:rn/address/:add/restaurant/:rid/:rname/menu",{
                templateUrl:"views/restaurant/templates/user.restaurant.menu.html",
                controller: "restaurantSearchMenuController",
                controllerAs: "model"})


            .when("/user/searchResult/name/:rn/address/:add/restaurant/:rid/:rname/menu/cart",{
                templateUrl:"views/order/templates/user.checkout.html",
                controller: "checkOutController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }})

            .when("/user/searchResult/address/:add/restaurant/:rid/:rname/menu/cart",{
                templateUrl:"views/order/templates/user.checkout.html",
                controller: "checkOutController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }})


            // '/user/'+userId+'/searchResult/name/'+name+'/address/'+address+'/restaurant/'+apiKey

                .when("/user/restaurant/:rst/order",{
                templateUrl: "views/order/templates/resturant.order.tracking.html",
                controller: 'restaurantOrderTrackController',
                controllerAs: 'model',
                    resolve: {
                        currentUser: checkLogin
                    }})



            .when("/register/:role",{
                templateUrl: "views/users/templates/userRegister.html",
                controller: "userRegisterController",
                controllerAs:'model'
            })

            .when("/register-owner",{
                templateUrl: "views/owner/templates/ownerRegister.html",
                controller: "ownerRegisterController"
            })


            .when("/user/profile",{
                templateUrl: "views/users/templates/userProfile.html",
                controller: "userProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })

            .when("/user/restaurant",{
                templateUrl: "views/restaurant/templates/restaurantList.html",
                controller: "restaurantListController",
                controllerAs:"model",
                resolve: {
                    currentUser: checkLogin
                }
            })

            .when("/user/restaurant/new",{
                templateUrl: "views/restaurant/templates/newRestaurant.html",
                controller: "restaurantNewController",
                controllerAs:"model",
                resolve: {
                    currentUser: checkLogin
                }
            })


            // .when("/user/:uid/restaurant/:rst/menu",{
            //     templateUrl: "views/restaurant/templates/restaurantMenu.html",
            //     controller: "restaurantMenuController",
            //     contollerAs: "model"
            // })

            .when("/user/restaurant/:rst",{
                templateUrl: "views/restaurant/templates/restaurantEdit.html",
                controller: "restaurantEditController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })
            // .when("/user/:uid/restaurant/:rst/menu/cart/:cat",{
            //     templateUrl: "views/restaurant/templates/menuCategoryEdit.html"
            // })

            .when("/user/restaurant/:rst/menu/:mid/item",{
                templateUrl: "views/restaurant/templates/menuItemEdit.html",
                controller: "editMenuController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })

            .when("/user/restaurant/:rst/menu/category/:catname",{
                templateUrl: "views/restaurant/templates/menuCategoryEdit.html",
                controller: "editMenuController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })

            .when("/user/restaurant/:rst/menu",{
                templateUrl: "views/restaurant/templates/restaurantMenu.html",
                controller: "restaurantMenuController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })

            .when("/user/restaurant/:rst/menu/new",{
                templateUrl: "views/restaurant/templates/newMenu.html",
                controller: "newMenuController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })

            .when("/user/restaurant/:rst/db",{
                templateUrl: "views/users/templates/deliveryPersonnalList.html",
                controller: "deliveryBoyListController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })

            .when("/user/restaurant/:rst/db/:role",{
                templateUrl: "views/users/templates/userRegister.html",
                controller: "deliveryBoyRegisterController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
           })

            //change this to profile standard path
            .when("/user/restaurant/:rst/editdb/:dbid",{
                ///deliveryPersonnal/:db
                templateUrl: "views/users/templates/dbProfileforOwner.html",
                controller: "deliveryBoyProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })

            .when("/user/orders",{

                templateUrl: "views/users/templates/user.order.view.html",
                controller: "userOrderController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })



            .when("/user/dborders",{
                ///deliveryPersonnal/:db
                templateUrl: "views/order/templates/deliveryPersonnalOrder.html",
                controller: "deliveryPersonnalOrderController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            });


    }

    function checkLogin($q, userService, $location) {
        var deffered = $q.defer();
        userService
            .loggedin()
            .then(function (user) {
                if(user == '0') {
                    deffered.reject();
                    $location.url('/login')
                } else {
                    deffered.resolve(user);
                }
            });
        return deffered.promise;
    }


    // function checkRestaurant($q, restaurantService, $location) {
    //     var deffered = $q.defer();
    //     restaurantService
    //         .loggedin()
    //         .then(function (user) {
    //             if(user == '0') {
    //                 deffered.reject();
    //                 $location.url('/login')
    //             } else {
    //                 deffered.resolve(user);
    //             }
    //         });
    //     return deffered.promise;
    // }

})();