# DynamoDB Demo with Node.js and Faker.js

This project demonstrates how to work with AWS DynamoDB using Node.js and the AWS SDK v3. The project creates three related tables: `Users`, `Orders`, and `OrderItems`, and populates them with random data using Faker.js.

## Features

- Create three related DynamoDB tables (`Users`, `Orders`, and `OrderItems`).
- Insert bulk data into DynamoDB tables using Batch Writes for efficiency.
- Perform Regular Scan and Parallel Scan operations on DynamoDB items.

## Prerequisites

- Node.js (version 16.x or higher)
- AWS account with DynamoDB access
- AWS CLI configured with credentials or environment variables set

### Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/dynamodb-demo.git
cd dynamodb-demo
npm install
```

2. Running the project:
```bash
npm run dev
```
 
## License
This project is licensed under the MIT License - see the LICENSE file for details.

Author
Gamaster!
