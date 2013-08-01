var cloud = require('pkgcloud'), Q = require('q');
var credentials = require('./credentials.js').credentials;
var client = cloud.compute.createClient(credentials);

var serverId = process.argv[2];

Q.fcall( function() {
	var defer = Q.defer()
	client.destroyServer(serverId, function(err, server) {
		return (err) ? defer.reject(err) : defer.resolve({ msg: "Deleted server #" + server.ok });
	});

	return defer.promise;
}).then( function( status ) {
	console.log(status.msg);
}).done();