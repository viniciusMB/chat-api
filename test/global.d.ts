declare namespace NodeJS {
    interface Global {
      __MONGO_SERVER__: any;
      __S3_SERVER__: any;
    }
}
  