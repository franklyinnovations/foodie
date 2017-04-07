module.exports=function(app,model){

    app.post("/api/user", createUser);
    app.put("/api/user/:uid", updateUser);
    app.delete("/api/user/:uid", deleteUser);
    app.get("/api/user/:uid", findUserById);
    app.get("/api/user",findUserByCredentials);
    app.get("/api/users/:rst",findDeliveryBoyByRestaurant);
    app.put("/api/users/:uid",updateAvailabiltyofDB);
    app.get("/api/users/activedelboys/:rst",findActiveDeliveryBoyByRestaurant);
    app.get( "/api/users/:uid/orders",getAllOrdersForThisDeliveryBoy);
    app.put("/api/user/:uid/deliveryAddress", updateDeliveryAddresses);



    var UserModel = model.UserModel;
    var RestaurantModel = model.RestaurantModel;


    function updateAvailabiltyofDB(req,res) {
        var userId = req.params['uid'];
        var user = req.body;

        UserModel
            .updateAvailabiltyofDB(userId,user)
            .then(function (response) {
                res.json(response)

            },function (err) {
                res.send(err);

            });
    }


    function findDeliveryBoyByRestaurant(req,res) {
        var restaurantID = req.params['rst'];

        RestaurantModel
            .findRestaurantById(restaurantID)
            .then(function (restaurant) {

                UserModel
                    .findUserByDeliveryboy(restaurant.deliveryBoysId)
                    .then(function (response) {

                        res.json(response);
                    }, function (err) {
                        res.send(err);
                    })
            });}





    function findUserByCredentials(req,res) {
        var username = req.query.username;
        var password = req.query.password;

        UserModel
            .findUserByCredentials(username,password)
            .then(function (user) {
                if(user){
                    res.json(user);
                }
                else{
                    res.sendStatus(404);
                }


                }, function (err) {

                res.sendStatus(404);
            });
    }





    function createUser(req, res){
        var user=req.body;

        if(user.role=="DELIVERYBOY"){
            UserModel
                .createUser(user)
                .then(function (reponse) {
                    UserModel.findUserByUsername(reponse.username)
                        .then(function (user) {
                            RestaurantModel
                                .addDeliveryBoy(user)
                                .then(function (response1) {
                                    res.json(user);
                                });

                        }, function (err) {

                            res.sendStatus(err.code);
                        })
                }, function (err) {
                    res.sendStatus(404).send(err);
                })

        }else{
            UserModel
                .createUser(user)
                .then(function (reponse) {
                    UserModel.findUserByUsername(reponse.username)
                        .then(function (user) {


                            res.json(user);
                        }, function (err) {

                            res.sendStatus(err.code);
                        })
                }, function (err) {
                    res.sendStatus(404).send(err);
                })
        }

    };
    function findUserById(req, res) {
        var userId= req.params['uid'];

        UserModel.findUserById(userId)
            .then(function (user) {


                res.json(user);
            }, function (err) {

                res.send(err);
            })
    }

    function updateUser (req, res) {
        var userId = req.params['uid'];
        var user=req.body;
        UserModel.updateUser(userId, user)
            .then(function (user) {

                UserModel.findUserById(userId)
                    .then(function (user) {


                        res.json(user);
                    }, function (err) {

                        res.send(err);
                    })

            }, function (err) {
                res.send(err);
            })
    }

    function deleteUser (req, res) {
        var userId = req.params['uid'];
        UserModel.deleteUser(userId)
            .then(function (response) {
                res.send(200);
            }, function (err) {
                res.send(err);
            })
    }

    function findActiveDeliveryBoyByRestaurant(req,res) {
        var restaurantID = req.params['rst'];
        var activeDelBoys=[];
        RestaurantModel
            .findRestaurantById(restaurantID)
            .then(function (restaurant) {

                UserModel
                    .findUserByDeliveryboy(restaurant.deliveryBoysId)
                    .then(function (response) {
                        for (var i in response){
                            if(response[i].db_avail==1){
                                activeDelBoys.push(response[i]);
                            }

                        }
                        res.send(activeDelBoys);
                    }, function (err) {
                        res.send(err);
                    })
            });}


            function getAllOrdersForThisDeliveryBoy(req,res) {

                var userId = req.params['uid'];
                UserModel.getOrders(userId)
                    .then(function (userAndOrder) {

                        res.json(userAndOrder);
                    }, function (err) {
                        res.send(err);
                    })
            }


            function updateDeliveryAddresses(req, res) {
                var userId = req.params['uid'];
                var deliveryAddresses=req.body;
                UserModel.updateDeliveryAddresses(userId, deliveryAddresses)
                    .then(function (resp) {

                        res.sendStatus(200);
                    }, function (err) {
                        res.send(404);
                    })
            }



};

