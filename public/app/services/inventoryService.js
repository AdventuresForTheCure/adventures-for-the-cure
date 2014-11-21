angular.module('app').factory('inventoryService', ['$q', '$http', inventoryService]);
function inventoryService($q, $http, InventoryItem) {
  return {
    getInventoryItems: function() {
      var dfd = $q.defer();
      $http.get('/api/inventoryItems/')
        .success(function(data, status, headers, config) {
          dfd.resolve(data);
        })
        .error(function(error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    },

    save: function(inventoryItem) {
      var dfd = $q.defer();

      // if the inventoryItem has an id then it is an 'update'
      // otherwise it is a 'create new'
      var url = '/api/inventoryItems/';
      if (inventoryItem._id) {
        url = '/api/inventoryItems/' + inventoryItem._id;
      }

      $http.post(url, inventoryItem)
        .success(function(data, status, headers, config) {
          dfd.resolve(data);
        })
        .error(function(error, status, headers, config) {
          console.log(error);
          dfd.reject(error.reason);
        });

      return dfd.promise;
    },

    delete: function(inventoryItem) {
      var dfd = $q.defer();
      $http.delete('/api/inventoryItems/' + inventoryItem._id)
        .success(function(data, status, headers, config) {
          dfd.resolve();
        })
        .error(function(error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    }
  };
}