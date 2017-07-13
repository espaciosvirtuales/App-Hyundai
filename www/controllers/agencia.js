function service_agencia(app) {
app.service('agenciaMazda',function($http) {
	
	var headers = {
			'Aldorf-API-Key': 'e6d214d3-6393-5794-becc-2cad82e4cc9b',
			'Aldorf-Session-Key': window.localStorage.getItem('session_hash'),
			'Aldorf-App': 'suzuki'
		};
	
	this.cargar_fechas = function(agencia, callback) {
		//console.log(agencia);
		if(!agencia) {
			return;
		}
		$http({
			method: 'GET',
			url: 'http://api.grupoaldorf.com.mx/agencia/'+agencia+'/agenda',
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