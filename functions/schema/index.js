const repl = require("repl");
const elastic = require("./elastic");

const server = repl.start({
  prompt: "elastic > "
});

server.context.elastic = elastic;
