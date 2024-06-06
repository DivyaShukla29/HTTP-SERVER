const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
   
  socket.on('data', (data) => {
    const request = data.toString();
    // if (request.startsWith("GET / ")) {
    //     socket.write("HTTP/1.1 200 OK\r\n\r\n");
    // }
    // else {
    //     socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    // }
    const arr = request.split(" ");  
    const req = arr[1].split("/");
   let str = "";
        let l = 0;

        // Ensure there are enough parts in the request line
        if (arr.length > 1) {
            const req = arr[1].split("/");
            // Ensure the URL has at least 3 segments (["", "echo", "abc"])
            if (req.length > 2) {
                str = req[2];
                l = str.length;
            }
        }
   
    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:  ${l}\r\n\r\n${str}`);
       
  });






  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
