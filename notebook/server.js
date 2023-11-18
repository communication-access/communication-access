const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const messages = [];

wss.on("connection", (ws) => {
  // Send existing messages to the new client
  ws.send(JSON.stringify(messages));

  // Handle new messages from clients
  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    messages.push(parsedMessage);

    // Broadcast the new message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([parsedMessage]));
      }
    });
  });
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
