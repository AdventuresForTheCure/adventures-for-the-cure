angular.module('app', ['ngResource', 'ngRoute', 'ui.bootstrap']);

angular.module('app').config(function($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    admin: { auth: function(authorizationService) {
      return authorizationService.authorizeAuthorizedUserForRoute('admin')
    }},
    board: { auth: function(authorizationService) {
      return authorizationService.authorizeAuthorizedUserForRoute('board')
    }},
    user: { auth: function(authorizationService) {
      return authorizationService.authorizeAuthenticatedUserForRoute()
    }}
  }

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
    .when('/campaigns', { templateUrl: '/partials/campaigns/campaigns'
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
    .when('/views/login/login', { templateUrl: '/partials/login/login',
      controller: 'loginCtrl'
    })
    .when('/views/profile/profile', { templateUrl: '/partials/profile/profile',
      controller: 'profileCtrl', resolve: routeRoleChecks.user
    })
    .when('/views/userEdit/user-edit/:id', { templateUrl: '/partials/userEdit/user-edit',
      controller: 'userEditCtrl', resolve: routeRoleChecks.admin
    })
    .when('/views/userList/user-list', { templateUrl: '/partials/userList/user-list',
      controller: 'userListCtrl', resolve: routeRoleChecks.admin
    })
    .when('/views/userCreate/user-create', { templateUrl: '/partials/userCreate/user-create',
      controller: 'userCreateCtrl', resolve: routeRoleChecks.admin
    })
    .otherwise({
      templateUrl: '/partials/invalidPage/invalidPage'
    });
});

/**
 * If any route is attempted that the user is not authorized for then send
 * the user back to the home page
 */
angular.module('app').run(function($rootScope, $location, notifierService) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if (rejection === 'not authorized') {
      $location.path('/views/login/login');
      notifierService.error('You do not have access to that page, please login first');
    }
  });
});

angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
  .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {
  }]).directive('carousel', [function () {
    return {

    }
  }]);