import { test, expect, APIRequestContext } from '@playwright/test';
import { format } from 'date-fns';
import { saveCredentials, loadRegistrationData } from '../utils/testDataUtil';

// Define API endpoints
const REGISTER_API_ENDPOINT = 'https://parabank.parasoft.com/parabank/register.htm';
const ACCOUNTS_OVERVIEW_ENDPOINT = 'https://parabank.parasoft.com/parabank/overview.htm';
const ACCOUNTS_API_ENDPOINT = 'https://parabank.parasoft.com/parabank/accounts';
const LOGIN_ENDPOINT = 'https://parabank.parasoft.com/parabank/login';
const LOGOUT_ENDPOINT = 'https://parabank.parasoft.com/parabank/logout.htm';

// Define custom headers
const customHeaders = {
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
    'sec-ch-ua-mobile': '?0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Upgrade-Insecure-Requests': '1',
    'sec-ch-ua-platform': '"Windows"',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Mode': 'navigate',
    'Host': 'parabank.parasoft.com',
};

test.describe('ParaBank API Authentication and Registration Tests', () => {
    let registrationDetails: any;

    test.beforeAll(async () => {
        registrationDetails = loadRegistrationData();
        console.log('Loaded Registration Details:', registrationDetails);
    });

    test('should successfully register a new user via API with mimicked headers and data', async ({ playwright }) => {
        // Create a fresh context for this test using playwright.request
        const apiContext = await playwright.request.newContext({
            extraHTTPHeaders: customHeaders
        });

        const username = `testuser_${format(new Date(), 'yyyyMMddHHmmssSSS')}_${Math.random().toString(36).substring(2, 6)}`;
        const password = `Password${Math.random().toString(36).substring(2, 8)}`;

        const registrationForm = {
            'customer.username': username,
            'customer.firstName': registrationDetails.firstName || 'RAJESH',
            'customer.address.zipCode': registrationDetails.zipCode || '627859',
            'customer.ssn': registrationDetails.ssn || '1682787',
            'customer.lastName': registrationDetails.lastName || 'S',
            'customer.password': password,
            'customer.phoneNumber': registrationDetails.phoneNumber || '08888888888',
            'repeatedPassword': password,
            'customer.address.city': registrationDetails.city || 'chennai',
            'customer.address.state': registrationDetails.state || 'TN',
            'customer.address.street': registrationDetails.address || 'SURANDAI',
        };

        console.log(`Attempting API registration for user: ${username}`);
        console.log('Registration Form Payload:', registrationForm);

        const registerResponse = await apiContext.post(REGISTER_API_ENDPOINT, {
            form: registrationForm,
            maxRedirects: 5,
        });

        const statusCode = registerResponse.status();
        const registerResponseBody = await registerResponse.text();

        console.log(`Registration Response Status: ${statusCode}`);
        
        if (statusCode !== 200) {
            console.error('Non-200 Status Body:', registerResponseBody);
            console.error('Non-200 Status Headers:', registerResponse.headers());
        } else if (registerResponseBody.includes('This username already exists.')) {
            console.error('Registration failed: Username already exists.');
            expect(registerResponseBody).not.toContain('This username already exists.');
        } else if (registerResponseBody.includes('Error!')) {
            console.error('Registration failed: Generic server error.');
            expect(registerResponseBody).not.toContain('Error!');
        }

        expect(statusCode).toBe(200);
        expect(registerResponse.url()).toContain(ACCOUNTS_OVERVIEW_ENDPOINT);
        expect(registerResponseBody).toContain('Accounts Overview');
        expect(registerResponseBody).toContain(`Welcome ${username}`);

        console.log(`✅ API Registration successful for user: ${username}`);
        saveCredentials(username, password);

        // Verify session by retrieving accounts
        const accountsResponse = await apiContext.get(ACCOUNTS_API_ENDPOINT);
        expect(accountsResponse.status()).toBe(200);
        const accounts = await accountsResponse.json();
        expect(Array.isArray(accounts)).toBeTruthy();
        expect(accounts.length).toBeGreaterThanOrEqual(1);
        console.log(`✅ Verified API session by retrieving ${accounts.length} accounts.`);

        // Cleanup
        await apiContext.dispose();
    });

    // test('should successfully log in an existing user via API', async ({ playwright }) => {
    //     // Create a fresh context for this test using playwright.request
    //     const apiContext = await playwright.request.newContext({
    //         extraHTTPHeaders: customHeaders
    //     });

    //     const loginUsername = `loginuser_${format(new Date(), 'yyyyMMddHHmmssSSS')}_${Math.random().toString(36).substring(2, 6)}`;
    //     const loginPassword = `LoginPass${Math.random().toString(36).substring(2, 8)}`;

    //     const loginRegistrationForm = {
    //         'customer.username': loginUsername,
    //         'customer.firstName': registrationDetails.firstName || 'LoginFirstName',
    //         'customer.address.zipCode': registrationDetails.zipCode || '12345',
    //         'customer.ssn': registrationDetails.ssn || '111223333',
    //         'customer.lastName': registrationDetails.lastName || 'LoginLastName',
    //         'customer.password': loginPassword,
    //         'customer.phoneNumber': registrationDetails.phoneNumber || '9998887777',
    //         'repeatedPassword': loginPassword,
    //         'customer.address.city': registrationDetails.city || 'LoginCity',
    //         'customer.address.state': registrationDetails.state || 'LS',
    //         'customer.address.street': registrationDetails.address || 'LoginStreet',
    //     };

    //     console.log(`Attempting API registration for login user: ${loginUsername}`);
    //     const regResponse = await apiContext.post(REGISTER_API_ENDPOINT, {
    //         form: loginRegistrationForm,
    //         maxRedirects: 5,
    //     });
        
    //     expect(regResponse.status()).toBe(200);
    //     const regBody = await regResponse.text();
    //     expect(regBody).toContain(`Welcome ${loginUsername}`);
    //     console.log(`✅ Login-specific user registered: ${loginUsername}`);

    //     // Logout to perform a fresh login
    //     await apiContext.get(LOGOUT_ENDPOINT);
    //     console.log(`Logged out to prepare for fresh login.`);

    //     // Perform API Login
    //     console.log(`Attempting API login for existing user: ${loginUsername}`);
    //     const loginResponse = await apiContext.post(LOGIN_ENDPOINT, {
    //         form: {
    //             username: loginUsername,
    //             password: loginPassword,
    //         },
    //         maxRedirects: 5,
    //     });

    //     expect(loginResponse.status()).toBe(200);
    //     expect(loginResponse.url()).toContain(ACCOUNTS_OVERVIEW_ENDPOINT);

    //     const loginResponseBody = await loginResponse.text();
    //     expect(loginResponseBody).toContain('Accounts Overview');
    //     expect(loginResponseBody).toContain(`Welcome ${loginUsername}`);
    //     console.log(`✅ API Login successful for user: ${loginUsername}.`);

    //     // Verify logged-in session
    //     const accountsResponse = await apiContext.get(ACCOUNTS_API_ENDPOINT);
    //     expect(accountsResponse.status()).toBe(200);
    //     const accounts = await accountsResponse.json();
    //     expect(Array.isArray(accounts)).toBeTruthy();
    //     expect(accounts.length).toBeGreaterThanOrEqual(1);
    //     console.log(`✅ Retrieved ${accounts.length} accounts via API for logged-in user.`);

    //     // Cleanup
    //     await apiContext.dispose();
    // });
});