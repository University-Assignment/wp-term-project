const readline = require("readline");

function input(msg) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    process.stdout.write(msg);

    rl.on("line", (line) => {
      resolve(line);
      rl.close();
    });
  });
}

module.exports = input;
