// Terminal Firebase Test Script
// This script will test adding data directly to Firebase from Node.js

import { initializeApp } from 'firebase/app';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy 
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeOMr0r25wshIhInz4dpdzFh7Whgp0w_c",
    authDomain: "sriox-f5ae4.firebaseapp.com",
    projectId: "sriox-f5ae4",
    storageBucket: "sriox-f5ae4.firebasestorage.app",
    messagingSenderId: "291988856309",
    appId: "1:291988856309:web:acc53f428860c0899014bc",
    measurementId: "G-LDPLT6Q4VD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🔥 Firebase Terminal Test Starting...');
console.log('📡 Connecting to Firebase...');

async function testFirebaseConnection() {
    try {
        console.log('🔧 Testing Firebase connection...');
        
        // Test 1: Try to read existing jobs
        console.log('\n📋 Test 1: Reading existing jobs...');
        const jobsRef = collection(db, 'jobs');
        const jobsQuery = query(jobsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(jobsQuery);
        
        console.log(`✅ Successfully connected! Found ${snapshot.size} existing jobs.`);
        
        if (snapshot.size > 0) {
            console.log('📄 Existing jobs:');
            snapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`  - ${data.title} (${data.department}) [ID: ${doc.id}]`);
            });
        }
        
        return true;
    } catch (error) {
        console.error('❌ Firebase connection failed:', error.message);
        console.error('Error code:', error.code);
        return false;
    }
}

async function addTestJob() {
    try {
        console.log('\n📝 Test 2: Adding a new test job...');
        
        const testJob = {
            title: `Terminal Test Job - ${new Date().toLocaleTimeString()}`,
            department: 'engineering',
            location: 'Remote (Terminal Test)',
            type: 'full-time',
            description: 'This is a test job added from the terminal to verify Firebase connection.',
            requirements: 'Terminal testing, Firebase knowledge, Node.js experience',
            isActive: true,
            createdAt: new Date(),
            testFlag: true // Mark as test data
        };
        
        console.log('📤 Sending job data:', testJob);
        
        const docRef = await addDoc(collection(db, 'jobs'), testJob);
        console.log('✅ Test job added successfully with ID:', docRef.id);
        
        return docRef.id;
    } catch (error) {
        console.error('❌ Error adding test job:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', error);
        throw error;
    }
}

async function verifyJobAdded(jobId) {
    try {
        console.log('\n🔍 Test 3: Verifying job was added...');
        
        const jobsRef = collection(db, 'jobs');
        const snapshot = await getDocs(jobsRef);
        
        let foundJob = null;
        snapshot.forEach((doc) => {
            if (doc.id === jobId) {
                foundJob = { id: doc.id, ...doc.data() };
            }
        });
        
        if (foundJob) {
            console.log('✅ Job verified in database:');
            console.log('  Title:', foundJob.title);
            console.log('  Department:', foundJob.department);
            console.log('  ID:', foundJob.id);
            console.log('  Created:', foundJob.createdAt.toDate ? foundJob.createdAt.toDate() : foundJob.createdAt);
        } else {
            console.log('❌ Job not found in database');
        }
        
        return foundJob;
    } catch (error) {
        console.error('❌ Error verifying job:', error.message);
        throw error;
    }
}

async function runFullTest() {
    console.log('🚀 Starting comprehensive Firebase test...');
    console.log('=' .repeat(50));
    
    try {
        // Step 1: Test connection
        const connected = await testFirebaseConnection();
        if (!connected) {
            console.log('❌ Cannot proceed - Firebase connection failed');
            return;
        }
        
        // Step 2: Add test job
        const jobId = await addTestJob();
        
        // Step 3: Verify job was added
        const verifiedJob = await verifyJobAdded(jobId);
        
        if (verifiedJob) {
            console.log('\n🎉 All tests passed! Firebase is working correctly.');
            console.log('✅ Connection: OK');
            console.log('✅ Write permissions: OK');
            console.log('✅ Read permissions: OK');
            console.log('✅ Data integrity: OK');
        }
        
    } catch (error) {
        console.log('\n💥 Test failed with error:');
        console.error(error);
        
        // Provide troubleshooting advice
        console.log('\n🔧 Troubleshooting tips:');
        if (error.code === 'permission-denied') {
            console.log('- Check your Firestore security rules');
            console.log('- Make sure the rules allow write access');
        } else if (error.code === 'unavailable') {
            console.log('- Check your internet connection');
            console.log('- Verify Firebase project is active');
        } else {
            console.log('- Check your Firebase configuration');
            console.log('- Verify project ID and API key');
        }
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('🏁 Firebase terminal test completed');
}

// Run the test
runFullTest();