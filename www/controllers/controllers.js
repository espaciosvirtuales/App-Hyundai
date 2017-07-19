function init_controllers(app) {
	app.controller('MainCtrl', function ($scope, usuarioMazda) {

		console.log('MainCtrl init');
		$scope.usuario = null;
		$scope.link_citas = '#dashboard';
		$scope.link_collision = '#collision_center';


		/** se usa para desarrollo unicamente, al dar click at logotipo se cierra la sesion **/
		$scope.logout = function () {
			usuarioMazda.cerrar_sesion();
		}

		hidebar();

		$scope.$on('$destroy', function () {
			showbar();
		});

	});

	app.controller('PreciosCtrl', function ($scope, $http, $sce) {

		$scope.tab_mant = 'mant';

		$http.get('json_files/mantenimiento.json')
			.then(function (response) {
				$scope.mantenimiento = [];
				$.each(response.data, function (i, v) {
					$scope.mantenimiento[i] = v;
					$scope.mantenimiento[i].contenido = $sce.trustAsHtml(v.contenido);
				});
			});

		$http.get('json_files/garantia_extendida.json')
			.then(function (response) {
				$scope.garantia_extendida = [];
				$.each(response.data, function (i, v) {
					$scope.garantia_extendida[i] = v;
					$scope.garantia_extendida[i].contenido = $sce.trustAsHtml(v.contenido);
				});
			});

	});

	app.controller('DashboardCtrl', function ($scope, $location, usuarioMazda) {

		usuarioMazda.checar_sesion(function autorizado(usuario) {
			$scope.usuario = usuario;
			usuarioMazda.cargar_autos(function (autos) {
				$scope.autos = autos;
			})

			$scope.contrasena_actual = null;
			$scope.contrasena_nueva = null;
			$scope.confirmar_contrasena = null;
			$scope.cambio = false;

			$scope.eliminar_auto = eliminar_auto;

			function eliminar_auto(id_vehiculo) {
				console.log("Eliminar auto: " + id_vehiculo);
				var data = {
					vehiculo: id_vehiculo
				};
				usuarioMazda.eliminar_auto(data, function (resultado) {
					if (resultado) {
						jQuery.each($scope.autos, function (index, value) {
							if (value.id == id_vehiculo)
								$scope.autos.splice(index, 1);
						});
					}
				});
			}
		});

	});

	app.controller('CitasCtrl', function ($scope, $location, usuarioMazda, agenciaMazda, $http, $sce) {

		$scope.agencias = [];
	 	$http({
	 			method: 'GET',
	 			url: 'http://api-beta.grupoaldorf.com.mx/agencias/',
	 			headers: agenciaMazda.headers
	 		}).then(function successCallback(response) {
				console.log(response);
				$scope.agencias = response.data;
				console.log("regreso del http");
				console.log($scope.agencias);
	 		}, function errorCallback(response) {
	 			//callback(false);
	 		});

		usuarioMazda.checar_sesion(function (usuario) {
			$scope.usuario = usuario;
			/*$scope.agencias = [
				{
					codigo: 'MO',
					nombre: 'Hyundai Cumbres'
							},
				{
					codigo: 'MT',
					nombre: 'Hyundai Tampico'
				}
			];*/
			$scope.form = {
				agencia: null,
				carro: null,
				fecha: null,
				hora: null,
				tiposervicio: 'mantenimiento',
				reparacion: null,
				mantenimiento: null
			};

			$scope.fechas = null;
			$scope.horas = null;
			$scope.agendada = false;
			$scope.mensaje = '';
			$scope.cargando = false;


			$scope.agendar = function () {

				console.log('Hacer Cita');
				data = $scope.form;
				data.vehiculo = $scope.autos[$scope.form.carro];
				data.agencia = $scope.form.agencia;
				$scope.cargando = true;

				$http({
					method: 'POST',
					//url: 'http://api.grupoaldorf.com.mx/agencia/' + data.agencia + '/cita',
					url: 'http://api-beta.grupoaldorf.com.mx/agencia/' + data.agencia + '/cita',
					headers: usuarioMazda.headers,
					data: data
				}).then(function successCallback(response) {
					$scope.agendada = true;
					$scope.mensaje = $sce.trustAsHtml(response.data);
					$scope.cargando = false;
					$scope.apply();
				}, function errorCallback(response) {
					showAlert('Ha ocurrido un error. Por favor intenta de nuevo más tarde.', 'Error al agendar tu cita');
					$location.path('/dashboard');
				});
			};

			/** Cargar autos **/
			usuarioMazda.cargar_autos(function (autos) {
				$scope.autos = autos;
			})

			$scope.$watch('form.agencia', function () {
				if ($scope.horas) {
					$scope.horas = null;
				}
				if ($scope.fechas) {
					$scope.fechas = null;
				}
				agenciaMazda.cargar_fechas($scope.form.agencia, function (fechas) {
					if (fechas !== false)
						$scope.fechas = fechas;
				})
			}, true);

			$scope.$watch('form.fecha', function () {
				var params = {
					agencia: $scope.form.agencia,
					fecha: $scope.form.fecha,
					tiposervicio: $scope.form.tiposervicio
				}
				agenciaMazda.cargar_horas(params, function (horas) {
					$scope.horas = horas;
					//console.log(horas);
				})
			}, true);
		});




	});

	app.controller('RegistroAutoCtrl', function ($scope, $location, usuarioMazda) {

		usuarioMazda.checar_sesion(function (usuario) {
			$scope.usuario = usuario;
			$scope.vehiculo = null;
			$scope.modelo = null;
			$scope.color = null;
			$scope.serie = null;

			$scope.registrar_auto = registrar_auto;

			function registrar_auto() {
				var params = {
					vehiculo: $scope.vehiculo,
					modelo: $scope.modelo,
					color: $scope.color,
					serie: $scope.serie
				}
				usuarioMazda.registrar_auto(params, function (resultado, mensaje) {
					if (resultado) {
						$location.path('/dashboard');
					} else {
						showAlert(mensaje, 'Algo salió mal');
					}
					console.log(mensaje);
				});
			}
		});

	});

	app.controller('LoginCtrl', function ($scope, $location, usuarioMazda) {

		usuarioMazda.checar_sesion(function (usuario) {
			$location.path('/dashboard');
		});

		$scope.ingresar = function () {
			if (usuarioMazda.ingresar($scope.correo, $scope.contrasena)) {
				$location.path('/dashboard');
			}
		}
	});

	app.controller('RegistroCtrl', function ($scope, $location, usuarioMazda) {

		$scope.usuario = {};
		$scope.usuario.nombre = null;
		$scope.usuario.compania = null;
		$scope.usuario.telefono = null;
		$scope.usuario.password = null;
		$scope.usuario.password_confirmation = null;
		$scope.usuario.email = null;
		$scope.usuario.push_id = window.localStorage.getItem('push_id'),

			$scope.registro = function () {
				if ($scope.usuario.password == $scope.usuario.password_confirmation) {
					usuarioMazda.registrar_usuario($scope.usuario,function() {
						$scope.usuario = {};
						$location.path('/login');
					});
				} else {
					showAlert('Las contraseñas no coinciden.', 'Error');
				}
			}
	});

	app.controller('OlvideContrasenaCtrl', function ($scope, $location, usuarioMazda) {

		$scope.email = null,

			$scope.recuperar = function () {
				console.log($scope.email);
				if ($scope.email !== null) {
					usuarioMazda.recuperar_contrasena($scope.email);
				} else {
					showAlert('El correo es obligatorio', 'Error');
				}
			}
	});

	app.controller('RestablecerContrasenaCtrl', function ($scope, $location, usuarioMazda) {

		$scope.param = {};
		$scope.param.codigo = null;
		$scope.param.password = null;
		$scope.param.password_confirmation = null;

		$scope.restablecer = function () {
			if ($scope.param.codigo != null && $scope.param.password != null && $scope.param.password_confirmation != null && $scope.param.password_confirmation == $scope.param.password) {
				usuarioMazda.restablecer_contrasena($scope.param);
			} else if ($scope.param.password != $scope.param.password_confirmation) {
				showAlert('Las contraseñas no coinciden', 'Error');
			} else {
				showAlert('Todos los campos son obligatorios', 'Error');
				console.log($scope.param);
			}
		}
	});


	app.controller('CollisionCenterCtrl', function ($scope, $location, usuarioMazda, $sce) {

		usuarioMazda.checar_sesion(function (usuario) {
			$scope.usuario = usuario;
			$scope.param = {};
			$scope.param.orden = null;
			$scope.param.email = null;
			$scope.param.json = '';
			$scope.param.boton = '';
			$scope.informacion = null;
			$scope.showinfo = false;

			function renderMensaje(mensaje) {
				$scope.informacion = $sce.trustAsHtml(mensaje);
				$scope.showinfo = true;
				$scope.$apply();
				console.log('success');
			}

			$scope.enviar = function () {
				console.log($scope.param);
				$.ajax({
					url: 'http://mazdavalle.com.mx/collision-center/',
					method: 'POST',
					data: $scope.param,
					error: function (a, b, c) {
						swal({
							title: "Error de AJAX",
							text: JSON.stringify(a),
							type: "error",
							confirmButtonText: "Cerrar"
						});
					},
					dataType: 'json',
					success: function (data) {
						if (data.error) {
							showAlert(data.mensaje, 'Error');
							console.log('error');
						} else if (data.error === false) {
							renderMensaje(data.mensaje);
						}
					} //success
				}); //ajax
			};

		});

	});


}
