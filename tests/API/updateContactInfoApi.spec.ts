import { test, expect } from '@playwright/test';
import credentials from '../../testData/credentials.json';
const BASE_URL = 'https://parabank.parasoft.com/parabank/services_proxy/bank';
const CUSTOMER_ID = 12989;

test.describe('ParaBank Update Customer API Tests', () => {
  
  test('Should return status 200 for update customer', async ({ request }) => {
    // Customer update parameters
    const updateParams = new URLSearchParams({
      firstName: 'John',
      lastName: 'Doe',
      street: '456 New St',
      city: 'Newtown',
      state: 'NY',
      zipCode: '67890',
      phoneNumber: '555-6789',
      ssn: '081120010',
      username: credentials.username,
      password: credentials.password
    });

    const response = await request.post(
      `${BASE_URL}/customers/update/${CUSTOMER_ID}?${updateParams.toString()}`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')
        }
      }
    );
    
    expect(response.status()).toBe(200);
  });
  
});