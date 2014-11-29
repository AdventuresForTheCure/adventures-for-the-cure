angular.module('app').factory('volunteerEventService', ['$q', '$http', '$upload', volunteerEventService]);
function volunteerEventService($q, $http, $upload) {
  var volunteerEvents;

  function transformResponse(data) {
    data = JSON.parse(data);
    return data;
  }

  return {
    deleteVolunteerEvent: function(volunteerEvent) {
      var dfd = $q.defer();
      $http.delete('/api/volunteerEvents/' + volunteerEvent._id)
        .success(function(data, status, headers, config) {
          dfd.resolve();
        })
        .error(function(error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    },

    getVolunteerEvents: function() {
      var dfd = $q.defer();
      var config = {
        transformResponse: transformResponse
      };
      $http.get('/api/volunteerEvents/', config)
        .success(function (data, status, headers, config) {
          volunteerEvents = data;
          dfd.resolve(volunteerEvents);
        })
        .error(function (error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    },

    getVolunteerEvent: function(name) {
      var dfd = $q.defer();
      $http.get('/api/volunteerEvents/' + name)
        .success(function(data, status, headers, config) {
          dfd.resolve(data);
        })
        .error(function(error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    },

    saveVolunteerEvent: function(volunteerEvent) {
      var dfd = $q.defer();

      // if the volunteerEvent has an id then it is an 'update'
      // otherwise it is a 'create new'
      var url = '/api/volunteerEvents/';
      if (volunteerEvent._id) {
        url = '/api/volunteerEvents/' + volunteerEvent._id;
      }

      $upload.upload({
        url: url,
        data: volunteerEvent,
        file: volunteerEvent.img
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
        dfd.resolve(data);
      }).error(function(error, status, headers, config) {
        console.log(error);
        dfd.reject(error.reason);
      });

      return dfd.promise;
    },

    saveVolunteerEventTmpImg: function(volunteerEvent) {
      var dfd = $q.defer();
      var url = '/api/volunteerEvents/tmpImg/' + volunteerEvent._id;

      $upload.upload({
        url: url,
        file: volunteerEvent.imgTmp
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
        dfd.resolve(data);
      }).error(function(error, status, headers, config) {
        console.log(error);
        dfd.reject(error.reason);
      });

      return dfd.promise;
    }
  };
}