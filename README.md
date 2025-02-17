# Chat API - Project Overview

Hi, here's a quick rundown of what's built and what's coming next:

> **Ready to Run the Application?**
>
> Get started by following the instructions in [docs/how-to-run.md](docs/how-to-run.md). Enjoy exploring the project!

## Current Features

- **Messaging**: Users can send direct messages. Although group chats aren't enabled yet, the system is designed to support them with just a few tweaks.
- **Editing Messages**: Sent messages can be edited.
- **Replying to Messages**: Direct replies are supported, making it simple to follow a conversation.
- **Deleting Messages**: Senders can delete their own messages.
- **File Sharing**: Messages can include file attachments, with temporary download links generated dynamically.

## Key Technical Decisions

1. **Chat and Member Separation**: Chats are stored separately from members for better scalability. A hash function uniquely identifies a chat between two users, avoiding unnecessary duplications.
2. **Using RabbitMQ**: Messages are processed asynchronously with RabbitMQ to boost performance and reduce database load.
3. **Message Ordering**: A `seq` field in each chat ensures messages remain in order, even during concurrent operations.
4. **Simple Reply Structure**: A reply is implemented as a message with a `reply` field containing the ID of the referenced message, simplifying threading and cascade deletions.
5. **Header-Based Authentication**: Requests are assumed to be authenticated. This keeps the focus on messaging without complicating the system with user management. The authenticated user is identified via the request header.
6. **Temporary Download Links**: Files are stored on Amazon S3 for scalability and cost-efficiency. Temporary download links are generated automatically to enhance security.
7. **Using MongoDB**: The document-based structure in MongoDB allows for flexible storage of messages, quick retrieval of conversation histories, and supports horizontal scalability through indexing and sharding.

## Next Steps

- **Download Link Renewal Endpoint**: Allow clients to request a new download link if the original one expires.
- **User Chat Search Endpoint**: Facilitate retrieving all conversations associated with a user.
- **Threaded Message Retrieval**: Provide an endpoint to fetch the first 50 messages of a chat, with replies organized as threads.
- **Real-Time Communication with WebSockets**: Implement WebSockets for instant messaging.
- **Read Receipts**: Introduce a feature to indicate when messages have been read.
- **Notifications**: Add support for push notifications or emails to alert users of new messages.
- **Group Chat Support**: Extend the system to enable group conversations, building on the current design for direct messages.
