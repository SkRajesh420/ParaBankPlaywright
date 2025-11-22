import { test, expect } from '@playwright/test';

test('Register New User with Browser Headers', async ({ request }) => {
    
    // 1. Dynamic Data
    const randomInt = Math.floor(Math.random() * 100000);
    const username = `user_${randomInt}`;
    const password = 'password123';

    // 2. Send POST request with Custom Headers
    const response = await request.post('https://parabank.parasoft.com/parabank/register.htm', {
        headers: {
            // Standard Browser Headers
            'Upgrade-Insecure-Requests': '1',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            
            // Security/Fetch Headers
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            
            // Note: Playwright sets Content-Type automatically when using 'form', 
            // but we can enforce it here if preferred.
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'customer.firstName': 'John',
            'customer.lastName': 'Doe',
            'customer.address.street': '123 Main St',
            'customer.address.city': 'New York',
            'customer.address.state': 'NY',
            'customer.address.zipCode': '10001',
            'customer.phoneNumber': '555-0000',
            'customer.ssn': '9876',
            'customer.username': username,
            'customer.password': password,
            'repeatedPassword': password
        }
    });

    // 3. Debugging: Print error if still failing
    if (response.status() !== 200) {
        console.log(`Failed Status: ${response.status()}`);
        console.log(`Server Response: ${await response.text()}`);
    }

    // 4. Assertion
    expect(response.status()).toBe(200);
    console.log(`Successfully registered: ${username}`);
});