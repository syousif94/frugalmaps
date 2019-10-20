const server = require("./server");

async function main() {
  const app = await server();

  app.listen(2000, () => console.log(`frugal:2000!`));
}

main();
