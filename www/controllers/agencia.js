function service_agencia(app) {
app.service('agenciaMazda',function($http) {

	var headers = {
			'Aldorf-API-Key': window.localStorage.getItem('token'),
			'Aldorf-Session-Key': window.localStorage.getItem('session_hash'),
			'Aldorf-App': 'hyundai'
		};

	this.cargar_fechas = function(agencia, callback) {
		//console.log(agencia);
		if(!agencia) {
			return;
		}
		$http({
			method: 'GET',
			url: 'http://api.grupoaldorf.com.mx/agencia/'+agencia+'/agenda',
		  //url: 'http://api-beta.grupoaldorf.com.mx/agencia/'+agencia+'/agenda',
			headers: headers
		}).then(function successCallback(response) {
			//console.log(response.data.fechas);
			callback(response.data.fechas);
		}, function errorCallback(response) {
			callback(false);
			//console.log(response);
		});
	};

	this.cargar_horas = function(param, callback) {
		data = {
			fecha: param.fecha,
			tiposervicio: param.tiposervicio
		};
		if(!param.agencia) {
			return;
		}
		$http({
			method: 'GET',
			url: 'http://api.grupoaldorf.com.mx/agencia/'+param.agencia+'/horas?fecha='+param.fecha+'&tiposervicio='+param.tiposervicio,
			//url: 'http://api-beta.grupoaldorf.com.mx/agencia/'+param.agencia+'/horas?fecha='+param.fecha+'&tiposervicio='+param.tiposervicio,
			headers: headers,
			data: data
		}).then(function successCallback(response) {
			callback(response.data);
		}, function errorCallback(response) {
			callback(false);
			//console.log(response);
		});
	};
});
}
