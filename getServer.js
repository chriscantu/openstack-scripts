var cloud = require('./cloud/client.js').client, Q = require('q');
var credentials = require('./credentials.js').credentials;


var serverId = process.argv[2];

Q.fcall( function() {
	var data = cloud.createClient(credentials);
	return data;
}).then( function (credentials) {
	return cloud.getServer(serverId, 'ord');
}).then( function(server) {
	console.log(server);
}).done();