import { MongoMemoryServer } from 'mongodb-memory-server';

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
})();
