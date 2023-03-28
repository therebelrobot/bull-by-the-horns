const Queue = require("bull");
const { createCluster } = require("redis");

const redisURLs = (
  process.env.REDIS_CLUSTER_URL || "redis://127.0.0.1:6379"
).split(",");

const isCluster = redisURLs.length > 1;

const createClient = () => {
  console.log("Creating Redis Cluster client...");
  const rootNodes = redisURLs.map((url) => ({ url }));

  const cluster = createCluster({
    rootNodes,
  });
  console.log("Created Redis Cluster client.", cluster);
  return cluster;
};

const taskQueue1 = new Queue(
  "taskQueue1",
  isCluster ? { createClient } : redisURLs[0]
);
const taskQueue2 = new Queue(
  "taskQueue2",
  isCluster ? { createClient } : redisURLs[0]
);

const addJobToQueue = async (queue, data) => {
  await queue.add(data);
  console.log(
    `Added job with data: ${JSON.stringify(data)} to queue ${queue.name}`
  );
};

const main = async () => {
  try {
    console.log("Connecting to Redis Cluster...");
    await taskQueue1.isReady();
    await taskQueue2.isReady();
    console.log("Connected to Redis Cluster.");

    for (let i = 1; i <= 5; i++) {
      await addJobToQueue(taskQueue1, { task: `Task ${i}` });
      await addJobToQueue(taskQueue2, { task: `Task ${i}` });
    }
  } catch (error) {
    console.error(
      "Error adding jobs to the queue or connecting to Redis:",
      error
    );
  } finally {
    taskQueue1.close();
    taskQueue2.close();
  }
};

console.log("Starting producer...");
main();
