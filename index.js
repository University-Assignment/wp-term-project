const http = require("http");
const { PORT } = require("./env");
const app = require("./app");
const input = require("./utils/input");
const { connect } = require("./mongo/index");

const server = http.createServer(app);

connect();

server.listen(PORT);
server.on("error", console.error);
server.on("listening", () => console.log(`Server running on ${PORT}`));
