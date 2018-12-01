/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

'use strict';

document.addEventListener('deviceready', function () {

	// Enable to debug issues.
	/*window.plugins.OneSignal.setLogLevel({
		logLevel: 4,
		visualLevel: 4
	});*/

//  var notificationOpenedCallback = function (jsonData) {
//    console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
//  };
//
//  /*window.plugins.OneSignal
//     .startInit("4d67f342-1f8a-49e8-b466-0097dfaf12a1", "15796307218")
//     .handleNotificationOpened(notificationOpenedCallback)
//     .endInit(); */
//
//  window.plugins.OneSignal.init("4d67f342-1f8a-49e8-b466-0097dfaf12a1", {
//      googleProjectNumber: "15796307218"
//    },
//    notificationOpenedCallback);
//
//  // Show an alert box if a notification comes in when the user is in your app.
//  window.plugins.OneSignal.enableInAppAlertNotification(true);
//
//  window.plugins.OneSignal.getIds(function (ids) {
//    /* save in storage */
//    window.localStorage.setItem('push_id', ids.userId);
//    console.log('Registered PUSH_ID');
//    console.log(window.localStorage.getItem('push_id'));
//  });
                          
var iosSettings = {};
iosSettings["kOSSettingsKeyAutoPrompt"] = true;
iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;

window.plugins.OneSignal
.startInit("4d67f342-1f8a-49e8-b466-0097dfaf12a1")
.iOSSettings(iosSettings)
.handleNotificationReceived(function(jsonData) {
alert("Notification received:\n" + JSON.stringify(jsonData));
console.log('Did I receive a notification: ' + JSON.stringify(jsonData));
})
.endInit();

window.plugins.OneSignal.getPermissionSubscriptionState(function(status) {
window.localStorage.setItem('push_id',status.subscriptionStatus.userId);
//  showAlert(status.subscriptionStatus.userId, "mensaje");
});
                          
	if (cordova.platformId == 'android') {
		StatusBar.backgroundColorByHexString("#333");
	}

	hidebar();

}, false);

function hidebar() {
	if (typeof StatusBar !== 'undefined')
		StatusBar.overlaysWebView(true);
}

function showbar() {
	if (typeof StatusBar !== 'undefined')
		StatusBar.overlaysWebView(false);
}

function showAlert(message, title) {
	if (navigator.notification) {
		navigator.notification.alert(message, null, title, 'OK');
	} else {
		alert(title ? (title + ": " + message) : message);
	}
}

function showConfirm(message, title) {
	if (navigator.notification) {
		var confirmed = true;
		navigator.notification.confirm(message, function () {
			confirmed = false;
		}, title, 'OK');
		return confirmed;
	} else {
		return confirm(title ? (title + ": " + message) : message);
	}
}

init();

function init() {

	$(function () {
		FastClick.attach(document.body);
	});

	var app = angular.module('AldorfApp', ['ngRoute', 'ngAnimate', 'ngSanitize']);

	app.config(function ($routeProvider, $httpProvider) {

		if (!$httpProvider.defaults.headers.get) {
			$httpProvider.defaults.headers.get = {};
		}

		// Answer edited to include suggestions from comments
		// because previous version of code introduced browser-related errors

		//disable IE ajax request caching
		$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		// extra
		$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
		$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

		$routeProvider
			.when('/', {
				templateUrl: 'partials/main.html',
				controller: 'MainCtrl'
			})
			.when('/emergencias', {
				templateUrl: 'partials/emergencias.html',
				controller: 'CreateCtrl'
			})
			.when('/collision-center', {
				templateUrl: 'partials/emergencias.html',
				controller: 'CreateCtrl'
			})
			.when('/login', {
				templateUrl: 'partials/citas/login.html',
				controller: 'LoginCtrl'
			})
			.when('/dashboard', {
				templateUrl: 'partials/citas/dashboard.html',
				controller: 'DashboardCtrl'
			})
			.when('/historial', {
			  templateUrl: 'partials/citas/historial.html',
			  controller: 'HistorialCtrl'
			})
			.when('/registro', {
				templateUrl: 'partials/citas/registrar_usuario.html',
				controller: 'RegistroCtrl'
			})
			.when('/editar_datos', {
			  templateUrl: 'partials/citas/editar_datos.html',
			  controller: 'EditCtrl'
			})
			.when('/restablecer_contrasena', {
				templateUrl: 'partials/citas/restablecer_contrasena.html',
				controller: 'RestablecerContrasenaCtrl'
			})
			.when('/collision_center', {
				templateUrl: 'partials/citas/collision_center.html',
				controller: 'CollisionCenterCtrl'
			})
			.when('/olvide_contrasena', {
				templateUrl: 'partials/citas/olvide_contrasena.html',
				controller: 'OlvideContrasenaCtrl'
			})
			.when('/registrar_auto', {
				templateUrl: 'partials/citas/anadir_carro.html',
				controller: 'RegistroAutoCtrl'
			})
			.when('/cita', {
				templateUrl: 'partials/citas/hacer_cita.html',
				controller: 'CitasCtrl'
			})
			.when('/precios', {
				templateUrl: 'partials/precios.html',
				controller: 'PreciosCtrl'
			})
			.when('/ubicaciones', {
				templateUrl: 'partials/ubicaciones_ios.html',
				controller: 'CreateCtrl'
			})
			.when('/garantia_extendida', {
				templateUrl: 'partials/garantia_extendida.html',
				controller: 'CreateCtrl'
			})
			.when('/tumazda', {
	      templateUrl: 'partials/tumazda/tumazda.html',
	      controller: 'TuMazdaCtrl'
	    })
	    .when('/cambiollantas', {
	      templateUrl: 'partials/tumazda/cambiollantas.html',
	      controller: 'CambioLlantasCtrl'
	    })
	    .when('/cargabateria', {
	      templateUrl: 'partials/tumazda/cargabateria.html',
	      controller: ''
	    })
	    .when('/calibracionllantas', {
	      templateUrl: 'partials/tumazda/calibracionllantas.html',
	      controller: ''
	    })
	    .when('/simbolos', {
	      templateUrl: 'partials/tumazda/simbolos.html',
	      controller: ''
	    })
	    .when('/mazdatips', {
	      templateUrl: 'partials/tumazda/mazdatips.html',
	      controller: 'MazdaTipsCtrl'
	    })
			.otherwise({
				redirectTo: '/'
			});
	});

	service_usuarios(app);
	service_agencia(app);
	init_controllers(app);

};
