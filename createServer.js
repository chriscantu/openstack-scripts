var cloud = require('pkgcloud'), Q = require('q');
var credentials = require('./credentials.js').credentials;
var client = cloud.compute.createClient(credentials);

var FOUR_GB_FLAVOR_ID = 5;
var UBUNTU_1204_IMAGE_ID = '23b564c9-c3e6-49f9-bc68-86c7a9ab5018';

var serverName = process.argv[2]

var options = { 
	name: serverName,
	image: UBUNTU_1204_IMAGE_ID,
	flavor: FOUR_GB_FLAVOR_ID
}

Q.fcall( function() {
	var defer = Q.defer()

	client.createServer(options, function (server, err) {
		return (err) ? defer.reject(err) : defer.resolve(server);
	});

	return defer.promise;
}).then( function (server) {
	var defer = Q.defer(), count=0, inProgress = false;	

	var intervalId = setInterval( function() {

		if (!inProgress) {
			inProgress = true;

			client.getServer(server, function(err, srv) {
				inProgress = false;
				count++;

				(err) ? defer.reject(err) : console.log(srv.status)

				if(srv.status == "RUNNING" || count >= 20) {
					clearInterval(intervalId);
					defer.resolve({status:"Finished!"})
				}
			});
		}
	}, 30000);

	return defer.promise;

}).then( function(message){
	console.log(message.status);
}).done();