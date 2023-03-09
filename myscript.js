const WebSocket = require("ws");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 3306 });

// Define a map to store the clients by topic
const clientsByTopic = new Map();

// Broadcast a message to all clients in the topic except for the sender
function broadcast(topic, sender, message) {
	const clients = clientsByTopic.get(topic);
	if (!clients) {
		return;
	}
	clients.forEach(function (client) {
		if (client !== sender) {
			console.log("Sending message to client: %s", message);
			client.send(JSON.stringify(message));
		}
	});
}

// Handle a new connection
wss.on("connection", function (ws) {
	console.log("A new client connected");

	// Handle a message from the client
	ws.on("message", function (message) {
		console.log("Received message: %s", message);

		// Get the topic of the message
		// const topic = message.split(":")[0];

		const { topic, data } = JSON.parse(message);

		// Store the client in the map
		if (!clientsByTopic.has(topic)) {
			clientsByTopic.set(topic, new Set());
		}
		clientsByTopic.get(topic).add(ws);
		console.log(`Clients in topic ${topic}: ${clientsByTopic.get(topic).size}`);

		// Broadcast the message to all clients in the topic except for the sender
		broadcast(topic, ws, data);
	});
});
