const Queue = require("bull");
const redisURL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const priorityQueue = new Queue("priorityQueue", redisURL);

const addJobToQueue = async (data, priority) => {
  await priorityQueue.add(data, { priority });
  console.log(
    `Added job with data: ${JSON.stringify(data)} and priority: ${priority}`
  );
};

const main = async () => {
  await addJobToQueue({ task: "Low priority task" }, 100);
  await addJobToQueue({ task: "High priority task" }, 1);
  await addJobToQueue({ task: "Medium priority task" }, 50);
};

main().catch((error) =>
  console.error("Error adding jobs to the queue:", error)
);
