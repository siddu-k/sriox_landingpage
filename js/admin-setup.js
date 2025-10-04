// Admin Setup Script - Creates admin user in Firebase
// Run this in browser console to create an admin account

// Admin credentials - change these for your setup
const ADMIN_EMAIL = 'admin@sriox.com';
const ADMIN_PASSWORD = 'SrioxAdmin2024!';

async function setupAdminAccount() {
    try {
        console.log('🔧 Setting up admin account...');
        
        // Import Firebase v9+ modules
        const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js');
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
        
        // Get Firebase instances from our config
        let auth, db;
        try {
            // Try to get from our firebase-config module
            const firebaseConfig = await import('./firebase-config.js');
            auth = firebaseConfig.auth;
            db = firebaseConfig.db;
        } catch (error) {
            console.error('Could not import from firebase-config.js:', error);
            throw new Error('Firebase configuration not loaded. Please make sure firebase-config.js is properly imported.');
        }
        
        if (!auth || !db) {
            throw new Error('Firebase auth or firestore not initialized. Please check firebase-config.js');
        }
        
        // Try to create the admin user
        const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        const user = userCredential.user;
        
        console.log('✅ Admin account created successfully!');
        console.log('📧 Email:', ADMIN_EMAIL);
        console.log('🔐 Password:', ADMIN_PASSWORD);
        console.log('👤 User ID:', user.uid);
        
        // Add admin role to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: ADMIN_EMAIL,
            role: 'admin',
            createdAt: new Date().toISOString(),
            displayName: 'Sriox Administrator'
        });
        
        console.log('✅ Admin role assigned in Firestore');
        
        return {
            success: true,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            uid: user.uid
        };
        
    } catch (error) {
        console.error('❌ Error setting up admin account:', error);
        
        if (error.code === 'auth/email-already-in-use') {
            console.log('ℹ️ Admin account already exists. Use these credentials:');
            console.log('📧 Email:', ADMIN_EMAIL);
            console.log('🔐 Password:', ADMIN_PASSWORD);
            
            return {
                success: true,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                message: 'Account already exists'
            };
        }
        
        if (error.code === 'auth/unauthorized-domain' || error.message.includes('domain is not authorized')) {
            console.error('🚨 DOMAIN AUTHORIZATION ERROR:');
            console.log('📝 To fix this:');
            console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
            console.log('2. Select project: sriox-f5ae4');
            console.log('3. Go to Authentication → Settings → Authorized domains');
            console.log('4. Add these domains: 127.0.0.1, localhost');
            console.log('5. Or use http://localhost:5500 instead of http://127.0.0.1:5500');
        }
        
        throw error;
    }
}

// Instructions for running this script
console.log(`
🚀 ADMIN SETUP INSTRUCTIONS:

1. Open your browser and go to: http://localhost:5500/admin.html
2. Open browser console (F12)
3. Make sure Firebase is loaded, then run:
   setupAdminAccount()

4. Use these credentials to login:
   📧 Email: ${ADMIN_EMAIL}
   🔐 Password: ${ADMIN_PASSWORD}

5. You can change these credentials by editing this file first.
`);

// Export the function for use
window.setupAdminAccount = setupAdminAccount;