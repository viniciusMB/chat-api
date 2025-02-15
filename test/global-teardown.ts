// test/global-teardown.ts
export default async () => {
    const mongoServer = global.__MONGO_SERVER__;
    if (mongoServer) {
      await mongoServer.stop();
    }
  };
  