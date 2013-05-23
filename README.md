mysql-handler-axomic
====================

Singleton handler for mysql connections in node.js to facilitate connection pooling.

##Usage##

Add to any module in the following manner:

	var mysqlHandler = require('mysql-handler-axomic'),
    	mysqlH = mysqlHandler.con();

To obtain a pooled MySql connection, use as follows:

    mysqlH.getConnection(stateObject, function(returnedObject) {
    	// will return stateObject with .connection attached
    });

You can use the `stateObject.connection` as you would any normal MySQL connection. e.g.:

	stateObject.connection.query('SELECT * FROM user', function(err, rows){
		console.log(rows);
	});

The stateObject passed to `getConnection()` should contain the necessary connection information:

	{
		host               : // database endpoint,
		database           : // database name,
        multipleStatements : // whether you want multiple Statement support
        connectionLimit    : // maximum connections, (Default 5),
        user               : // database username,
        password           : // database password,
        port               : // database port (Default 3306)
    }
