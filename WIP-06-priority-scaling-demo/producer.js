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

const taskQueue1 = new Queue("taskQueue1", { createClient });
const taskQueue2 = new Queue("taskQueue2", { createClient });

const addJobToQueue = async (queue, data, priority) => {
  await queue.add(data, { priority });
  console.log(
    `Added job with data: ${JSON.stringify(data)} to queue ${
      queue.name
    } with priority ${priority}`
  );
};

const main = async () => {
  for (let i = 1; i <= 10; i++) {
    const priority = i % 2 === 0 ? 2 : 1;
    const duration = i % 3 === 0 ? 3000 : 1000;
    await addJobToQueue(taskQueue1, { task: `Task ${i}`, duration }, priority);
    await addJobToQueue(taskQueue2, { task: `Task ${i}`, duration }, priority);
  }
};

main().catch((error) =>
  console.error("Error adding jobs to the queue:", error)
);
