// Firebase Configuration for Sriox Careers System
// Updated to use Firestore instead of Realtime Database

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
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    getDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot 
} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Analytics (optional)
try {
    const { getAnalytics } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js');
    const analytics = getAnalytics(app);
} catch (error) {
    console.log('Analytics not available in development environment');
}

// Export Firebase services
export { 
    db, 
    auth, 
    storage,
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    getDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot,
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
};

// Job Management Functions using Firestore
export class JobManager {
    constructor() {
        this.jobsCollection = 'jobs';
        this.applicationsCollection = 'applications';
    }

    // Add a new job posting
    async addJob(jobData) {
        try {
            const jobRef = await addDoc(collection(db, this.jobsCollection), {
                ...jobData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: true
            });
            
            console.log('Job added successfully with ID:', jobRef.id);
            return jobRef.id;
        } catch (error) {
            console.error('Error adding job:', error);
            throw error;
        }
    }

    // Get all jobs
    async getAllJobs() {
        try {
            const jobsQuery = query(
                collection(db, this.jobsCollection), 
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(jobsQuery);
            
            const jobs = [];
            snapshot.forEach((doc) => {
                jobs.push({ id: doc.id, ...doc.data() });
            });
            
            return jobs;
        } catch (error) {
            console.error('Error getting jobs:', error);
            return [];
        }
    }

    // Get active jobs only
    async getActiveJobs() {
        try {
            const activeJobsQuery = query(
                collection(db, this.jobsCollection),
                where('isActive', '==', true),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(activeJobsQuery);
            
            const jobs = [];
            snapshot.forEach((doc) => {
                jobs.push({ id: doc.id, ...doc.data() });
            });
            
            return jobs;
        } catch (error) {
            console.error('Error getting active jobs:', error);
            return [];
        }
    }

    // Update job
    async updateJob(jobId, updatedData) {
        try {
            const jobRef = doc(db, this.jobsCollection, jobId);
            await updateDoc(jobRef, {
                ...updatedData,
                updatedAt: new Date().toISOString()
            });
            
            console.log('Job updated successfully');
            return true;
        } catch (error) {
            console.error('Error updating job:', error);
            throw error;
        }
    }

    // Delete job
    async deleteJob(jobId) {
        try {
            const jobRef = doc(db, this.jobsCollection, jobId);
            await deleteDoc(jobRef);
            
            console.log('Job deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting job:', error);
            throw error;
        }
    }

    // Submit application
    async submitApplication(applicationData) {
        try {
            const applicationRef = await addDoc(collection(db, this.applicationsCollection), {
                ...applicationData,
                submittedAt: new Date().toISOString(),
                status: 'pending'
            });
            
            console.log('Application submitted successfully with ID:', applicationRef.id);
            return applicationRef.id;
        } catch (error) {
            console.error('Error submitting application:', error);
            throw error;
        }
    }

    // Get all applications
    async getAllApplications() {
        try {
            const applicationsQuery = query(
                collection(db, this.applicationsCollection),
                orderBy('submittedAt', 'desc')
            );
            const snapshot = await getDocs(applicationsQuery);
            
            const applications = [];
            snapshot.forEach((doc) => {
                applications.push({ id: doc.id, ...doc.data() });
            });
            
            return applications;
        } catch (error) {
            console.error('Error getting applications:', error);
            return [];
        }
    }

    // Listen for real-time job updates
    onJobsChanged(callback) {
        try {
            const jobsQuery = query(
                collection(db, this.jobsCollection),
                where('isActive', '==', true),
                orderBy('createdAt', 'desc')
            );
            
            return onSnapshot(jobsQuery, (snapshot) => {
                const jobs = [];
                snapshot.forEach((doc) => {
                    jobs.push({ id: doc.id, ...doc.data() });
                });
                callback(jobs);
            });
        } catch (error) {
            console.error('Error setting up jobs listener:', error);
            return null;
        }
    }
}

// Authentication Manager
export class AuthManager {
    constructor() {
        this.currentUser = null;
        this.onAuthStateChanged((user) => {
            this.currentUser = user;
        });
    }

    // Sign in admin user
    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            this.currentUser = userCredential.user;
            console.log('Admin signed in successfully');
            return userCredential.user;
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    }

    // Sign out current user
    async signOut() {
        try {
            await signOut(auth);
            this.currentUser = null;
            console.log('Admin signed out successfully');
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
}

// Export Firebase app for other modules
export { app };

console.log('Firebase initialized successfully with Firestore');