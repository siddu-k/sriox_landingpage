// Simple Firebase Connection Test
// Add this script tag to your dashboard.html to test Firebase connection

console.log('🔧 Testing Firebase connection...');

// Test if Firebase is properly imported
import { JobManager } from './firebase-config.js';

async function testFirebaseConnection() {
    try {
        console.log('📡 Creating JobManager instance...');
        const jobManager = new JobManager();
        
        console.log('📋 Testing job retrieval...');
        const jobs = await jobManager.getAllJobs();
        console.log('✅ Firebase connection successful! Jobs found:', jobs.length);
        
        // Test adding a sample job
        console.log('📝 Testing job creation...');
        const testJob = {
            title: 'Test Job - ' + Date.now(),
            department: 'engineering',
            location: 'Test Location',
            type: 'full-time',
            description: 'This is a test job posting',
            requirements: 'Test requirements',
            isActive: true,
            createdAt: new Date().toISOString()
        };
        
        await jobManager.addJob(testJob);
        console.log('✅ Test job created successfully!');
        
        // Verify the job was added
        const updatedJobs = await jobManager.getAllJobs();
        console.log('✅ Updated jobs count:', updatedJobs.length);
        
    } catch (error) {
        console.error('❌ Firebase connection test failed:', error);
        console.log('🔍 Error details:', {
            name: error.name,
            message: error.message,
            code: error.code
        });
    }
}

// Run the test
testFirebaseConnection();