import { test, expect } from '@playwright/test';
import credentials from '../../testData/credentials.json';

const BASE_URL = 'https://parabank.parasoft.com/parabank/services_proxy/bank';
const CUSTOMER_ID = 13988;
const USERNAME = credentials.username;
const PASSWORD = credentials.password;
test.describe('ParaBank Get Customer Accounts API Tests', () => {
  
  test('Should return status 200 for get customer accounts', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/customers/${CUSTOMER_ID}/accounts`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')
      }
    });
    
    expect(response.status()).toBe(200);
  });
  
});