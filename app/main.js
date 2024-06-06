const net = require("net");
const fs = require('node:fs');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage

    const server = net.createServer((socket) => {

          socket.on('data', (data) => {
            const request = data.toString(); // converting the raw buffer data to string 
            console.log("Request: \n" + request);
            let header;
            const url = request.split(" ")[1]; // spliting the string to get the url ..split (" ")- returns an arry of these
            // elements GET, /echo/str -> (url), HTTP / 1.1
      
      
            if (url == "/") {
              socket.write("HTTP/1.1 200 OK\r\n\r\n");
            }
            else if (url.includes("/echo/")) {
              const str = url.split("/echo/")[1];
              const l = str.length;
              socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:  ${l}\r\n\r\n${str}`);
            }
            else if (url == "/user-agent") {
              header = request.split("\r\n")[2];
              const ua = header.split(": ")[1];
              socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:  ${ua.length}\r\n\r\n${ua}`);
            }
              else if (url.startsWith("/files/")) {
                const directory = process.argv[3];
                const filename = url.split("/files/")[1];
                if (fs.existsSync(`${directory}/${filename}`)) {
                  const content = fs.readFileSync(`${directory}/${filename}`).toString();
                  const res = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`;
                  socket.write(res);
                } else {
                  socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
                }
              }
              
              
              
            else {
              socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            }
          
            
          });
          socket.on("error", () => {
            console.warn(error);
            socket.write("HTTP/1.1 500\r\n\r\n");
            socket.end();
          });
          socket.on("close", () => {
            socket.end();
            server.close();
          });
        });
   

server.listen(4221, "localhost");
