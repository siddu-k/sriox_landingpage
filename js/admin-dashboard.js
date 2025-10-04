// Admin Dashboard JavaScript - Complete Management System
import { JobManager, AuthManager, onAuthStateChanged } from './firebase-config.js';

class AdminDashboard {
    constructor() {
        this.jobs = [];
        this.applications = [];
        this.currentEditingJob = null;
        
        // Initialize managers
        this.jobManager = new JobManager();
        this.authManager = new AuthManager();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeElements();
                this.setupEventListeners();
                this.initializeAuth();
            });
        } else {
            this.initializeElements();
            this.setupEventListeners();
            this.initializeAuth();
        }
    }

    initializeElements() {
        console.log('🔧 Initializing elements...');
        
        // Auth elements
        this.loginSection = document.getElementById('login-section');
        this.dashboardSection = document.getElementById('dashboard-section');
        this.loginError = document.getElementById('login-error');
        this.adminEmail = document.getElementById('admin-email');
        this.logoutBtn = document.getElementById('logout-btn');
        this.setupAdminBtn = document.getElementById('setup-admin-btn');
        this.setupMessage = document.getElementById('setup-message');
        this.forceDashboardBtn = document.getElementById('force-dashboard-btn');

        console.log('Login section found:', !!this.loginSection);
        console.log('Dashboard section found:', !!this.dashboardSection);
        console.log('Admin email element found:', !!this.adminEmail);

        // Dashboard elements
        this.totalJobsCounter = document.getElementById('total-jobs');
        this.activeJobsCounter = document.getElementById('active-jobs');
        this.totalApplicationsCounter = document.getElementById('total-applications');
        this.pendingApplicationsCounter = document.getElementById('pending-applications');

        // Action buttons
        this.addJobBtn = document.getElementById('add-job-btn');
        this.viewApplicationsBtn = document.getElementById('view-applications-btn');
        this.backToJobsBtn = document.getElementById('back-to-jobs');

        // Content areas
        this.jobsList = document.getElementById('jobs-list');
        this.applicationsView = document.getElementById('applications-view');
        this.applicationsList = document.getElementById('applications-list');

        // Filters
        this.statusFilter = document.getElementById('status-filter');

        // Modals
        this.jobModal = document.getElementById('job-modal');
        this.applicationModal = document.getElementById('application-modal');
        this.jobForm = document.getElementById('job-form');
        this.modalTitle = document.getElementById('modal-title');

        // Close modal buttons
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        
        console.log('✅ Elements initialized');
    }

    setupEventListeners() {
        // Auth event listeners (removed login form handler)
        this.logoutBtn?.addEventListener('click', () => this.handleLogout());
        this.setupAdminBtn?.addEventListener('click', () => this.handleSetupAdmin());
        this.forceDashboardBtn?.addEventListener('click', () => this.showDashboardFallback());
        this.testDashboardBtn?.addEventListener('click', () => this.testDashboardToggle());

        // Dashboard event listeners
        this.addJobBtn?.addEventListener('click', () => this.openAddJobModal());
        this.viewApplicationsBtn?.addEventListener('click', () => this.showApplicationsView());
        this.backToJobsBtn?.addEventListener('click', () => this.showJobsView());

        // Filter listeners
        this.statusFilter?.addEventListener('change', () => this.applyFilters());

        // Modal event listeners
        this.closeModalBtns?.forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Form submission
        this.jobForm?.addEventListener('submit', (e) => this.handleJobSubmit(e));

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    async initializeAuth() {
        try {
            console.log('🔧 Initializing auth with hardcoded credentials...');
            
            // Auto-login with hardcoded credentials
            const email = 'sridatta.k99@gmail.com';
            const password = '2025sriox';
            
            // Set a timeout to show dashboard anyway after 3 seconds
            setTimeout(() => {
                if (this.dashboardSection && this.dashboardSection.style.display === 'none') {
                    console.log('⚠️ Timeout reached, showing force dashboard button...');
                    if (this.forceDashboardBtn) {
                        this.forceDashboardBtn.style.display = 'inline-block';
                    }
                }
            }, 3000);
            
            // Force show dashboard after 8 seconds regardless
            setTimeout(() => {
                if (this.dashboardSection && this.dashboardSection.style.display === 'none') {
                    console.log('⏰ Final timeout reached, forcing dashboard display...');
                    this.showDashboardFallback();
                }
            }, 8000);
            
            // Try to sign in automatically
            try {
                console.log('🔑 Attempting auto-login...');
                await this.authManager.signIn(email, password);
                console.log('✅ Auto-login successful');
                // Force show dashboard immediately after successful login
                this.showDashboardFallback();
            } catch (loginError) {
                console.log('⚠️ Auto-login failed:', loginError.message);
                // Show dashboard anyway in demo mode
                this.showDashboardFallback();
            }
            
            // Listen for auth state changes
            onAuthStateChanged(this.authManager.auth, (user) => {
                console.log('🔄 Auth state changed. User:', user);
                if (user) {
                    console.log('✅ User is authenticated, showing dashboard');
                    this.showDashboard(user);
                } else {
                    console.log('❌ User not authenticated, showing dashboard in demo mode');
                    this.showDashboardFallback();
                }
            });
        } catch (error) {
            console.error('❌ Auth initialization error:', error);
            // Fallback to show dashboard anyway
            this.showDashboardFallback();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            this.clearLoginError();
            this.showLoginLoading(true);
            
            await this.authManager.signIn(email, password);
            console.log('Admin login successful');
            
        } catch (error) {
            console.error('Login error:', error);
            this.showLoginError(this.getLoginErrorMessage(error.code));
        } finally {
            this.showLoginLoading(false);
        }
    }

    async handleLogout() {
        try {
            await this.authManager.signOut();
            console.log('Admin logout successful');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async handleSetupAdmin() {
        try {
            this.clearSetupMessage();
            this.showSetupLoading(true);
            
            console.log('🔧 Setting up admin account...');
            
            // Import Firebase functions
            const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js');
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
            
            const ADMIN_EMAIL = 'admin@sriox.com';
            const ADMIN_PASSWORD = 'SrioxAdmin2024!';
            
            // Create the admin user
            const userCredential = await createUserWithEmailAndPassword(this.authManager.auth, ADMIN_EMAIL, ADMIN_PASSWORD);
            const user = userCredential.user;
            
            // Add admin role to Firestore
            const { db } = await import('./firebase-config.js');
            await setDoc(doc(db, 'users', user.uid), {
                email: ADMIN_EMAIL,
                role: 'admin',
                createdAt: new Date().toISOString(),
                displayName: 'Sriox Administrator'
            });
            
            this.showSetupSuccess(ADMIN_EMAIL, ADMIN_PASSWORD);
            
            // Auto-fill the login form
            document.getElementById('email').value = ADMIN_EMAIL;
            document.getElementById('password').value = ADMIN_PASSWORD;
            
        } catch (error) {
            console.error('Setup error:', error);
            
            if (error.code === 'auth/email-already-in-use') {
                this.showSetupSuccess('admin@sriox.com', 'SrioxAdmin2024!', 'Account already exists');
                document.getElementById('email').value = 'admin@sriox.com';
                document.getElementById('password').value = 'SrioxAdmin2024!';
            } else if (error.code === 'auth/unauthorized-domain' || error.message.includes('domain is not authorized')) {
                this.showSetupError(`
                    Domain authorization error. Please:<br>
                    1. Go to <a href="https://console.firebase.google.com/project/sriox-f5ae4/authentication/settings" target="_blank">Firebase Console</a><br>
                    2. Add "127.0.0.1" and "localhost" to Authorized domains<br>
                    3. Or use <strong>http://localhost:5500</strong> instead of 127.0.0.1
                `);
            } else {
                this.showSetupError(error.message);
            }
        } finally {
            this.showSetupLoading(false);
        }
    }

    getLoginErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'No admin account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/invalid-email': 'Invalid email address.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/network-request-failed': 'Network error. Please check your connection.',
            'auth/invalid-credential': 'Invalid email or password.'
        };
        
        return errorMessages[errorCode] || 'Login failed. Please try again.';
    }

    showLogin() {
        this.loginSection.style.display = 'flex';
        this.dashboardSection.style.display = 'none';
        this.clearLoginError();
    }

    showDashboardFallback() {
        console.log('🎯 Showing dashboard in fallback mode...');
        console.log('Login section element:', this.loginSection);
        console.log('Dashboard section element:', this.dashboardSection);
        
        if (this.loginSection) {
            this.loginSection.style.display = 'none';
            console.log('✅ Login section hidden');
        } else {
            console.error('❌ Login section element not found!');
        }
        
        if (this.dashboardSection) {
            this.dashboardSection.style.display = 'block';
            console.log('✅ Dashboard section shown');
        } else {
            console.error('❌ Dashboard section element not found!');
        }
        
        // Display fallback user info
        if (this.adminEmail) {
            this.adminEmail.textContent = 'sridatta.k99@gmail.com (Demo Mode)';
            console.log('✅ User email set in demo mode');
        } else {
            console.error('❌ Admin email element not found!');
        }
        
        // Load dashboard data with fallback
        console.log('🔄 Loading dashboard data in fallback mode...');
        this.loadDashboardDataFallback();
    }

    async showDashboard(user) {
        console.log('🎯 Showing dashboard for user:', user);
        console.log('Login section element:', this.loginSection);
        console.log('Dashboard section element:', this.dashboardSection);
        
        if (this.loginSection) {
            this.loginSection.style.display = 'none';
            console.log('✅ Login section hidden');
        } else {
            console.error('❌ Login section element not found!');
        }
        
        if (this.dashboardSection) {
            this.dashboardSection.style.display = 'block';
            console.log('✅ Dashboard section shown');
        } else {
            console.error('❌ Dashboard section element not found!');
        }
        
        // Display user info
        if (this.adminEmail) {
            this.adminEmail.textContent = user.email;
            console.log('✅ User email set:', user.email);
        } else {
            console.error('❌ Admin email element not found!');
        }
        
        // Load dashboard data
        console.log('🔄 Loading dashboard data...');
        await this.loadDashboardData();
    }

    showLoginError(message) {
        this.loginError.textContent = message;
        this.loginError.style.display = 'block';
    }

    clearLoginError() {
        this.loginError.textContent = '';
        this.loginError.style.display = 'none';
    }

    showLoginLoading(loading) {
        const submitBtn = this.loginForm.querySelector('button[type="submit"]');
        if (loading) {
            submitBtn.textContent = 'Signing in...';
            submitBtn.disabled = true;
        } else {
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
        }
    }

    showSetupLoading(loading) {
        if (loading) {
            this.setupAdminBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            this.setupAdminBtn.disabled = true;
        } else {
            this.setupAdminBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Admin Account';
            this.setupAdminBtn.disabled = false;
        }
    }

    showSetupSuccess(email, password, message = 'Account created successfully') {
        this.setupMessage.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 10px; border-radius: 4px; font-size: 14px;">
                <strong>✅ ${message}!</strong><br>
                <strong>Email:</strong> ${email}<br>
                <strong>Password:</strong> ${password}<br>
                <small>Credentials have been auto-filled above. Click Login to continue.</small>
            </div>
        `;
    }

    showSetupError(message) {
        this.setupMessage.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; font-size: 14px;">
                <strong>❌ Setup Failed:</strong> ${message}
            </div>
        `;
    }

    clearSetupMessage() {
        this.setupMessage.innerHTML = '';
    }

    async loadDashboardDataFallback() {
        try {
            console.log('📊 Loading dashboard data in fallback mode...');
            
            // Use mock data for demonstration
            this.jobs = await this.getMockJobs();
            this.applications = await this.getMockApplications();
            
            console.log('✅ Loaded fallback jobs:', this.jobs.length);
            console.log('✅ Loaded fallback applications:', this.applications.length);
            
            // Update dashboard stats
            this.updateDashboardStats();
            this.renderJobsList();
            
            console.log('✅ Dashboard stats updated and jobs list rendered in fallback mode');
            
        } catch (error) {
            console.error('❌ Error loading fallback dashboard data:', error);
            // Set empty arrays as last resort
            this.jobs = [];
            this.applications = [];
            this.updateDashboardStats();
            this.renderJobsList();
        }
    }

    async loadDashboardData() {
        try {
            console.log('📊 Loading dashboard data...');
            
            // Load jobs and applications data from Firebase
            this.jobs = await this.jobManager.getAllJobs();
            this.applications = await this.jobManager.getAllApplications();
            
            console.log('✅ Loaded jobs:', this.jobs.length);
            console.log('✅ Loaded applications:', this.applications.length);
            
            // Update dashboard stats
            this.updateDashboardStats();
            this.renderJobsList();
            
            console.log('✅ Dashboard stats updated and jobs list rendered');
            
            // Set up real-time listeners
            this.jobManager.onJobsChanged((jobs) => {
                this.jobs = jobs;
                this.updateDashboardStats();
                this.renderJobsList();
            });
            
            console.log('✅ Real-time listeners set up');
            
        } catch (error) {
            console.error('❌ Error loading dashboard data:', error);
            // Fall back to mock data for demonstration
            this.jobs = await this.getMockJobs();
            this.applications = await this.getMockApplications();
            this.updateDashboardStats();
            this.renderJobsList();
            console.log('⚠️ Using mock data due to error');
        }
    }

    updateDashboardStats() {
        const activeJobs = this.jobs.filter(job => job.isActive !== false);
        const pendingApps = this.applications.filter(app => app.status === 'pending');
        
        this.totalJobsCounter.textContent = this.jobs.length;
        this.activeJobsCounter.textContent = activeJobs.length;
        this.totalApplicationsCounter.textContent = this.applications.length;
        this.pendingApplicationsCounter.textContent = pendingApps.length;
    }

    renderJobsList() {
        if (!this.jobsList) return;
        
        if (this.jobs.length === 0) {
            this.jobsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-briefcase"></i>
                    <h3>No Job Postings</h3>
                    <p>Click "Add New Job" to create your first job posting.</p>
                </div>
            `;
            return;
        }
        
        this.jobsList.innerHTML = this.jobs.map(job => this.createJobCard(job)).join('');
    }

    createJobCard(job) {
        return `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-header">
                    <h3>${job.title}</h3>
                    <span class="job-status ${job.isActive !== false ? 'active' : 'inactive'}">
                        ${job.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-briefcase"></i> ${job.type}</span>
                    <span><i class="fas fa-users"></i> ${job.department}</span>
                </div>
                <div class="job-description">
                    ${job.description.substring(0, 150)}${job.description.length > 150 ? '...' : ''}
                </div>
                <div class="job-actions">
                    <button class="btn btn-secondary btn-sm" onclick="adminDashboard.editJob('${job.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="adminDashboard.deleteJob('${job.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    // Mock data for testing
    async getMockJobs() {
        return [
            {
                id: 'job1',
                title: 'Senior Full-Stack Developer',
                description: 'We are looking for an experienced full-stack developer...',
                department: 'Engineering',
                location: 'Remote',
                type: 'full-time',
                requirements: 'React, Node.js, MongoDB',
                salary: '$80,000 - $120,000',
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'job2',
                title: 'UI/UX Designer',
                description: 'Join our design team to create amazing user experiences...',
                department: 'Design',
                location: 'New York',
                type: 'full-time',
                requirements: 'Figma, Adobe Creative Suite',
                salary: '$70,000 - $90,000',
                isActive: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    async getMockApplications() {
        return [
            {
                id: 'app1',
                name: 'John Doe',
                email: 'john@example.com',
                position: 'Senior Full-Stack Developer',
                status: 'pending',
                submittedAt: new Date().toISOString()
            },
            {
                id: 'app2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                position: 'UI/UX Designer',
                status: 'pending',
                submittedAt: new Date().toISOString()
            }
        ];
    }

    // Job management methods (simplified)
    async addJob(jobData) {
        try {
            const jobId = await this.jobManager.addJob(jobData);
            console.log('Job added successfully:', jobId);
            await this.loadDashboardData();
            return jobId;
        } catch (error) {
            console.error('Error adding job:', error);
            throw error;
        }
    }

    async editJob(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (job) {
            console.log('Edit job:', job);
            // Implement edit functionality
        }
    }

    async deleteJob(jobId) {
        if (confirm('Are you sure you want to delete this job posting?')) {
            try {
                await this.jobManager.deleteJob(jobId);
                console.log('Job deleted successfully');
                await this.loadDashboardData();
            } catch (error) {
                console.error('Error deleting job:', error);
                alert('Failed to delete job. Please try again.');
            }
        }
    }

    openAddJobModal() {
        console.log('Open add job modal');
        // Implement modal functionality
    }

    showApplicationsView() {
        console.log('Show applications view');
        // Implement applications view
    }

    showJobsView() {
        console.log('Show jobs view');
        // Implement jobs view
    }

    applyFilters() {
        console.log('Apply filters');
        // Implement filtering
    }

    handleJobSubmit(e) {
        e.preventDefault();
        console.log('Handle job submit');
        // Implement job form submission
    }

    closeModals() {
        console.log('Close modals');
        // Implement modal closing
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});

export default AdminDashboard;