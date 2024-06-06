const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
   
  socket.on('data', (data) => {
    const request = data.toString();
    console.log("Request: \n" + request);

    // if (request.startsWith("GET / ")) {
    //     socket.write("HTTP/1.1 200 OK\r\n\r\n");
    // }
    // else {
    //     socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    // }
    const url = request.split(" ")[1];  
    if (url == "/"){
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    }
    else if (url.includes("/echo/")) {
      const str = url.split("/echo/")[1];
      const l = str.length;
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:  ${l}\r\n\r\n${str}`);
    }
    else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
        
        
    
       
  });






  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
