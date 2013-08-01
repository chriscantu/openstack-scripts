openstack-scripts
=================

## Purpose

The attached scripts are intended for use with a build server.  The operations allow you to perform operations and see the output in the console.

### Getting Started

In order to leverage these scripts, you must have the following:

* NodeJS installed
* Valid Rackspace Cloud Account 
* Valid Rackspace Cloud API key

### Before Running

* cd into openstack-scripts
* run `npm install`

### createServer.js

Creates a server provided a valid server name.  The script will continue to run until the server's status has changed to `RUNNING` or 10 minutes has passed.

`node createServer.js (server_name)`

### destroyServer.js

Destroys a server provided a valid server id.  The script will NOT wait for the VM to be completely destroyed.

`node destroyServer.js (server_id)`