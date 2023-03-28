const Queue = require("bull");
const redisURL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const taskQueue1 = new Queue("taskQueue1", redisURL);
const taskQueue2 = new Queue("taskQueue2", redisURL);

const addJobToQueue = async (queue, data) => {
  await queue.add(data);
  console.log(
    `Added job with data: ${JSON.stringify(data)} to queue ${queue.name}`
  );
};

const main = async () => {
  for (let i = 1; i <= 5; i++) {
    await addJobToQueue(taskQueue1, { task: `Task ${i}` });
    await addJobToQueue(taskQueue2, { task: `Task ${i}` });
  }
};

main().catch((error) =>
  console.error("Error adding jobs to the queue:", error)
);
