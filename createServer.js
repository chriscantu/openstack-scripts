var cloud = require('pkgcloud'), Q = require('q'), fs = require('fs');
var credentials = require('./credentials.js').credentials;
var client = cloud.compute.createClient(credentials);

var FOUR_GB_FLAVOR_ID = 5, UBUNTU_1204_IMAGE_ID = '23b564c9-c3e6-49f9-bc68-86c7a9ab5018',
	DIRECTORY = "data" ;

var serverName = process.argv[2]

if (!serverName) {
	console.log("You must pass a server name to the script. Example: 'node createServer.js mySpecialServer'");
	process.exit(1);
}

var options = {
	name: serverName,
	image: UBUNTU_1204_IMAGE_ID,
	flavor: FOUR_GB_FLAVOR_ID
};

Q.fcall( function() {
	var defer = Q.defer();

	client.createServer(options, function (err, server) {
		return (err) ? defer.reject(err) : defer.resolve(server);
	});

	return defer.promise;
}).then( function (server) {
	var defer = Q.defer(), count = 0, inProgress = false;

	var intervalId = setInterval( function() {

		if (!inProgress) {
			inProgress = true;

			client.getServer(server, function(err, srv) {
				inProgress = false;
				count++;

				(err) ? defer.reject(err) : console.log(srv.status)
				console.log(server);
				if(srv.status == "RUNNING") {
					clearInterval(intervalId);
					defer.resolve(srv);
				} else if (count >= 20) {
					defer.reject({status:"Timed Out"});
				}
			});
		}
	}, 30000);

	return defer.promise;

}).then( function (server) {
	var defer = Q.defer(), fileName = DIRECTORY + "/" + serverName + ".json";
	var data = {id: server.id, name: server.name, password: server.adminPass, addresses: server.addresses};

	( !fs.existsSync(DIRECTORY) ) ? fs.mkdirSync(DIRECTORY) : null;
	
	fs.writeFile(fileName, JSON.stringify(data, null, 4), function(err){
		return (err) ? defer.reject(err) : defer.resolve(fileName);
	});

	return defer.promise
}).then(function (file) {
	console.log("Wrote data to: " + file);
	console.log("Success!");
}).done();