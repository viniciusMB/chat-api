export interface QueueClientConfig {
    name: string;
    queueEnv: string;
    dlqEnv: string;
  }
  
  export const QUEUE_CLIENTS: QueueClientConfig[] = [
    {
      name: 'CREATE_MESSAGE_QUEUE',
      queueEnv: 'CREATE_MESSAGE_QUEUE_NAME',
      dlqEnv: 'CREATE_MESSAGE_QUEUE_DLQ_NAME',
    },
    {
      name: 'REPLY_MESSAGE_QUEUE',
      queueEnv: 'REPLY_MESSAGE_QUEUE_NAME',
      dlqEnv: 'REPLY_MESSAGE_QUEUE_DLQ_NAME',
    },
    {
      name: 'DELETE_MESSAGE_QUEUE',
      queueEnv: 'DELETE_MESSAGE_QUEUE_NAME',
      dlqEnv: 'DELETE_MESSAGE_QUEUE_DLQ_NAME',
    },
    {
      name: 'UPDATE_MESSAGE_QUEUE',
      queueEnv: 'UPDATE_MESSAGE_QUEUE_NAME',
      dlqEnv: 'UPDATE_MESSAGE_QUEUE_DLQ_NAME',
    },
    {
      name: 'CREATE_MESSAGE_WITH_FILE_QUEUE',
      queueEnv: 'CREATE_MESSAGE_WITH_FILE_QUEUE_NAME',
      dlqEnv: 'CREATE_MESSAGE_WITH_FILE_QUEUE_DLQ_NAME',
    },
  ];
  