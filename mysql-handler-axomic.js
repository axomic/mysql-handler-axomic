var mysql               = require('mysql');

var singleton = function singleton(){

    var connections = null;

    init();

    function init() {
        connections = {};

        connections.getConnection = function(coreObj, callback) {
            //console.log('getconnection called', callback);
            coreObj.getConnectionCallback = callback;
            if(connections[coreObj.host] !== undefined) {
                coreObj.connection = connections[coreObj.host];
                callback(coreObj);
                //getPooledConnection(coreObj, coreObj.getConnectionCallback);
            } else {
                coreObj.getPoolConCallback = coreObj.getConnectionCallback;
                getMysqlConnection(coreObj);
            } 
        }

        function getMysqlConnection(coreObj) {
            connections[coreObj.host] =  mysql.createPool({
                  host     : coreObj.host,
		  database : coreObj.database,
                  multipleStatements: coreObj.multipleStatements || false,
                  connectionLimit: coreObj.connectionLimit || 5,
                  user     : coreObj.user,
                  password : coreObj.password
            }); 
            coreObj.connection = connections[coreObj.host];
            coreObj.getPoolConCallback(coreObj);
            //getPooledConnection(coreObj, coreObj.getPoolConCallback);
        }

        function getPooledConnection(coreObj, callback) {
            connections[coreObj.host].getConnection(function(err, newCon) {
                if(!err) {
                    coreObj.connection = newCon;
                    newCon.removeAllListeners('error');
                    newCon.on('error', function(err){
                        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
                            console.log('PROTOCOL_CONNECTION_LOST in mysqlHandler');     
                            console.log('attempting to re-establish conneciton', newCon);
                            setTimeout(getPooledConnection, 3000, coreObj, callback);
                        }
                    });
                    callback(coreObj);
                } else {
                    console.error("Error Getting Pool Connection: ", err);
                }
            });   
        }
    }
    this.con = function() {
        return connections;
    }

    if(singleton.caller != singleton.getInstance){
        throw new Error("mysqlconnection object cannot be instantiated");
    }
}

singleton.instance = null;

singleton.getInstance = function(){
        if(this.instance === null) {
            this.instance = new singleton();
        }
        return this.instance;
}

module.exports = singleton.getInstance();
