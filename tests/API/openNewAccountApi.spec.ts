import { test, expect } from '@playwright/test';
import credentials from '../../testData/credentials.json';

const BASE_URL = 'https://parabank.parasoft.com/parabank/services_proxy/bank';
const CUSTOMER_ID = 13988;
const FROM_ACCOUNT_ID = 15675;
const USERNAME = credentials.username;
const PASSWORD = credentials.password;

test.describe('ParaBank Create Account API Tests', () => {
  
  test('Should return status 200 for create checking account', async ({ request }) => {
    const CHECKING_ACCOUNT_TYPE = 0;
    
    const response = await request.post(
      `${BASE_URL}/createAccount?customerId=${CUSTOMER_ID}&newAccountType=${CHECKING_ACCOUNT_TYPE}&fromAccountId=${FROM_ACCOUNT_ID}`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')
        }
      }
    );
    
    expect(response.status()).toBe(200);
  });

  test('Should return status 200 for create savings account', async ({ request }) => {
    const SAVINGS_ACCOUNT_TYPE = 1;
    
    const response = await request.post(
      `${BASE_URL}/createAccount?customerId=${CUSTOMER_ID}&newAccountType=${SAVINGS_ACCOUNT_TYPE}&fromAccountId=${FROM_ACCOUNT_ID}`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')
        }
      }
    );
    
    expect(response.status()).toBe(200);
  });
  
});