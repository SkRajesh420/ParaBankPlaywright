import * as fs from 'fs';
import * as path from 'path';

async function globalSetup() {
  console.log('\n🧹 Cleaning old Allure reports...\n');
  
  const allureResultsPath = path.join(process.cwd(), 'allure-results');
  const allureReportPath = path.join(process.cwd(), 'allure-report');
  
  // Clean allure-results folder
  if (fs.existsSync(allureResultsPath)) {
    fs.rmSync(allureResultsPath, { recursive: true, force: true });
    console.log('✓ Cleaned old allure-results folder');
  }
  
  // Clean allure-report folder
  if (fs.existsSync(allureReportPath)) {
    fs.rmSync(allureReportPath, { recursive: true, force: true });
    console.log('✓ Cleaned old allure-report folder');
  }
  
  console.log('✓ Ready to run tests!\n');
}

export default globalSetup;