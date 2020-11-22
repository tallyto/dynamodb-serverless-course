/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.lambdaHandler = async (event, context) => {
  let body;

  if (event.path === '/categoria') {
    body = await getByCategoria();
  } else if (event.path === '/categoriaScan') {
    body = await getByCategoriaWithScan();
  } else {
    switch (event.httpMethod) {
      case 'GET':
        body = await getItem();
        break;
      case 'POST':
        body = await createItem();
        break;
      case 'PUT':
        body = await updateItem();
        break;
      case 'DELETE':
        body = await deleteItem();
        break;
      default:
        body = 'unexpected method';
        break;
    }
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(body),
  };

  return response;
};

async function getItem() {
  const params = {
    TableName: 'PrimeiraTabela',
    Key: { id: '2' },
  };
  let body;
  try {
    const data = await docClient.get(params).promise();

    body = data.Item;
  } catch (err) {
    console.log(err);
    body = err;
  }
  return body;
}
async function getByCategoriaWithScan() {
  const params = {
    TableName: 'PrimeiraTabela',
    ProjectionExpression: 'id, nome',
    FilterExpression: '#categoria = :categoria and contains (nome, :nome)',
    ExpressionAttributeNames: {
      '#categoria': 'categoria',
    },
    ExpressionAttributeValues: {
      ':categoria': 1,
      ':nome': 'Maria Dominga',
    },
  };
  let body;
  try {
    const data = await docClient.scan(params).promise();
    body = data.Items;
  } catch (err) {
    console.log(err);
    body = err;
  }

  return body;
}

async function getByCategoria() {
  const params = {
    TableName: 'PrimeiraTabela',
    IndexName: 'categoria-index',
    FilterExpression: 'nome = :nome',
    KeyConditionExpression: '#categoria = :categoria',
    ExpressionAttributeNames: {
      '#categoria': 'categoria',
    },
    ExpressionAttributeValues: {
      ':categoria': 1,
      ':nome': 'Maria Dominga',
    },
  };
  let body;
  try {
    const data = await docClient.query(params).promise();
    body = data.Items;
  } catch (err) {
    console.log(err);
    body = err;
  }

  return body;
}

async function createItem() {
  const params = {
    TableName: 'PrimeiraTabela',
    Item: {
      id: '3',
      nome: 'Yves Rodrigues',
      categoria: 'Irmão',
    },
  };
  let body;
  try {
    const data = await docClient.put(params).promise();

    body = data.Item;
  } catch (err) {
    console.log(err);
    body = err;
  }

  return body;
}

async function deleteItem() {
  const params = {
    TableName: 'PrimeiraTabela',
    Key: { id: '2' },
  };
  let body;
  try {
    const data = await docClient.delete(params).promise();
    body = data.Item;
  } catch (err) {
    console.log(err);
    body = err;
  }

  return body;
}

async function updateItem() {
  const params = {
    TableName: 'PrimeiraTabela',
    Key: { id: '3' },
    UpdateExpression: 'set nome = :nome, categoria = :categoria',
    ExpressionAttributeValues: {
      ':nome': 'Yves Rodrigues',
      ':categoria': 'Irmão mais burro',
    },
  };
  let body;
  try {
    const data = await docClient.update(params).promise();
    body = data.Item;
  } catch (err) {
    console.log(err);
    body = err;
  }

  return body;
}
