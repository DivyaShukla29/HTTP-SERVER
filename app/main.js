const fs = require("fs");
const net = require("net");
console.log("Logs from your program will appear here!");
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });
  socket.on("data", (data) => {
    const req = data.toString();
    console.log(req);
    const path = req.split(" ")[1];
    if (req.startsWith("GET")) {
      if (path === "/") socket.write("HTTP/1.1 200 OK\r\n\r\n");
      
      else if (path.startsWith("/files/")) {
        const directory = process.argv[3];
        const filename = path.split("/files/")[1];
        if (fs.existsSync(`${directory}/${filename}`)) {
          const content = fs.readFileSync(`${directory}/${filename}`).toString();
          const res = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`;
          socket.write(res);
        } else {
          socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
      }
    
      else if (path === "/user-agent") {
        req.split("\r\n").forEach((line) => {
          if (line.includes("User-Agent")) {
            const res = line.split(" ")[1];
            socket.write(
              `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${res.length}\r\n\r\n${res}\r\n`
            );
          }
        });
      } else if (path.startsWith("/echo/")) {
        const res = path.split("/echo/")[1];
        // const enc = req.split("\r\n")[3];
        let requestArray = req.split("\r\n")
        const encodingHeader = requestArray.find(e => e.includes('Accept-Encoding'))?.split(': ')[1];
        encodingHeader = encodingHeader.split(", ");
        if (encodingHeader.find(e=>e.includes("gzip"))) { // adding content encoding header
          socket.write(
            `HTTP/1.1 200 OK\r\nContent-Encoding: gzip\r\nContent-Type: text/plain\r\nContent-Length: ${res.length}\r\n\r\n${res}\r\n`
          );
        }
        else {
          socket.write(
            `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${res.length}\r\n\r\n${res}\r\n`
          );
        }
      }

    
    
    
      else socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    else {
      if (path.startsWith("/files/")) {
        const directory = process.argv[3];
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true }); // in case the directory does not exist create it 
        }
        const filename = path.split("/files/")[1];
        const content = req.split("\r\n\r\n")[1];  // getting the content from the body we can also get it by  const req = data.toString().split("\r\n");
        //const body = req[req.length - 1]; 
        fs.writeFileSync(`${directory}/${filename}`, content);
        socket.write("HTTP/1.1 201 Created\r\n\r\n");
      }
      else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }

    }

    socket.end();
  });
});
server.listen(4221, "localhost");