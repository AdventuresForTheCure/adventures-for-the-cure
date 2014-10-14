angular.module('app', ['ngResource', 'ngRoute', 'ui.bootstrap']);

angular.module('app').config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    admin: { auth: function(authorizationService) {
      return authorizationService.authorizeAuthorizedUserForRoute('admin');
    }},
    board: { auth: function(authorizationService) {
      return authorizationService.authorizeAuthorizedUserForRoute('board');
    }},
    user: { auth: function(authorizationService) {
      return authorizationService.authorizeAuthenticatedUserForRoute();
    }}
  };

  $locationProvider.html5Mode(true);

  // configure the available routes
  $routeProvider
    .when('/', { redirectTo: '/home'
    })
    .when('/home', { templateUrl: '/partials/home/home'
    })
    .when('/donate', { templateUrl: '/partials/donate/donate'
    })
    .when('/events', { templateUrl: '/partials/events/events'
    })
    .when('/rides', { templateUrl: '/partials/rides/rides'
    })
    .when('/members', { templateUrl: '/partials/members/members'
    })
    .when('/results', { templateUrl: '/partials/results/results'
    })
    .when('/inventory', { templateUrl: '/partials/inventory/inventory'
    })
    .when('/contact', { templateUrl: '/partials/contact/contact'
    })
    .when('/login', { templateUrl: '/partials/login/login',
      controller: 'loginCtrl'
    })
    .when('/createMember', { templateUrl: '/partials/createMember/create-member',
      resolve: routeRoleChecks.admin
    })
    .otherwise({
      templateUrl: '/partials/invalidPage/invalidPage'
    });
}]);

/**
 * If any route is attempted that the user is not authorized for then send
 * the user back to the home page
 */
angular.module('app').run(["$rootScope", "$location", "notifierService", function($rootScope, $location, notifierService) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if (rejection === 'not authorized') {
      $location.path('/views/login/login');
      notifierService.error('You do not have access to that page, please login first');
    }
  });
}]);
angular.module('app').factory('Campaign', ['$resource', Campaign]);
function Campaign($resource) {
  var campaign = $resource('/api/campaigns', {}, {});
  return campaign;
}
angular.module('app').factory('Inventory', ['$resource', Inventory]);
function Inventory($resource) {
  var inventory = $resource('/api/inventoryItems', {}, {});
  return inventory;
}
angular.module('app').factory('Member', ['$resource', Member]);
function Member($resource) {
  var member = $resource('/api/members', {}, {
    'query':  {method:'GET', isArray:true, cache: true}
  });
  return member;
}
angular.module('app').factory('User', ['$resource', User]);
function User($resource) {
  var user = $resource('/api/users/:id', {id: '@_id'}, {});

  user.prototype.isAdmin = function() {
    return this.roles && this.roles.indexOf('admin') > -1;
  };

  user.prototype.isBoard = function() {
    return this.roles && this.roles.indexOf('board') > -1;
  };

  return user;
}
angular.module('app').factory('Video', ['$resource', Video]);
function Video($resource) {
  var video = $resource('/api/videos', {}, {
    'query':  {method:'GET', isArray:true, cache: true}
  });
  return video;
}
angular.module('app').factory('authorizationService', ['$http', '$q', 'identityService', 'User', authorizationService]);
function authorizationService($http, $q, identityService, User) {
  return {
    authenticateUser: function(username, password) {
      var deferred = $q.defer();
      $http.post('/login', {username: username, password: password}).then(function(response) {
        if (response.data.success) {
          var user = new User();
          angular.extend(user, response.data.user);
          identityService.currentUser = user;
          deferred.resolve(true);
        } else {
          deferred.resolve(false);
        }
      } );
      return deferred.promise;
    },

    logoutUser: function() {
      var deferred = $q.defer();
      $http.post('/logout', {logout:true}).then(function() {
        identityService.currentUser = undefined;
        deferred.resolve();
      });
      return deferred.promise;
    },

    authorizeAuthorizedUserForRoute: function(role) {
      if (identityService.isAuthorized(role)) {
        return true;
      } else {
        return $q.reject('not authorized');
      }
    },

    authorizeAuthenticatedUserForRoute: function() {
      if (identityService.isAuthenticated()) {
        return true;
      } else {
        return $q.reject('not authorized');
      }
    },

    createUser: function(newUserData) {
      var newUser = new User(newUserData);
      var deferred = $q.defer();

      newUser.$save().then(function() {
        identityService.currentUser = newUser;
        deferred.resolve();
      }, function(response) {
        deferred.reject(response.data.reason);
      });

      return deferred.promise;
    }
  };
}
angular.module('app').factory('campaignService', ['$q', '$http', 'Campaign', campaignService]);
function campaignService($q, $http, Campaign) {
  return {
    getCampaigns: function() {
      return Campaign.query().$promise;
    },
    getCampaign: function(name) {
      // because we need to get a html file as the content for a given campaign
      // we must use the $http.get method and not the Campaign resource.  The Campaign
      // resource will only give us json as a $resource result but $http.get will give us
      // our desired html in the response.
      var deferred = $q.defer();
      $http.get('/api/campaigns/' + name).then(function(response) {
        deferred.resolve(response.data);
      });
      return deferred.promise;
    }
  };
}
angular.module('app').factory('identityService', ['$window', 'User', identityService]);
function identityService($window, User) {
  var currentUser;
  if ($window.bootstrappedUserObject) {
    currentUser = new User();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }
  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
    },
    isAdmin: function() {
      return !!this.currentUser && this.currentUser.roles.indexOf('admin') > -1;
    },
    isBoard: function() {
      return !!this.currentUser && this.currentUser.roles.indexOf('board') > -1;
    }
  };
}
angular.module('app').factory('inventoryService', ['Inventory', inventoryService]);
function inventoryService(Inventory) {
  return {
    getInventoryItems: function() {
      return Inventory.query().$promise;
    }
  };
}
angular.module('app').factory('memberService', ['$q', '$http', 'Member', memberService]);
function memberService($q, $http, Member) {
  return {
    getMembers: function() {
      return Member.query().$promise;
    },
    getMember: function(name) {
      // because we need to get a html file as the content for a given member
      // we must use the $http.get method and not the Member resource.  The Member
      // resource will only give us json as a $resource result but $http.get will give us
      // our desired html in the response.
      var deferred = $q.defer();
      $http.get('/api/members/' + name).then(function(response) {
        deferred.resolve(response.data);
      });
      return deferred.promise;
    }
  };
}
angular.module('app').factory('notifierService', ['toastrService', notifierService]);
function notifierService(toastrService) {
  return {
    notify: function(msg) {
      toastrService.success(msg);
    },
    error: function(msg) {
      toastrService.error(msg);
    }
  };
}
/**
 * An angular wrapper around toastr so that it is available as an injectible service
 */
