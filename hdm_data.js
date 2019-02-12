module.exports = function(cmd, callback){
	var oauth = require('./oauth.js');
	var https = require('https');
	var nbi_label = "nbi";
	var nbi_host = process.env[nbi_label+"_IP_ADDRESS"];
	var nbi_port = process.env[nbi_label+"_TCP_9999_PORT"];
	var product_id = process.env.CAF_SYSTEM_PRODUCT_ID;
	var serial_id = process.env.CAF_SYSTEM_SERIAL_ID;
	var device_id = product_id+":"+serial_id;

	oauth.get_oauth(function(oauth_token) {
		console.log('oauth in getdata:');
		console.log(oauth_token);

		var hdm_data_type = cmd;
		if(hdm_data_type) {
			var payload = hdm_data_type;
			var header = {
				"Content-Type": "text/plain",
				"Authorization": "Bearer "+oauth_token,
				'Content-Length': Buffer.byteLength(payload)
			};
			var options = {
				host: nbi_host,
				port: nbi_port,
				path: '/api/v1/mw/hdmrpc/showcmd',
				method: 'POST',
				rejectUnauthorized: false,
				headers: header
			};
			var req = https.request(options, (res) => {
				console.log('Get data statusCode:', res.statusCode);
				var body = '';

				res.on('data', (d) => {
					body += d.toString('utf8');
				});

				res.on('end', () => {
					console.log('No more data in postdata-api response.');
					callback(JSON.parse(body));
				});
			});

			req.on('error', (e) => {
				console.error(e);
			});

			req.write(payload);
			req.end();
		}
	});		
}