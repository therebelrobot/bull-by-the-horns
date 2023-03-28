const Queue = require("bull");

const redisConfig = {
  url: process.env.REDIS_CLUSTER_URL || "redis://127.0.0.1:6379",
};

const taskQueue1 = new Queue("taskQueue1", { redis: redisConfig });

const processJob = async (job) => {
  console.log(
    `Processing job with data: ${JSON.stringify(job.data)} on queue ${
      job.queue.name
    }`
  );
  // Simulate a processing delay with a 2-second timeout
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(
    `Finished processing job with data: ${JSON.stringify(job.data)} on queue ${
      job.queue.name
    }`
  );
};

taskQueue1.process(async (job) => {
  await processJob(job);
});