angular.module('app').service('toastrService', ToastrWrapper);

function ToastrWrapper() {
  toastr.options = {
    'closeButton': true,
    'debug': false,
    'positionClass': 'toast-bottom-full-width',
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
  };
  return toastr;
}
angular.module('app').factory('userService', ["$q", "User", function($q, User) {
  return {
    getUsers: function() {
      return User.query();
    },

    getUser: function(id) {
      return User.get({id: id});
    },

    deleteUser: function(user) {
      var dfd = $q.defer();
      user.$delete().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },

    saveUserDataAsNewUser: function(userData) {
      var user = new User(userData);
      var dfd = $q.defer();
      user.$save().then(function(user) {
        dfd.resolve(user);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },

    saveUser: function(user) {
      var deferred = $q.defer();
      user.$save().then(function(user) {
        deferred.resolve(user);
      }, function(response) {
        deferred.reject(response.data.reason);
      });
      return deferred.promise;
    }
  };
}]);
angular.module('app').factory('videoService', ['$q', '$http', 'Video', videoService]);
function videoService($q, $http, Video) {
  return {
    getVideos: function() {
      return Video.query().$promise;
    },
    getVideo: function(name) {
      // because we need to get a html file as the content for a given video
      // we must use the $http.get method and not the Video resource.  The Video
      // resource will only give us json as a $resource result but $http.get will give us
      // our desired html in the response.
      var deferred = $q.defer();
      $http.get('/api/videos/' + name).then(function(response) {
        deferred.resolve(response.data);
      });
      return deferred.promise;
    }
  };
}
angular.module('app').controller('adminCtrl', adminCtrl);
adminCtrl.$inject = ['$scope', '$location', 'notifierService', 'authorizationService'];
function adminCtrl($scope, $location, notifierService, authorizationService) {
  $scope.createUser = function () {
    var newUserData = {
      username: $scope.username,
      password: $scope.password,
      firstName: $scope.firstName,
      lastName: $scope.lastName
    };

    authorizationService.createUser(newUserData).then(function () {
      notifierService.notify('User account created!');
      $location.path('/');
    }, function (reason) {
      notifierService.error(reason);
    });
  };
}
angular.module('app').controller('campaignsCtrl', campaignsCtrl);
campaignsCtrl.$inject = ['$scope', '$sce', 'campaignService'];
function campaignsCtrl($scope, $sce, campaignService) {
  $scope.selectedCampaignHtml = '';
  campaignService.getCampaigns().then(function(campaigns) {
    $scope.campaigns = campaigns;
    for (var i = 0; i < campaigns.length; i++) {
      if (campaigns[i].name === '2014-01-01 Miles To The Moon') {
        $scope.selectCampaign(campaigns[i]);
      }
    }
  });

  $scope.selectCampaign = function(campaign) {
    campaignService.getCampaign(campaign.name).then(function(campaignHtml) {
      // use $sce.trustAsHtml to tell angular that the html received is 'safe' to display
      $scope.selectedCampaignHtml = $sce.trustAsHtml(campaignHtml);
    });
  };
}


angular.module('app').controller('createMemberCtrl', createMemberCtrl);
createMemberCtrl.$inject = ['$scope', '$location', 'notifierService', 'userService'];
function createMemberCtrl($scope, $location, notifierService, userService) {
  $scope.username = '';
  $scope.password = '';
  $scope.roles = [];

  $scope.createMember = function() {
    // if the form is valid then submit to the server
    if ($scope.createMemberForm.$valid) {
      var newUser = {
        username: $scope.username,
        roles: $scope.roles
      };
      if($scope.password && $scope.password.length > 0) {
        newUser.password = $scope.password;
      }

      userService.saveUserDataAsNewUser(newUser).then(function() {
        notifierService.notify('User ' + newUser.username + ' has been created');
        $location.path('/views/userList/user-list');
      }, function(reason) {
        notifierService.error(reason);
      });
    }
  };
}
angular.module('app').controller('loginCtrl', loginCtrl);
loginCtrl.$inject = ['$scope', '$location', 'notifierService', 'authorizationService'];
function loginCtrl($scope, $location, notifierService, authorizationService) {
  $scope.login = function() {
    authorizationService.authenticateUser($scope.loginUsername, $scope.loginPassword).then(function(success) {
      if (success) {
        notifierService.notify('You have successfully signed in!');
        $location.path('/');
      } else {
        notifierService.error('Username/Password combination incorrect');
      }
    });
  };
}
angular.module('app').controller('membersCtrl', membersCtrl);
membersCtrl.$inject = ['$scope', '$sce', '$location', 'memberService'];
function membersCtrl($scope, $sce, $location, memberService) {
  $scope.selectedMember = undefined;
  $scope.selectedMemberHtml = '';

  var selectedMemberName = ($location.hash()) ? $location.hash() : 'Adam Driscoll';

  memberService.getMembers().then(function(members) {
    if (angular.isUndefined($scope.allMembers)) {
      $scope.allMembers = members;
      $scope.membersColumn1 = members.slice(0, (members.length / 2));
      $scope.membersColumn2 = members.slice((members.length / 2), members.length);
      for (var i = 0; i < members.length; i++) {
        if (members[i].name === selectedMemberName) {
          $scope.selectMember(members[i]);
        }
      }
    }
  });

  $scope.selectMember = function(member) {
    $scope.selectedMember = member;
    memberService.getMember(member.name).then(function(memberHtml) {
      // use $sce.trustAsHtml to tell angular that the html received is 'safe' to display
      $scope.selectedMemberHtml = $sce.trustAsHtml(memberHtml);
      $location.hash(member.name);
    });
  };
}

angular.module('app').controller('navbarLoginCtrl', navbarLoginCtrl);
navbarLoginCtrl.$inject = ['$scope', '$location', 'identityService', 'notifierService', 'authorizationService'];
function navbarLoginCtrl($scope, $location, identityService, notifierService, authorizationService) {
  $scope.identityService = identityService;

  $scope.signout = function() {
    authorizationService.logoutUser().then(function() {
      $scope.username = '';
      $scope.password = '';
      notifierService.notify('You have successfully signed out!');
      $location.path('/');
    });
  };

  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };
}

angular.module('app').controller('resultsCtrl', resultsCtrl);
resultsCtrl.$inject = ['$scope', '$sce', 'videoService'];
function resultsCtrl($scope, $sce, videoService) {
  $scope.selectedVideoHtml = '';

  videoService.getVideos().then(function(videos) {
    $scope.videos = videos;
    for (var i = 0; i < videos.length; i++) {
      if (videos[i].name === '2014--04-06 AFC Sugar Hill XC') {
        $scope.selectVideo(videos[i]);
      }
    }
  });

  $scope.selectVideo = function(video) {
    videoService.getVideo(video.name).then(function(videoHtml) {
      // use $sce.trustAsHtml to tell angular that the html received is 'safe' to display
      $scope.selectedVideoHtml = $sce.trustAsHtml(videoHtml);
    });
  };
}


angular.module('app').controller('inventoryCtrl', inventoryCtrl);
inventoryCtrl.$inject = ['$scope', 'inventoryService'];
function inventoryCtrl($scope, inventoryService) {
  $scope.inventoryItems = {};
  inventoryService.getInventoryItems().then(function(inventoryItems) {
    for (var i = 0; i < inventoryItems.length; i++) {
      var inventoryItem = inventoryItems[i];
      if (angular.isUndefined($scope.inventoryItems[inventoryItem.category])) {
        $scope.inventoryItems[inventoryItem.category] = [];
      }
      $scope.inventoryItems[inventoryItem.category].push(inventoryItem);
    }
  });
}

