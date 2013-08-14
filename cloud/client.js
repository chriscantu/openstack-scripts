'use strict';
var rest = require('restler'), Q = require('q'), cred = require('../credentials').credentials,
	client = {}, config = require("../config").config;
var token, username, apiKey;

client.createClient = function() {
	var defer = Q.defer();
	var data = JSON.stringify({
			"auth": { "RAX-KSKEY:apiKeyCredentials" : { username: cred.username, apiKey: cred.apiKey } }
		});

	rest.post(config.authUrls.primary, {
		headers: { "Content-Type": "application/json" },
		data: data
	}).on('success', function(data, response) {
		client.token = data.access.token.id;
		defer.resolve(data);
	}).on('fail', function(data, response) {
		console.log(data)
		defer.reject(data);
	});

	return defer.promise;
}

client.getServer = function(serverId, locale) {
	var defer = Q.defer();
	var url = (locale) ? config.serverUrls[locale] : config.serverUrls.ord;

	var headers = {
		headers: {
			"X-Auth-Project-Id": cred.account,
       		"Content-Type": "application/json",
       		"Accept": "application/json",
      		"X-Auth-Token": client.token
		}
	}

	console.log(headers);

	rest.get( url + cred.account + "/servers/" + serverId, headers
	).on('success', function (data, response) {
		console.log(response);
		defer.resolve(data);
	}).on('fail', function (data, response) {
		console.log(response);
		defer.reject(data);
	}).on('complete', function(result, response) {
		console.log(result)
		console.log("FINSIHED");
	});

	return defer.promise;
};

exports.client = client;