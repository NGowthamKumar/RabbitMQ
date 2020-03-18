var amqp = require('amqplib/callback_api');

const name = process.argv[2];

if (name == "publish"){
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) { throw error0; }
        connection.createChannel(function(error1, channel) {
            if (error1) { throw error1; }
            var queue = 'hello';
            var msg = process.argv.slice(3).join(' ');
            channel.assertQueue(queue, { durable: false });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });
        setTimeout(function() { connection.close(); process.exit(0); }, 500);
    });
}

else if(name == "subscribe"){
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) { throw error0; }
        connection.createChannel(function(error1, channel) {
            if (error1) { throw error1; }
            var queue = 'hello';
            channel.assertQueue(queue, { durable: false });
            console.log(" [*] Waiting for messages in %s", queue);
            channel.consume(queue, function(msg) { console.log(" [x] Received %s", msg.content.toString());}, { noAck: true });
        });
        setTimeout(function() { connection.close(); process.exit(0); }, 500);
    });
}


/*
To publish : node index.js publish 'your message'
To subscribe : node index.js subscribe 
*/
