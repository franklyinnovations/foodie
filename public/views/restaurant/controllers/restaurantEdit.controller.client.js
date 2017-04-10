(function (){
    angular
        .module("ProjectMaker")
        .controller("restaurantEditController",restaurantEditController);

    function restaurantEditController($routeParams, $location, userService,addressAPISearchService , restaurantService, Upload, $timeout){
        var vm = this;
        var ownerId; //= $routeParams.uid;
        // vm.ownerId=ownerId;
        var restaurantId; //= $routeParams.rst;
        // vm.restaurantId=restaurantId;
        // var day=['Monday','Tuesday', 'Wednesday','Thursday','Friday','Saturday','Sunday'];
        vm.hours=["HH","00","01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12","13", "14", "15", "16", "17", "18", "19", "20", "21", "22","23"];
        vm.mins=["MM","00","15","30","45"];
        vm.city=["Boston", "Newyork"];
        vm.country=["United States"];
        vm.booleanVal=['Yes','No'];
        vm.speciality=[];
        vm.days=[];
        vm.count=0;






        vm.updateRestaurant = updateRestaurant;
        vm.deleteRestaurant=deleteRestaurant;
        vm.addNewSpeciality=addNewSpeciality;
        vm.deleteSpeciality=deleteSpeciality;
        vm.uploadImage=uploadImage;
        vm.loadAddressFromAPI=loadAddressFromAPI;
        vm.populateCityAndStateIfDlSel=populateCityAndStateIfDlSel;
        vm.states=["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",];



        function init() {





            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user=user;
                vm.userId = user._id;
                ownerId = user._id;
                vm.ownerId = ownerId;

                userService
                    .getRestaurantId()
                    .success(function (restaurantId) {
                        vm.restaurantId = restaurantId;
                        restaurantId=restaurantId.replace(/"/g,'');


                restaurantService
                .findRestaurantById(restaurantId)
                .success(function (restaurant) {

                    vm.restaurant = restaurant;



                    for (var s in restaurant.foodTypes){
                        ++vm.count;
                        var newObj={
                            key:vm.count,
                            value:restaurant.foodTypes[s]
                        };
                        vm.speciality.push(newObj);

                    }


                    setDeliveryandPickupforModel();
                    vm.file=restaurant.logoUrl;
                    // setModelWorkingHours();


                }).error(function (err) {
                throwError('Unable to fetch restaurant Information');
            }).error(function (err) {

                });});
        })}
        init();


        function loadAddressFromAPI() {

            if(vm.restaurant.streetAddress){
                var formattedSpace=vm.restaurant.streetAddress.replace(/\s+/g,'+');
                var formatedSpaceAndPound=formattedSpace.replace(/#/g, '%23');

                var promise=addressAPISearchService.autoCompleteAddress(formatedSpaceAndPound);
                promise.success(function (addr) {
                    vm.addressFromAPI=addr.suggestions;

                }).error(function (err) {
                    vm.error=err;
                })
            }

        }

        function populateCityAndStateIfDlSel() {

            if (vm.addressFromAPI){
                var cityAndState=vm.addressFromAPI[0].text.split(', ')[1].split(' ');
                vm.restaurant.city=cityAndState[0];
                vm.restaurant.state=cityAndState[1];

            }

            else{
                vm.restaurant.city='';
                vm.restaurant.state='';
            }


        }


        function updateRestaurant(restaurant) {

            var errors=[];
            var error='';


            if(restaurant){

                restaurant=formatTiming(restaurant);
                console.log(restaurant);

                restaurant.foodTypes=[];
                restaurant=setFoodTypes(restaurant);
                restaurant=setDeliveryAndPickupFlag(restaurant);
                restaurant.ownerId = ownerId;
                restaurant.logoUrl=vm.url;


                if(!restaurant.name){
                    error="Invalid Restaurant Name";
                    errors.push(error);
                }

                if(!restaurant.pin){
                    error="Invalid pin";
                    errors.push(error);
                }

                if(!restaurant.phone){
                    error="Invalid phone";
                    errors.push(error);
                }

                if(!restaurant.streetAddress){
                    error="Invalid address";
                    errors.push(error);
                }

                if(!restaurant.city){
                    error="Invalid city";
                    errors.push(error);
                }

                if(!restaurant.country){
                    error="Invalid country";
                    errors.push(error);
                }

                if(!restaurant.cuisine){
                    error="Need at least one cuisine";
                    errors.push(error);
                }

                if(errors.length==0){

                    restaurant.name=restaurant.name.toUpperCase();
                    restaurant.streetAddress=restaurant.streetAddress.toUpperCase();
                    restaurant.city=restaurant.city.toUpperCase();


                    restaurantService
                        .updateRestaurant(restaurantId,restaurant)
                        .success(function (restaurant) {
                           $location.url("/user/restaurant")

                        })
                }
                else {
                    throwError(errors);
                }

            }
            else{
                error="Please fill in the details";
                errors.push(error);
                throwError(errors);
            }





        }



        function deleteRestaurant () {

                var r = confirm("You really want to delete this restaurant. This cannot be undone.");
                if (r == true) {
                    restaurantService
                        .deleteRestaurant(restaurantId)
                        .success(function (response) {
                            $location.url("/user/restaurant");
                        }).error(function (err) {
                        throwError("unable to delete the restaurant");
                    });

                }



        }

        function addNewSpeciality() {
            ++vm.count;
            var newObj={
                key:vm.count,
                value:''
            };

            vm.speciality.push(newObj);
        }

        function deleteSpeciality(speciality) {
            for (var s in vm.speciality) {
                if(vm.speciality[s].key==speciality.key){
                    vm.speciality.splice(s,1);
                }
            }
        }

        function setFoodTypes(restaurant) {
            var cuisine='';
            for (var s in vm.speciality){
                restaurant.foodTypes.push(vm.speciality[s].value);
                cuisine+=vm.speciality[s].value+' ';
            }
            restaurant.cuisine=cuisine;
            return restaurant;
        }

        function setDeliveryandPickupforModel () {
            if(vm.restaurant.offersPickup){
                vm.restaurant.offersPickup="Yes";
            }
            else {
                vm.restaurant.offersPickup="No";
            }

            if(vm.restaurant.offersDelivery){
                vm.restaurant.offersDelivery="Yes";
            }
            else {
                vm.restaurant.offersDelivery="No";
            }

        }



        function uploadImage()
        {
            if (vm.file) {
                vm.upload(vm.file);
            }
        }


        vm.upload = function (file) {


            Upload.upload({
                url: '/api/restaurant/upload',
                data:{file:file}
            }).then(function (resp) {
                if(resp.data.error_code === 0){

                    vm.error="";
                    vm.success = 'Image successfully uploaded.';
                    vm.url = resp.data.fileUrl;



                } else {
                    vm.message="";
                    vm.error = 'An error occurred';
                }
            }, function (resp) { //catch error
                vm.message="";
                vm.error =  resp.status;
                vm.error =  'Error status: ' + resp.status;
            });
        };

        function formatTiming(restaurant) {


            for(var i in vm.restaurant.hours){

                // console.log(vm.restaurant.hours[i]);


                if(vm.restaurant.hours[i].stH !== 'HH' && vm.restaurant.hours[i].stM !== 'MM' && vm.restaurant.hours[i].etH !== 'HH' && vm.restaurant.hours[i].etM !== 'MM' ){
                    var formattedTime='';
                    var unit='';
                    if(vm.restaurant.hours[i].stH > 12){
                        formattedTime='0';
                        formattedTime+=vm.restaurant.hours[i].stH-12;
                        unit='PM';
                    }
                    else if(vm.restaurant.hours[i].stH == 0){
                        formattedTime=12;
                        unit='AM';
                    }
                    else{
                        formattedTime=vm.restaurant.hours[i].stH ;
                        unit='AM';
                    }
                    formattedTime+=':'+vm.restaurant.hours[i].stM+' '+unit+' - ' ;

                    if(vm.restaurant.hours[i].etH > 12){
                        formattedTime+='0';
                        formattedTime+=vm.restaurant.hours[i].etH-12;
                        unit='PM';
                    }
                    else if(vm.restaurant.hours[i].etH == 0){
                        formattedTime+=12;
                        unit='AM';
                    }
                    else{
                        formattedTime+=vm.restaurant.hours[i].etH ;
                        unit='AM';
                    }
                    formattedTime+=':'+vm.restaurant.hours[i].etM+' '+unit;

                    // console.log("formattedTime",formattedTime);

                    // console.log(vm.restaurant.hours[i].stH);


                    // console.log("vm.restaurant.hours",vm.restaurant.hours);
                    var stH=vm.restaurant.hours[i].stH;
                    var stM=vm.restaurant.hours[i].stM;
                    var etH=vm.restaurant.hours[i].etH;
                    var etM=vm.restaurant.hours[i].etM;

                    // if(i == 'Monday'){
                        restaurant.hours[i]=[];
                        restaurant.hours[i].push(formattedTime);
                        restaurant.hours[i].push(stH);
                        // console.log("vm.restaurant.hours..i sth",vm.restaurant.hours[i][1]);

                        restaurant.hours[i].push(stM);


                        restaurant.hours[i].push(etH);



                        restaurant.hours[i].push(etM);



                    // console.log(restaurant.hours[i]);



                    // }
                    // if(i == 'Tuesday'){
                    //     restaurant.hours.Tuesday=[];
                    //     restaurant.hours.Tuesday.push(formattedTime);
                    //     restaurant.hours.Tuesday.push(vm.restaurant.hours[i].stH);
                    //     restaurant.hours.Tuesday.push(vm.restaurant.hours[i].stM);
                    //     restaurant.hours.Tuesday.push(vm.restaurant.hours[i].etH);
                    //     restaurant.hours.Tuesday.push(vm.restaurant.hours[i].etM);
                    //
                    //
                    //
                    // }
                    // if(i == 'Wednesday'){
                    //     restaurant.hours.Wednesday=[];
                    //     restaurant.hours.Wednesday.push(formattedTime);
                    //     restaurant.hours.Wednesday.push(vm.restaurant.hours[i].stH);
                    //     restaurant.hours.Wednesday.push(vm.restaurant.hours[i].stM);
                    //     restaurant.hours.Wednesday.push(vm.restaurant.hours[i].etH);
                    //     restaurant.hours.Wednesday.push(vm.restaurant.hours[i].etM);
                    //
                    //
                    //
                    //
                    // }
                    // if(i == 'Thursday'){
                    //     restaurant.hours.Thursday=[];
                    //     restaurant.hours.Thursday.push(formattedTime);
                    //     restaurant.hours.Thursday.push(vm.restaurant.hours[i].stH);
                    //     restaurant.hours.Thursday.push(vm.restaurant.hours[i].stM);
                    //     restaurant.hours.Thursday.push(vm.restaurant.hours[i].etH);
                    //     restaurant.hours.Thursday.push(vm.restaurant.hours[i].etM);
                    //
                    //
                    //
                    // }
                    // if(i == 'Friday'){
                    //     restaurant.hours.Friday=[];
                    //     restaurant.hours.Friday.push(formattedTime);
                    //     restaurant.hours.Friday.push(vm.restaurant.hours[i].stH);
                    //     restaurant.hours.Friday.push(vm.restaurant.hours[i].stM);
                    //     restaurant.hours.Friday.push(vm.restaurant.hours[i].etH);
                    //     restaurant.hours.Friday.push(vm.restaurant.hours[i].etM);
                    //
                    // }
                    // if(i == 'Saturday'){
                    //     restaurant.hours.Saturday=[];
                    //     restaurant.hours.Saturday.push(formattedTime);
                    //     restaurant.hours.Saturday.push(vm.restaurant.hours[i].stH);
                    //     restaurant.hours.Saturday.push(vm.restaurant.hours[i].stM);
                    //     restaurant.hours.Saturday.push(vm.restaurant.hours[i].etH);
                    //     restaurant.hours.Saturday.push(vm.restaurant.hours[i].etM);
                    //
                    //
                    // }
                    // if(i == 'Sunday'){
                    //     restaurant.hours.Sunday=[];
                    //     restaurant.hours.Sunday.push(formattedTime);
                    //     restaurant.hours.Sunday.push(vm.restaurant.hours[i].stH);
                    //     restaurant.hours.Sunday.push(vm.restaurant.hours[i].stM);
                    //     restaurant.hours.Sunday.push(vm.restaurant.hours[i].etH);
                    //     restaurant.hours.Sunday.push(vm.restaurant.hours[i].etM);
                    //
                    //
                    //
                    // }

                }
            }

    //         console.log("--------------------------------------------");
    //
    // console.log(restaurant);


            return restaurant;
        }


        function setDeliveryAndPickupFlag (restaurant) {
            if(restaurant.offersPickup=='Yes'){
                restaurant.offersPickup=true;
            }
            else {
                restaurant.offersPickup=false;
            }

            if(restaurant.offersDelivery=='Yes'){
                restaurant.offersDelivery=true;
            }
            else {
                restaurant.offersDelivery=false;
            }
            return restaurant;

        }

        function throwError(errorMsg){
            vm.error=errorMsg;


            $timeout(clearError, 10000);
        }

        function clearError() {
            vm.error='';
        }


    }
})();