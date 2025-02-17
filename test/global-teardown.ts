module.exports = async () => {
  const mongoServer = global.__MONGO_SERVER__;
  if (mongoServer) {
    await mongoServer.stop();
  }
  const localstackContainer = global.__LOCALSTACK_CONTAINER__;
  if (localstackContainer) {
    await localstackContainer.stop();
  }

  const rabbitMQContainer = global.__RABBITMQ_CONTAINER__;
  if(rabbitMQContainer) {
    await rabbitMQContainer.stop()
  }
};
