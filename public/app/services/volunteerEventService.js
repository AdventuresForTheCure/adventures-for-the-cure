angular.module('app').factory('volunteerEventService', ['$q', '$http', '$upload', volunteerEventService]);

function formatDate(data) {
  if (data && data.date) {
    data.date = new Date(Date.parse(data.date));
  }
}

function volunteerEventService($q, $http, $upload) {
  var volunteerEvents;

  function transformResponse(data) {
    data = JSON.parse(data);
    for (var i = 0; i < data.length; i++) {
      formatDate(data);
    }
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
          dfd.resolve(data);
        })
        .error(function (error, status, headers, config) {
          dfd.reject(error.reason);
        });
      return dfd.promise;
    },

    getVolunteerEvent: function(name) {
      var dfd = $q.defer();
      var config = {
        transformResponse: transformResponse
      };
      $http.get('/api/volunteerEvents/' + name, config)
        .success(function(data, status, headers, config) {
          formatDate(data);
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
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        formatDate(data);
        dfd.resolve(data);
      }).error(function(error, status, headers, config) {
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
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        formatDate(data);
        dfd.resolve(data);
      }).error(function(error, status, headers, config) {
        dfd.reject(error.reason);
      });

      return dfd.promise;
    }
  };
}