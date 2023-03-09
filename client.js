import WebSocket from "ws";

const ws = new WebSocket("ws://172.22.21.135:3306");

ws.on("message", function message(data) {
	console.log("received: %s", data);
});
