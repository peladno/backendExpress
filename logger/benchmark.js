const autocannon = require("autocannon");
const { PassThrough } = require("stream");

function run(url) {
  const buf = [];
  const outputStream = new PassThrough();

  const inst = autocannon({
    url,
    connections: 100,
    duration: 20,
  });

  autocannon.track(inst, { outputStream });

  outputStream.on("data", (data) => buf.push(data));
  inst.on("done", function () {
    process.stdout.write(Buffer.concat(buf));
  });
}

run("http://localhost:8080/infoProcess");

console.log("Runnig all benchmarks in parallel ...");
