const Queue = require("bull");
const redisURL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const taskQueue = new Queue("taskQueue", redisURL);

const addJobToQueue = async (data) => {
  await taskQueue.add(data);
  console.log(`Added job with data: ${JSON.stringify(data)}`);
};

const main = async () => {
  for (let i = 1; i <= 10; i++) {
    await addJobToQueue({ task: `Task ${i}` });
  }
};

main().catch((error) =>
  console.error("Error adding jobs to the queue:", error)
);
