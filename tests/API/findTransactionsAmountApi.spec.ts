import { test, expect } from '@playwright/test';
import credentials from '../../testData/credentials.json';

const BASE_URL = 'https://parabank.parasoft.com/parabank/services_proxy/bank';
const ACCOUNT_ID = 15675;
const AMOUNT = '100';
const USERNAME = credentials.username;
const PASSWORD = credentials.password;

test.describe('ParaBank Get Transactions by Amount API Tests', () => {
  
  test('Should return status 200 for get transactions by Amount', async ({ request }) => {
    const response = await request.get(
      `${BASE_URL}/accounts/${ACCOUNT_ID}/transactions/amount/${AMOUNT}?timeout=30000`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')
        }
      }
    );
    
    expect(response.status()).toBe(200);
  });
  
});