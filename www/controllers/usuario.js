function service_usuarios(app) {

	// usuario Mazda
	app.service('usuarioMazda', function ($http, $location) {
		
		// determinar las cabeceras de la app
		// la sesión se envía en la cabecera
		var headers = {
			'Aldorf-API-Key': window.localStorage.getItem('token'),
			'Aldorf-Session-Key': window.localStorage.getItem('session_hash'),
			'Aldorf-App': 'hyundai'
		};
		
		this.headers = headers;
		
		
		this.registrar_push = registrar_push;
		
		function registrar_push() {
			postdata = {
				push_id: window.localStorage.getItem('push_id')
			}
			$http({
				method: 'PUT',
				url: 'http://api.grupoaldorf.com.mx/usuario/push',
				headers: headers,
				data: postdata
			}).then(function successCallback(response) {
				console.log('se registró el PUSH ID');
			}, function errorCallback(response) {
				console.log(response.statusText);
			});
		};

		/**
		 * Ingresar usuario		
		 * TODO: testin
		 */
		this.ingresar = function (correo, contrasena) {
			$http({
				method: 'POST',
				url: 'http://api.grupoaldorf.com.mx/login',
				headers: headers,
				data: {
					email: correo,
					password: contrasena
				}
			}).then(function successCallback(response) {
				window.localStorage.setItem('session_hash', response.data.sesion);
				window.localStorage.setItem('token', response.data.token);
				registrar_push();
				$location.path('/dashboard');
			}, function errorCallback(response) {
				if(typeof response.data != 'string')
					response.data = Object.values(response.data).toString();
				showAlert(response.data, 'Error de ingreso');
			});
		};
		
		
		this.cerrar_sesion = function () {
			window.localStorage.removeItem('session_hash');
		};

		this.checar_sesion = function(autorizado) {
			headers['Aldorf-Session-Key'] = window.localStorage.getItem('session_hash');
			headers['Aldorf-API-Key'] = window.localStorage.getItem('token');
			var push = window.localStorage.getItem('push_id');
			console.log(push);
			$http({
				method: 'GET',
				url: 'http://api.grupoaldorf.com.mx/usuario',
				headers: headers
			}).then(function successCallback(response) {
				
				var usuario = response.data;
				autorizado(usuario);
				
				if (usuario.push_id != window.localStorage.getItem('push_id')){
					registrar_push();
				}
				
			}, function errorCallback(response) {
				header = {};
				$location.path('/login');
			});
		};
		
		/**
		 * Hacer cita ------ TODO: DO THIS!!!!
		 */ 
		this.hacer_cita = function(cita,agencia,callback) {
			$http({
				method: 'POST',
				url: 'http://api.grupoaldorf.com.mx/agencia/'+agencia+'/cita',
				headers: headers,
				data: cita
			}).then(function successCallback(response) {
				showAlert('Su cita se ha agendado con éxito. Checa tu correo para tu confirmación.', 'Cita agendada');
				$location.path('/dashboard');
			}, function errorCallback(response) {
				callback(false);
			});
		}
		

		this.cargar_autos = function(callback) {
			$http({
				method: 'GET',
				url: 'http://api.grupoaldorf.com.mx/usuario/vehiculos',
				headers: headers
			}).then(function successCallback(response) {
				var autos = response.data;
				callback(autos);
			}, function errorCallback(response) {
				callback(false);
			});
		};

		this.registrar_usuario = function(data,callback) {
			postdata = {
				nombre: data.nombre,
				compania: data.compania,
				telefono: data.telefono,
				celular: data.celular,
				password: data.contrasena,
				password_confirmation: data.rep_contrasena,
				email: data.correo,
				push_id: null
			}
			
			postdata.push_id = window.localStorage.getItem('push_id');
			
			$http({
				method: 'POST',
				url: 'http://api.grupoaldorf.com.mx/registrar',
				headers: headers,
				data: postdata
			}).then(function successCallback(response) {
				showAlert('Gracias por registrarte. Ahora podrás agregar un carro a tu cuenta y hacer citas de servicio.', 'Registro Exitoso!');
				callback();
			}, function errorCallback(response) {
				if(typeof response.data != 'string')
					response.data = Object.values(response.data).toString();
				showAlert(response.data,'Error de registro');
			});
			
		};


		this.restablecer_contrasena = function(param) {
			data = {
				email: param.email,
				codigo: param.codigo,
				password: param.password,
				password_confirmation: param.password
			}
			$http({
				method: 'POST',
				url: 'http://api.grupoaldorf.com.mx/restablecer',
				headers: headers,
				data: data
			}).then(function successCallback(response) {
				showAlert(response.data,'Éxito');
				$location.path('/dashboard');
			}, function errorCallback(response) {
				if(typeof response.data != 'string')
					response.data = Object.values(response.data).toString();
				showAlert(response.data,'Error');
				console.log(reponse.statusText);
			});
		};


		this.recuperar_contrasena = function(param) {
			data = {
				email: param
			}
			$http({
				method: 'POST',
				url: 'http://api.grupoaldorf.com.mx/recuperar',
				headers: headers,
				data: data
			}).then(function successCallback(response) {
				showAlert(response.data,'Éxito');
				$location.path('/restablecer_contrasena');
			}, function errorCallback(response) {
				if(typeof response.data != 'string')
					response.data = Object.values(response.data).toString();
				showAlert(response.data,'Error');
				console.log(response.statusText);
			});
		};

		this.registrar_auto = function(param, callback) {
			var session_hash = window.localStorage.getItem('session_hash');
			data = {
				vehiculo: param.vehiculo,
				modelo: param.modelo,
				color: param.color,
				serie: param.serie
			}
			$http({
				method: 'POST',
				url: 'http://api.grupoaldorf.com.mx/usuario/vehiculo',
				headers: headers,
				data: data
			}).then(function successCallback(response) {
				callback(true);
			}, function errorCallback(response) {
				if(typeof response.data != 'string')
					response.data = Object.values(response.data).toString();
				showAlert(response.data,'Error');
				callback(false);
			});
		};

		this.eliminar_auto = function(data, callback) {
			var session_hash = window.localStorage.getItem('session_hash');
			$http({
				method: 'DELETE',
				url: 'http://api.grupoaldorf.com.mx/usuario/vehiculo/'+data.vehiculo,
				headers: headers
			}).then(function successCallback(response) {
				callback(true);
			}, function errorCallback(response) {
				if(typeof response.data != 'string')
					response.data = Object.values(response.data).toString();
				showAlert(response.data,'Error');
				callback(false);
			});
		};
	});
}
