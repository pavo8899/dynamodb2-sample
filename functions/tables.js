import { DynamoDBClient, CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, BatchWriteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";
import { faker } from '@faker-js/faker';


const dynamoDBClient = new DynamoDBClient({ region: "us-east-1", credentials: fromIni({ profile: process.env.profile }) });
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

const createTables = async () => {
    // Crear tabla de Usuarios
    const createUsersTable = new CreateTableCommand({
        TableName: `Users_DDB2_${process.env.bluetag}`,
        KeySchema: [
            { AttributeName: 'UserID', KeyType: 'HASH' },  // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'UserID', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',  // Escalado automático
    });

    // Crear tabla de Pedidos
    const createOrdersTable = new CreateTableCommand({
        TableName: `Orders_DDB2_${process.env.bluetag}`,
        KeySchema: [
            { AttributeName: 'OrderID', KeyType: 'HASH' },  // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'OrderID', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    });

    // Crear tabla de Productos en Pedidos
    const createOrderItemsTable = new CreateTableCommand({
        TableName: `OrderItems_DDB2_${process.env.bluetag}`,
        KeySchema: [
            { AttributeName: 'OrderItemID', KeyType: 'HASH' },  // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'OrderItemID', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    });

    const createInfoTable = new CreateTableCommand({
        TableName: `Info_DDB2_${process.env.bluetag}`,
        KeySchema: [
            { AttributeName: 'TableName', KeyType: 'HASH' },  // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'TableName', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    })


    try {
        await dynamoDBClient.send(createUsersTable);
        await dynamoDBClient.send(createOrdersTable);
        await dynamoDBClient.send(createOrderItemsTable);
        await dynamoDBClient.send(createInfoTable);
        await populateTables(true, true, true, true)
        return "Tables Created Correctly"
    } catch (err) {
        console.log("🚀 ~ createTables ~ err:", err)
        throw "Error Creating Tables"
    }
}

async function batchWrite(items, tableName) {
    const batches = [];

    // Dividir los elementos en lotes de hasta 25 elementos por lote
    for (let i = 0; i < items.length; i += 25) {
        const batch = {
            RequestItems: {
                [tableName]: items.slice(i, i + 25).map(item => ({ PutRequest: { Item: item } }))
            }
        };
        batches.push(batch);
    }

    // Procesar todos los lotes
    for (const batch of batches) {
        try {
            await docClient.send(new BatchWriteCommand(batch));
        } catch (err) {
            console.error(`Error al procesar batch en ${tableName}:`, err);
        }
    }
}

const populateTables = async (usersCreate = true, ordersCreate = true, orderItemsCreate = true, firstTime = false) => {
    // Generar usuarios
    let users = [];

    for (let i = 0; i < 1000; i++) {
        users.push({
            UserID: faker.string.uuid(),
            Name: faker.person.fullName(),
            Email: faker.internet.email(),
            Image: faker.image.dataUri({ type: 'svg-base64' }),
            prop1: faker.lorem.paragraph(20)
        });
    }
    await batchWrite(users, `Users_DDB2_${process.env.bluetag}`);

    let orders = [];

    // Generar pedidos

    for (let i = 0; i < 1000; i++) {
        var user = users[Math.floor(Math.random() * (1000))];
        orders.push({
            OrderID: faker.string.uuid(),
            UserID: user.UserID,
            OrderDate: faker.date.past().toISOString(),
            Image: faker.image.dataUri({ type: 'svg-base64' }),
            prop1: faker.lorem.paragraph(20)
        });
    }
    await batchWrite(orders, `Orders_DDB2_${process.env.bluetag}`);

    let orderItems = [];
    // Generar productos en pedidos


    for (let i = 0; i < 1000; i++) {
        var order = orders[Math.floor(Math.random() * (1000))];
        orderItems.push({
            OrderItemID: faker.string.uuid(),
            OrderID: order.OrderID,
            ProductName: faker.commerce.productName(),
            Quantity: faker.number.int({ min: 1, max: 5 }),
            Image: faker.image.dataUri({ type: 'svg-base64' }),
            prop1: faker.lorem.paragraph(20)
        });
    }
    await batchWrite(orderItems, `OrderItems_DDB2_${process.env.bluetag}`);


    let info = [
        {
            TableName: `Users_DDB2_${process.env.bluetag}`,
            Count: 1000
        },
        {
            TableName: `Orders_DDB2_${process.env.bluetag}`,
            Count: 1000
        },
        {
            TableName: `OrderItems_DDB2_${process.env.bluetag}`,
            Count: 1000
        }
    ]
    if (firstTime) { await batchWrite(info, `Info_DDB2_${process.env.bluetag}`); }
    else {
        var updateCommand =
        {
            TableName: `Info_DDB2_${process.env.bluetag}`,
            Key: {
                'TableName': `Users_DDB2_${process.env.bluetag}`
            },
            UpdateExpression: "SET #Count = #Count + :count",
            ExpressionAttributeNames: {
                '#Count': 'Count'
            },
            ExpressionAttributeValues: {
                ':count': 1000
            }
        }

        await docClient.send(new UpdateCommand(updateCommand))


        updateCommand['Key']['TableName'] = `Orders_DDB2_${process.env.bluetag}`
        await docClient.send(new UpdateCommand(updateCommand))

        updateCommand['Key']['TableName'] = `OrderItems_DDB2_${process.env.bluetag}`
        await docClient.send(new UpdateCommand(updateCommand))

    }
    return "Tables Populated Correctly"
}

const deleteTables = async () => {
    const deleteOrderItemsTable = new DeleteTableCommand({
        TableName: `OrderItems_DDB2_${process.env.bluetag}`
    });
    const deleteOrdersTable = new DeleteTableCommand({
        TableName: `Orders_DDB2_${process.env.bluetag}`
    });
    const deleteUsersTable = new DeleteTableCommand({
        TableName: `Users_DDB2_${process.env.bluetag}`
    });

    try {
        await dynamoDBClient.send(deleteOrderItemsTable);
        await dynamoDBClient.send(deleteOrdersTable);
        await dynamoDBClient.send(deleteUsersTable);
        return "Tables Deleted Correctly"
    } catch (err) {
        console.log("🚀 ~ deleteTables ~ err:", err)

        throw "Error Deleting Tables"
    }
}

export { createTables, populateTables, deleteTables }