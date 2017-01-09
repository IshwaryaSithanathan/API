var net = require('net');
var readlineSync = require("readline-sync")
var HOST = '127.0.0.1';
var PORT = 8889;
var client = null;
var Promise = require('promise');

var self = module.exports = {

openConnection : function() {
    if(client){
        setTimeout(function(){
        },0); 
        return;
    }
    
    client = new net.Socket();
    client.setKeepAlive(true,10000);
    client.on('error', function(e) {
        
        // If connection refused - reconnect
        if(e.code == 'ECONNREFUSED') {
            setTimeout(function(){
                client.destroy();
                client = null;
                retryConnection();
            },2000); 
        }   
        
        // If address in use - do not attempt reconnect
        if (e.code == 'EADDRINUSE') {
            console.log('Address in use, retrying...');
            setTimeout(function(){
                client.destroy();
                client = null;
                return;
            },0); 
        }
        
        // If server not reachable - reconnect
        if (e.code == 'EPIPE') {
            console.log('Server not reachable..');
            setTimeout(function(){
                client.destroy();
                client = null;
                retryConnection();
            },2000); 
        }
    });
    
    // On connecting to the server    
    client.connect(PORT, HOST, function() {
        var j={"printerName":"regan","messageID":"6ae922","type":"Register","userID":"Client-1a37d1","status":0};
        self.sendData(JSON.stringify(j) + '\n');
    });
    
    // On recieving data
    client.on('data', function(data) {
       console.log('Recieving data <<-- ' + data);
       var stringify = JSON.parse(data);
       var statusValue = stringify["status"];
       var typeValue = stringify["type"];
      
       if(statusValue === 1 && typeValue === "Register"){
           sendTempKeepAlivePackets();
       }
       
       if(statusValue === 1 && typeValue === "KeepAlive"){
            return new Promise(function (fulfill, reject){
                try {
                    fulfill(sendTempKeepAlivePackets());
                } catch (ex) {
                    reject(ex);
                }
            });
        };
    });
},

// On recieving data
sendData : function(data) {
    if(! client == null){
        console.log("error no client available.");
        setTimeout(function(){
        },0); 
        return;
    }
    console.log('Sending data -->> ' + data);
    
    return new Promise(function (fulfill, reject){
    try {
            fulfill(client.write(data));
        } catch (ex) {
            reject(ex);
        }
    });
},

closeConnection : function() {
    if(! client == null)
    {
        console.log("error no client available.");
        setTimeout(function(){
        },0); 
        return;
    }
    console.log("Connection closed successfully.");
    client.destroy();
    client = null;
}, 
}

function sendTempKeepAlivePackets() {
    var res = {"printerName":"regan","messageID":"725387","type":"KeepAlive","userID":"Client-c6dd88","status":0};
    setTimeout(function(){
        self.sendData(JSON.stringify(res) + '\n');
    },3000); 
}

function retryConnection(){
    return new Promise(function (fulfill, reject){
    try {
            fulfill(self.openConnection());
        } catch (ex) {
            reject(ex);
        }
    });
}