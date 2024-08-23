import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient,ScanCommand,GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";

const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" , credentials: fromIni({profile: process.env.profile})});
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

const segmentSize = 500;

async function parallelScan(params, totalSegments) {
    // console.log("🚀 ~ parallelScan ~ params:", params)
    const promises = [];

    for (let i = 0; i < totalSegments; i++) {
        // Para cada segmento, enviamos una solicitud de escaneo con Segment y TotalSegments
        const segmentParams = {
            ...params,
            Segment: i,      // El segmento actual
            TotalSegments: totalSegments  // El número total de segmentos
        };

        promises.push(dynamoDBClient.send(new ScanCommand(segmentParams)));
    }

    try {
        // Espera a que todas las promesas terminen
        const results = await Promise.all(promises);

        // Combina los resultados de los segmentos
        let combinedItems = [];
        results.forEach(result => {
            combinedItems = combinedItems.concat(result.Items);
        });
        return combinedItems;

    } catch (err) {
        console.error("Error en el Parallel Scan:", err);
        throw err;
    }
}

const getUsersParallel = async (filter=null) => {
    let tableInfo = await ddbDocClient.send(new QueryCommand({
        TableName: `Info_DDB2_${process.env.bluetag}`,
        Select: "ALL_ATTRIBUTES",
        KeyConditionExpression: '#tn = :tv',
        ExpressionAttributeNames: {
            '#tn': 'TableName'
        },
        ExpressionAttributeValues: {
            ':tv':`Users_DDB2_${process.env.bluetag}`
        }
    }))
    const totalSegments = Math.floor((tableInfo.Items[0].Count/segmentSize)+1)
    console.log("🚀 ~ getUsersParallel ~ segmentSize:", segmentSize)

    const params = {
        TableName: `Users_DDB2_${process.env.bluetag}`
        // Agrega cualquier filtro o proyección si es necesario
    };
    if(filter){
        params['FilterExpression'] = 'contains(#Name, :name)';
        params['ExpressionAttributeNames'] = {
            '#Name': 'Name'
        }
        params['ExpressionAttributeValues'] = {
            ':name': filter
        }
    }
    let Items = await parallelScan(params,totalSegments)
    return Items;
}

const getOrdersParallel = async (filter=null) => {
    let tableInfo = await ddbDocClient.send(new QueryCommand({
        TableName: `Info_DDB2_${process.env.bluetag}`,
        Select: "ALL_ATTRIBUTES",
        KeyConditionExpression: '#tn = :tv',
        ExpressionAttributeNames: {
            '#tn': 'TableName'
        },
        ExpressionAttributeValues: {
            ':tv':`Orders_DDB2_${process.env.bluetag}`
        }
    }))
    const totalSegments = Math.floor((tableInfo.Items[0].Count/segmentSize)+1)

    const params = {
        TableName: `Orders_DDB2_${process.env.bluetag}`
        // Agrega cualquier filtro o proyección si es necesario
    };
    if(filter){
        params['FilterExpression'] = 'begins_with(#OrderDate, :date)';
        params['ExpressionAttributeNames'] = {
            '#OrderDate': 'OrderDate'
        }
        params['ExpressionAttributeValues'] = {
            ':date': filter
        }
    }
    let Items = await parallelScan(params,totalSegments)
    return Items;
}

const getOrderItemssParallel = async (filter=null) => {
    let tableInfo = await ddbDocClient.send(new QueryCommand({
        TableName: `Info_DDB2_${process.env.bluetag}`,
        Select: "ALL_ATTRIBUTES",
        KeyConditionExpression: '#tn = :tv',
        ExpressionAttributeNames: {
            '#tn': 'TableName'
        },
        ExpressionAttributeValues: {
            ':tv':`OrderItems_DDB2_${process.env.bluetag}`
        }
    }))
    const totalSegments = Math.floor((tableInfo.Items[0].Count/segmentSize)+1)

    const params = {
        TableName: `OrderItems_DDB2_${process.env.bluetag}`
        // Agrega cualquier filtro o proyección si es necesario
    };
    if(filter){
        params['FilterExpression'] = '#Quantity = :quantity';
        params['ExpressionAttributeNames'] = {
            '#Quantity': 'Quantity'
        }
        params['ExpressionAttributeValues'] = {
            ':quantity': Number(filter)
        }
    }
    let Items = await parallelScan(params,totalSegments)
    return Items;
}

export {getUsersParallel, getOrdersParallel, getOrderItemssParallel}