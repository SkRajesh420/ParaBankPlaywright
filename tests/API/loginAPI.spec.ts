import { test, expect } from '@playwright/test';
import credentials from '../../testData/credentials.json';

const BASE_URL = 'https://parabank.parasoft.com/parabank/services/bank';
const USERNAME = credentials.username;
const PASSWORD = credentials.password;

test.describe('ParaBank Login API Tests', () => {
  
  test('Should return status 200 for valid login', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/login/${USERNAME}/${PASSWORD}`);
    
    expect(response.status()).toBe(200);
  });
  
});