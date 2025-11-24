import { test, expect } from '@playwright/test';
import credentials from '../../testData/credentials.json';

const BASE_URL = 'https://parabank.parasoft.com/parabank/services_proxy/bank';
const ACCOUNT_ID = 15009;
const AMOUNT = 100;
const USERNAME = credentials.username;
const PASSWORD = credentials.password;

test.describe('ParaBank Bill Pay API Tests', () => {
  
  test('Should return status 200 for bill pay', async ({ request }) => {
    const payload = {
      address: {
        street: 'CHENNAI',
        city: 'TN',
        state: 'TAMILNADU',
        zipCode: '627859'
      },
      name: 'RAJESH',
      phoneNumber: '8675361335',
      accountNumber: '12'
    };

    const response = await request.post(
      `${BASE_URL}/billpay?accountId=${ACCOUNT_ID}&amount=${AMOUNT}`,
      {
        data: payload,
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64'),
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(await response.json());
    expect(response.status()).toBe(200);
  });
  
});