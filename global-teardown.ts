import { execSync } from 'child_process';

async function globalTeardown() {
  console.log('\n📊 Generating Allure Report...\n');
  
  try {
    // Generate Allure report
    execSync('allure generate allure-results --clean -o allure-report', { 
      stdio: 'inherit' 
    });
    
    console.log('\n✓ Allure report generated successfully');
    console.log('💡 To view the report, run: allure open allure-report\n');
    
  } catch (error) {
    console.error('\n❌ Error generating Allure report:', error);
    console.log('\n💡 Make sure Allure is installed:');
    console.log('   npm install -g allure-commandline\n');
  }
}

export default globalTeardown;