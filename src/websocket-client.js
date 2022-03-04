'use strict';

const WebSocket = require('ws');

// Class that represents a WebSocket client to facilitate communication between
// this client and the Stream Mascot server.
// The terms may sound backwards, but this is the client because this will send messages to
// the server (Unity) when it receives an event from Twitch, and Unity will perform
// a behavior based on the message received.
module.exports = class WebSocketClient {
  constructor() {
    // TODO: Add port to env?
    this.port = '8080';

    // Creates a new websocket client
    const wsc = new WebSocket.client({ port: 8080 });

    wsc.onopen = () => {
      console.log('WebSocket client connected to Stream Mascot server.');
      if (wsc.readyState === wsc.OPEN) {
        wsc.send('Sending test message from client to server.');
      }
    };

    wsc.onerror = () => {
      console.log('Connection Error');
    };

    wsc.onclose = () => {
      console.log('WebSocket disconnected from Stream Mascot server.');
    };

    wsc.onmessage = (event) => {
      if (typeof event.data === 'string') {
        console.log(`WebSocket received message from server: ${event.data}`);
      }
    };

    wsc.connect(`ws://localhost:${this.port}`);
  }
};
