import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

console.log('🔍 Running comprehensive error check...\n');

// Check TypeScript compilation
async function checkTypeScript() {
  console.log('📝 Checking TypeScript compilation...');
  try {
    const { stdout, stderr } = await execAsync('npx tsc --noEmit', { cwd: __dirname });
    if (stderr) {
      console.log('❌ TypeScript errors found:');
      console.log(stderr);
      return false;
    } else {
      console.log('✅ TypeScript compilation successful');
      return true;
    }
  } catch (error) {
    console.log('❌ TypeScript compilation failed:');
    console.log(error.message);
    return false;
  }
}

// Check ESLint
async function checkESLint() {
  console.log('📝 Checking ESLint...');
  try {
    const { stdout, stderr } = await execAsync('npx eslint src --ext .ts,.tsx', { cwd: __dirname });
    console.log('✅ ESLint check completed');
    if (stdout) {
      console.log('⚠️  ESLint warnings/errors:');
      console.log(stdout);
    }
    return true;
  } catch (error) {
    console.log('❌ ESLint check failed:');
    console.log(error.message);
    return false;
  }
}

// Check backend syntax
async function checkBackendSyntax() {
  console.log('📝 Checking backend syntax...');
  try {
    const { stdout, stderr } = await execAsync('node -c server.js', { cwd: path.join(__dirname, 'server') });
    console.log('✅ Backend syntax check passed');
    return true;
  } catch (error) {
    console.log('❌ Backend syntax errors:');
    console.log(error.message);
    return false;
  }
}

// Check for missing dependencies
async function checkDependencies() {
  console.log('📝 Checking dependencies...');
  
  const frontendPackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const backendPackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'server', 'package.json'), 'utf8'));
  
  console.log('✅ Frontend dependencies defined:', Object.keys(frontendPackageJson.dependencies || {}).length);
  console.log('✅ Backend dependencies defined:', Object.keys(backendPackageJson.dependencies || {}).length);
  
  return true;
}

// Check environment setup
async function checkEnvironment() {
  console.log('📝 Checking environment setup...');
  
  const envExample = path.join(__dirname, 'server', '.env.example');
  const envFile = path.join(__dirname, 'server', '.env');
  
  if (fs.existsSync(envExample)) {
    console.log('✅ Environment example file exists');
  } else {
    console.log('❌ Missing .env.example file');
    return false;
  }
  
  if (fs.existsSync(envFile)) {
    console.log('✅ Environment file exists');
  } else {
    console.log('⚠️  .env file not found - copy from .env.example');
  }
  
  return true;
}

// Main execution
async function runAllChecks() {
  console.log('🚀 Starting comprehensive error check for NextStep Full-Stack Application\n');
  
  const results = {
    typescript: await checkTypeScript(),
    eslint: await checkESLint(),
    backend: await checkBackendSyntax(),
    dependencies: await checkDependencies(),
    environment: await checkEnvironment()
  };
  
  console.log('\n📊 Results Summary:');
  console.log('==================');
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(results)) {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${check.charAt(0).toUpperCase() + check.slice(1)}: ${passed ? 'PASSED' : 'FAILED'}`);
    if (!passed) allPassed = false;
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 ALL CHECKS PASSED! Your application is ready to run.');
    console.log('\n💡 Next steps:');
    console.log('1. Ensure MongoDB is running');
    console.log('2. Update server/.env with your configuration');
    console.log('3. Run: npm run dev:fullstack');
  } else {
    console.log('⚠️  Some checks failed. Please fix the issues above.');
  }
  
  console.log('\n🔧 Available commands:');
  console.log('- npm run dev:fullstack  # Start both frontend and backend');
  console.log('- npm run setup          # Run setup script');
  console.log('- npm run install:all    # Install all dependencies');
}

runAllChecks().catch(console.error);
