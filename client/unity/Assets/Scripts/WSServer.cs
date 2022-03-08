using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using WebSocketSharp;
using WebSocketSharp.Server;

public class WSServer : MonoBehaviour
{
  WebSocketServer wss;
  // Port to start the server on
  int _port = 8080;
  // Start is called before the first frame update
  void Start()
  {
    // ws://localhost:8080
    wss = new WebSocketServer(_port);

    // Adds service to the path /Service
    // The path seems necessary, empty string won't work
    // ws://localhost:<port>/Service
    wss.AddWebSocketService<WebSocketService>("/Service");
  }

  // Update is called once per frame
  void Update()
  {
    // Start listening
    if (Input.GetKeyDown(KeyCode.Alpha1))
    {
      wss.Start();
      if (wss.IsListening)
      {
        Debug.Log("WebSocket server listening on port 8080. Press 2 to stop the server.");
      }
    }
    // Stop listening
    else if (Input.GetKeyDown(KeyCode.Alpha2))
    {
      wss.Stop();
      if (!wss.IsListening)
      {
        Debug.Log("WebSocket server stopped.");
      }
    }
  }
}

public class WebSocketService : WebSocketBehavior
{
  protected override void OnMessage(MessageEventArgs e)
  {
    Debug.Log(e.Data);
  }
}
