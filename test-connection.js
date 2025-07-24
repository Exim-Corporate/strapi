/**
 * Test multiple connection scenarios to Supabase PostgreSQL database
 */
const { Client } = require('pg');

async function testPostgresDatabaseConnection() {
  console.log('🧪 Testing connection to DEFAULT postgres database...');
  const client = new Client({
    host: 'db.ofwjpnieqzxvaqoaeozr.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'eximpassword',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Successfully connected to DEFAULT postgres database');
    
    const result = await client.query('SELECT current_database(), version()');
    console.log(`✅ Connected to database: ${result.rows[0].current_database}`);
    console.log(`✅ PostgreSQL version: ${result.rows[0].version.split(' ')[0]}`);
    
    // Check if exim database exists
    const dbCheck = await client.query(`
      SELECT datname FROM pg_database WHERE datname = 'exim'
    `);
    
    if (dbCheck.rows.length > 0) {
      console.log('✅ Database "exim" exists in this instance');
    } else {
      console.log('❌ Database "exim" NOT found. Available databases:');
      const allDbs = await client.query(`
        SELECT datname FROM pg_database WHERE datistemplate = false
      `);
      allDbs.rows.forEach(db => console.log(`   - ${db.datname}`));
    }
    
  } catch (error) {
    console.error('❌ DEFAULT postgres connection failed:', error.message);
    return false;
  } finally {
    await client.end();
  }
  return true;
}

async function testCorrectDatabaseConnection() {
  console.log('\n🧪 Testing connection to CORRECT postgres database with env vars...');
  const client = new Client({
    host: 'db.ofwjpnieqzxvaqoaeozr.supabase.co',
    port: 5432,
    database: 'postgres',  // Using postgres instead of exim
    user: 'postgres',
    password: 'eximpassword',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Testing connection to Supabase PostgreSQL...');
    console.log('Host: db.ofwjpnieqzxvaqoaeozr.supabase.co');
    console.log('Database: postgres (correct for Supabase free tier)');
    console.log('SSL: enabled');
    
    await client.connect();
    console.log('✅ Successfully connected to POSTGRES database');
    
    const result = await client.query('SELECT current_database(), version()');
    console.log(`✅ Connected to database: ${result.rows[0].current_database}`);
    console.log(`✅ PostgreSQL version: ${result.rows[0].version.split(' ')[0]}`);
    
    // Check available databases
    console.log('\n📋 Checking available databases:');
    const allDbs = await client.query(`
      SELECT datname FROM pg_database WHERE datistemplate = false
    `);
    allDbs.rows.forEach(db => console.log(`   - ${db.datname}`));
    
    // Check if we can create/query tables
    const tableTest = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      LIMIT 5
    `);
    console.log(`✅ Found ${tableTest.rows.length} tables in public schema`);
    
    // Test if exim schema exists
    const schemaTest = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'exim'
    `);
    
    if (schemaTest.rows.length > 0) {
      console.log('✅ Schema "exim" exists in postgres database');
    } else {
      console.log('❌ Schema "exim" NOT found. Available schemas:');
      const allSchemas = await client.query(`
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name NOT LIKE 'pg_%' AND schema_name != 'information_schema'
      `);
      allSchemas.rows.forEach(schema => console.log(`   - ${schema.schema_name}`));
    }
    
  } catch (error) {
    console.error('❌ POSTGRES database connection failed:', error.message);
    return false;
  } finally {
    await client.end();
  }
  return true;
}

async function testConnectionString() {
  console.log('\n🧪 Testing CONNECTION STRING approach...');
  const client = new Client({
    connectionString: 'postgresql://postgres:eximpassword@db.ofwjpnieqzxvaqoaeozr.supabase.co:5432/postgres?sslmode=require'
  });

  try {
    await client.connect();
    console.log('✅ Connection string approach works');
    
    const result = await client.query('SELECT current_database()');
    console.log(`✅ Connected to: ${result.rows[0].current_database}`);
    
  } catch (error) {
    console.error('❌ Connection string failed:', error.message);
    return false;
  } finally {
    await client.end();
  }
  return true;
}

async function testConnectionPooler() {
  console.log('\n🧪 Testing CONNECTION POOLER (IPv4) approach...');
  
  // Connection pooler works on port 6543 and uses IPv4
  const client = new Client({
    host: 'aws-0-eu-central-1.pooler.supabase.com',  // EU region pooler
    port: 6543,  // Pooler port
    database: 'postgres',
    user: 'postgres.ofwjpnieqzxvaqoaeozr',  // Full user format for pooler
    password: 'eximpassword',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Testing Supabase Connection Pooler...');
    console.log('Host: aws-0-eu-central-1.pooler.supabase.com (IPv4)');
    console.log('Port: 6543 (pooler)');
    console.log('User: postgres.ofwjpnieqzxvaqoaeozr');
    
    await client.connect();
    console.log('✅ Successfully connected via CONNECTION POOLER');
    
    const result = await client.query('SELECT current_database(), version()');
    console.log(`✅ Connected to database: ${result.rows[0].current_database}`);
    console.log(`✅ PostgreSQL version: ${result.rows[0].version.split(' ')[0]}`);
    
  } catch (error) {
    console.error('❌ Connection pooler failed:', error.message);
    
    // Try US region if EU fails
    console.log('🔄 Trying US region pooler...');
    const clientUS = new Client({
      host: 'aws-0-us-east-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres', 
      user: 'postgres.ofwjpnieqzxvaqoaeozr',
      password: 'eximpassword',
      ssl: { rejectUnauthorized: false }
    });
    
    try {
      await clientUS.connect();
      console.log('✅ US region pooler works!');
      await clientUS.end();
      return true;
    } catch (usError) {
      console.error('❌ US pooler also failed:', usError.message);
      return false;
    } finally {
      await clientUS.end();
    }
  } finally {
    await client.end();
  }
  return true;
}

async function runAllTests() {
  console.log('🧪 Running comprehensive Supabase connection tests...\n');
  
  const results = [];
  
  // Test 1: Default postgres database
  results.push(await testPostgresDatabaseConnection());
  
  // Test 2: Correct postgres database connection
  results.push(await testCorrectDatabaseConnection());
  
  // Test 3: Connection pooler (IPv4)
  results.push(await testConnectionPooler());
  
  // Test 4: Connection string approach
  results.push(await testConnectionString());
  
  // Test 4: Connection pooler approach
  results.push(await testConnectionPooler());
  
  console.log('\n📋 SUMMARY:');
  console.log(`Default postgres database: ${results[0] ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`Corrected postgres database: ${results[1] ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`Connection string: ${results[2] ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`Connection pooler: ${results[3] ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  if (results.some(r => r)) {
    console.log('\n🎉 At least one connection method works!');
    if (results[0] || results[1]) {
      console.log('💡 SOLUTION: Use DATABASE_NAME=postgres (confirmed working)');
      console.log('💡 NEXT STEP: Update .env file with DATABASE_NAME=postgres');
    }
  } else {
    console.log('\n❌ All connection methods failed. Check:');
    console.log('1. Network connectivity');
    console.log('2. Credentials (password)');
    console.log('3. Database existence');
    console.log('4. SSL configuration');
  }
}

runAllTests().catch(console.error);
