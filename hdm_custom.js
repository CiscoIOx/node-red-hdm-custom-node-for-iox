module.exports = function(RED) {
    function hdmCustomNode(config) {
    	var hdm_data = require('./hdm_data.js');
        RED.nodes.createNode(this,config);

        var node = this;
        node.on('input', function(msg) {
            var cmd = config.shcmd;
            hdm_data(cmd, function(hdmdata) {
                console.log("=======================hdm Data:");
                console.log(hdmdata);
                if(hdmdata) {
                    msg.payload = hdmdata['output'];
                    node.send(msg);
                }
            });        
        });
    }

    RED.nodes.registerType("Hdm custom IOx connector",hdmCustomNode);
}