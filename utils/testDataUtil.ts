import * as fs from 'fs';
import * as path from 'path';

const testDataDirPath = path.join(__dirname, '../testData');
const credentialsPath = path.join(testDataDirPath, 'credentials.json');
const registrationDataPath = path.join(testDataDirPath, 'registrationData.json');
const loginLocatorsPath = path.join(__dirname, '../locators/loginPageLocators.json'); // Assuming 'locators' directory
const registrationLocatorsPath = path.join(__dirname, '../locators/userRegistration.json'); // Assuming 'locators' directory
const applyLoanLocatorsPath = path.join(__dirname, '../locators/applyLoan.Locators.json'); // Assuming 'locators' directory
const applyLoanDataPath = path.join(testDataDirPath, 'applyLoan.Data.json');

// Helper to ensure directory exists
function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function saveCredentials(username: string, password: string) {
  ensureDirectoryExistence(testDataDirPath); // Ensure the directory exists
  fs.writeFileSync(credentialsPath, JSON.stringify({ username, password }, null, 2));
}

export function loadCredentials(): { username: string; password: string } | null {
  if (!fs.existsSync(credentialsPath)) return null;
  return JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
}

export function loadRegistrationData(): any {
  if (!fs.existsSync(registrationDataPath)) {
    console.warn(`Warning: registration.json not found at ${registrationDataPath}. Using default empty object.`);
    return {};
  }
  return JSON.parse(fs.readFileSync(registrationDataPath, 'utf-8'));
}

export function loadLoginLocators(): any {
  if (!fs.existsSync(loginLocatorsPath)) {
    throw new Error(`Error: loginLocators.json not found at ${loginLocatorsPath}`);
  }
  return JSON.parse(fs.readFileSync(loginLocatorsPath, 'utf-8'));
}

export function loadRegistrationLocators(): any {
  if (!fs.existsSync(registrationLocatorsPath)) {
    throw new Error(`Error: registrationLocators.json not found at ${registrationLocatorsPath}`);
  }
  return JSON.parse(fs.readFileSync(registrationLocatorsPath, 'utf-8'));
}

export function loadApplyLoanLocators(): any {
  if (!fs.existsSync(applyLoanLocatorsPath)) {
    throw new Error(`Error: applyLoanLocators.json not found at ${applyLoanLocatorsPath}`);
  }   
}
export function loadApplyLoanData(): any {
  if (!fs.existsSync(applyLoanDataPath)) {
    throw new Error(`Error: applyLoanData.json not found at ${applyLoanDataPath}`);
  }   
}