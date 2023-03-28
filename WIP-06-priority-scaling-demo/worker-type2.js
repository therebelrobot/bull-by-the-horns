const Queue = require("bull");
const Redis = require("ioredis");

const redisURLs = (
  process.env.REDIS_CLUSTER_URL || "redis://127.0.0.1:6379"
).split(",");
const createClient = () => {
  if (redisURLs.length > 1) {
    return new Redis.Cluster(redisURLs.map((url) => new URL(url)));
  } else {
    return new Redis(redisURLs[0]);
  }
};

const taskQueue2 = new Queue("taskQueue2", { createClient });

const processJob = async (job) => {
  console.log(
    `Processing job with data: ${JSON.stringify(job.data)} on queue ${
      job.queue.name
    }`
  );

  await new Promise((resolve) => setTimeout(resolve, job.data.duration));

  console.log(
    `Finished processing job with data: ${JSON.stringify(job.data)} on queue ${
      job.queue.name
    }`
  );
};

taskQueue2.process(async (job) => {
  await processJob(job);
});
