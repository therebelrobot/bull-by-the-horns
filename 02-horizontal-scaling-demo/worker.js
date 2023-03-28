const Queue = require("bull");
const redisURL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const taskQueue = new Queue("taskQueue", redisURL);

const processJob = async (job) => {
  console.log(`Processing job with data: ${JSON.stringify(job.data)}`);
  // Simulate a processing delay with a 2-second timeout
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(`Finished processing job with data: ${JSON.stringify(job.data)}`);
};

taskQueue.process(async (job) => {
  await processJob(job);
});
