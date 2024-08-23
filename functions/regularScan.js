import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient,ScanCommand,GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";

const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" , credentials: fromIni({profile: process.env.profile})});
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

const getUsersRegular = async (filter=null) => {
    const params = {
        TableName: `Users_DDB2_${process.env.bluetag}`
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
    var result;
    var Items = []
    do {
        result = await ddbDocClient.send(new ScanCommand(params))
        Items = Items.concat(result.Items)
        params['ExclusiveStartKey'] = result.LastEvaluatedKey;
    } while (result.LastEvaluatedKey);

    return Items;
}

const getOrdersRegular = async (filter=null) => {
    const params = {
        TableName: `Orders_DDB2_${process.env.bluetag}`
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
    var result;
    let Items = []
    do {
        result = await ddbDocClient.send(new ScanCommand(params))
        Items.concat(result.Items)
        params['ExclusiveStartKey'] = result.LastEvaluatedKey;
    } while (result.LastEvaluatedKey);

    return Items;
}

const getOrderItemssRegular = async (filter=null) => {
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
    var result;
    let Items = []
    do {
        result = await ddbDocClient.send(new ScanCommand(params))
        Items.concat(result.Items)
        params['ExclusiveStartKey'] = result.LastEvaluatedKey;
    } while (result.LastEvaluatedKey);

    return Items;
}

export {getUsersRegular, getOrdersRegular, getOrderItemssRegular}
