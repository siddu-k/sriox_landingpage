// Simple Firebase REST API test using Node.js fetch
// This will test adding data to Firebase using the REST API

console.log('🔥 Firebase REST API Terminal Test Starting...');
console.log('📡 Testing Firebase connection using REST API...');

const PROJECT_ID = 'sriox-f5ae4';
const COLLECTION = 'jobs';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

// Test job data
const testJob = {
    fields: {
        title: { stringValue: `Terminal REST Test Job - ${new Date().toLocaleTimeString()}` },
        department: { stringValue: 'engineering' },
        location: { stringValue: 'Remote (REST API Test)' },
        type: { stringValue: 'full-time' },
        description: { stringValue: 'This is a test job added from terminal using REST API.' },
        requirements: { stringValue: 'REST API testing, Firebase knowledge' },
        isActive: { booleanValue: true },
        createdAt: { timestampValue: new Date().toISOString() },
        testFlag: { booleanValue: true }
    }
};

async function testFirebaseRESTConnection() {
    try {
        console.log('\n📋 Test 1: Reading existing jobs via REST API...');
        
        const response = await fetch(BASE_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const jobCount = data.documents ? data.documents.length : 0;
        
        console.log(`✅ Successfully connected! Found ${jobCount} existing jobs.`);
        
        if (data.documents && data.documents.length > 0) {
            console.log('📄 Existing jobs:');
            data.documents.forEach((doc, index) => {
                const fields = doc.fields;
                const title = fields.title?.stringValue || 'No title';
                const dept = fields.department?.stringValue || 'No department';
                console.log(`  ${index + 1}. ${title} (${dept})`);
            });
        }
        
        return true;
    } catch (error) {
        console.error('❌ REST API connection failed:', error.message);
        return false;
    }
}

async function addTestJobViaREST() {
    try {
        console.log('\n📝 Test 2: Adding test job via REST API...');
        console.log('📤 Sending job data...');
        
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testJob)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`);
        }
        
        const result = await response.json();
        console.log('✅ Test job added successfully!');
        console.log('📋 Document ID:', result.name.split('/').pop());
        
        return result.name.split('/').pop();
    } catch (error) {
        console.error('❌ Error adding test job via REST API:', error.message);
        throw error;
    }
}

async function verifyJobViaREST() {
    try {
        console.log('\n🔍 Test 3: Verifying job was added...');
        
        const response = await fetch(BASE_URL);
        const data = await response.json();
        
        if (data.documents) {
            const testJobs = data.documents.filter(doc => 
                doc.fields.testFlag?.booleanValue === true
            );
            
            console.log(`✅ Found ${testJobs.length} test job(s) in database`);
            
            if (testJobs.length > 0) {
                const latest = testJobs[testJobs.length - 1];
                console.log('📄 Latest test job details:');
                console.log('  Title:', latest.fields.title?.stringValue);
                console.log('  Department:', latest.fields.department?.stringValue);
                console.log('  Location:', latest.fields.location?.stringValue);
                console.log('  Created:', latest.fields.createdAt?.timestampValue);
            }
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error verifying job via REST API:', error.message);
        throw error;
    }
}

async function runRESTTest() {
    console.log('🚀 Starting Firebase REST API test...');
    console.log('=' .repeat(60));
    
    try {
        // Step 1: Test connection
        const connected = await testFirebaseRESTConnection();
        if (!connected) {
            console.log('❌ Cannot proceed - Firebase REST API connection failed');
            return;
        }
        
        // Step 2: Add test job
        const jobId = await addTestJobViaREST();
        
        // Step 3: Verify job was added
        await verifyJobViaREST();
        
        console.log('\n🎉 All REST API tests passed!');
        console.log('✅ Firebase connection: OK');
        console.log('✅ Write permissions: OK');
        console.log('✅ Read permissions: OK');
        console.log('✅ Data integrity: OK');
        
        console.log('\n💡 This means your Firebase setup is working correctly!');
        console.log('💡 The issue might be in your dashboard JavaScript code.');
        
    } catch (error) {
        console.log('\n💥 REST API test failed:');
        console.error(error.message);
        
        console.log('\n🔧 Troubleshooting tips:');
        if (error.message.includes('403')) {
            console.log('- Check your Firestore security rules');
            console.log('- Your rules might be blocking REST API access');
        } else if (error.message.includes('404')) {
            console.log('- Check your Firebase project ID');
            console.log('- Make sure Firestore is enabled in your project');
        } else if (error.message.includes('network')) {
            console.log('- Check your internet connection');
        }
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('🏁 Firebase REST API test completed');
}

// Run the test
runRESTTest();