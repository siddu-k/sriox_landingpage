// Firebase Configuration
// Your actual Firebase project configuration
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
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, getDoc, query, where, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

try {
    const analytics = getAnalytics(app);
} catch (error) {
    console.log('Analytics not available in development');
}

// Export Firebase services for Firestore
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
        try {
            const newJobRef = push(this.jobsRef);
            const jobWithId = {
                ...jobData,
                id: newJobRef.key,
                createdAt: new Date().toISOString(),
                status: 'active'
            };
            await set(newJobRef, jobWithId);
            return newJobRef.key;
        } catch (error) {
            console.error('Error adding job:', error);
            throw error;
        }
    }

    // Get all jobs
    async getAllJobs() {
        try {
            const snapshot = await get(this.jobsRef);
            if (snapshot.exists()) {
                return Object.values(snapshot.val());
            }
            return [];
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    }

    // Get active jobs only
    async getActiveJobs() {
        try {
            const jobs = await this.getAllJobs();
            return jobs.filter(job => job.status === 'active');
        } catch (error) {
            console.error('Error fetching active jobs:', error);
            throw error;
        }
    }

    // Update job
    async updateJob(jobId, updatedData) {
        try {
            const jobRef = ref(database, `jobs/${jobId}`);
            await set(jobRef, { ...updatedData, updatedAt: new Date().toISOString() });
        } catch (error) {
            console.error('Error updating job:', error);
            throw error;
        }
    }

    // Delete job
    async deleteJob(jobId) {
        try {
            const jobRef = ref(database, `jobs/${jobId}`);
            await remove(jobRef);
        } catch (error) {
            console.error('Error deleting job:', error);
            throw error;
        }
    }

    // Submit job application
    async submitApplication(applicationData) {
        try {
            const newApplicationRef = push(this.applicationsRef);
            const applicationWithId = {
                ...applicationData,
                id: newApplicationRef.key,
                submittedAt: new Date().toISOString(),
                status: 'pending'
            };
            await set(newApplicationRef, applicationWithId);
            return newApplicationRef.key;
        } catch (error) {
            console.error('Error submitting application:', error);
            throw error;
        }
    }

    // Get all applications
    async getAllApplications() {
        try {
            const snapshot = await get(this.applicationsRef);
            if (snapshot.exists()) {
                return Object.values(snapshot.val());
            }
            return [];
        } catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    }

    // Listen for real-time job updates
    onJobsChanged(callback) {
        onValue(this.jobsRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(Object.values(snapshot.val()));
            } else {
                callback([]);
            }
        });
    }
}

// Authentication Manager
export class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authCallbacks = [];
        
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.authCallbacks.forEach(callback => callback(user));
        });
    }

    // Admin login
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Admin logout
    async logout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Listen for auth state changes
    onAuthStateChange(callback) {
        this.authCallbacks.push(callback);
    }
}

// Initialize managers
export const jobManager = new JobManager();
export const authManager = new AuthManager();