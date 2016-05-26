angular.module("sportsStore")
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}])
.constant("dataUrl","http://localhost:5000/sportsstore/products/products.json")
.constant("dataUrlLocal","http://localhost:8080/WebTester/getJson")
.constant("orderUrl","http://localhost:8080/WebTester/setJsonSample")
.controller("sportsStoreCtrl", function($scope, $http, dataUrl, orderUrl, cart){
	$scope.data = {};

	$http.get(dataUrl).success(function(data){
			$scope.data.products = data;}
		).error(function(error){
			$scope.data.error = error;}
		);

	$scope.sendOrder = function(shippingDetails) {

		var order = angular.copy(shippingDetails);

		order.products = cart.getProducts();



		var string = '';
		 
		string = Object.keys(order).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(order[key]);
		}).join('&');



		$http.post(orderUrl, string)
			.success(function(data){
				$scope.data.orderId = data.id;
				cart.getProducts().length = 0;
			})
			.error(function(error){
				$scope.data.orderError = error;
			})
			.finally(function(){
				$location.path("/complete");
			});
	};

});