// Admin Dashboard JavaScript - Complete Management System
import { JobManager, AuthManager } from './firebase-config.js';

class AdminDashboard {
    constructor() {
        this.    async loadDashboardData() {
        try {
            // Load jobs and applications data from Firebase
            this.jobs = await this.jobManager.getAllJobs();
            this.applications = await this.jobManager.getAllApplications();
            
            // Set up real-time listeners
            this.jobManager.onJobsChanged((jobs) => {
                this.jobs = jobs;
                this.updateDashboardStats();
                this.renderJobsList();
            });  // Set up real-time listeners
            this.jobManager.onJobsChanged((jobs) => {
                this.jobs = jobs;
                this.updateDashboardStats();
                this.renderJobsList();
            });       this.applications = [];
        this.currentEditingJob = null;
        
        // Initialize managers
        this.jobManager = new JobManager();
        this.authManager = new AuthManager();
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeAuth();
    }

    initializeElements() {
        // Auth elements
        this.loginSection = document.getElementById('login-section');
        this.dashboardSection = document.getElementById('dashboard-section');
        this.loginForm = document.getElementById('login-form');
        this.loginError = document.getElementById('login-error');
        this.adminEmail = document.getElementById('admin-email');
        this.logoutBtn = document.getElementById('logout-btn');

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
        this.cancelBtns = document.querySelectorAll('.cancel-btn');
    }

    setupEventListeners() {
        // Auth listeners
        this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        this.logoutBtn?.addEventListener('click', () => this.handleLogout());

        // Action listeners
        this.addJobBtn?.addEventListener('click', () => this.openJobModal());
        this.viewApplicationsBtn?.addEventListener('click', () => this.showApplicationsView());
        this.backToJobsBtn?.addEventListener('click', () => this.showJobsView());

        // Filter listeners
        this.statusFilter?.addEventListener('change', () => this.filterJobs());

        // Modal listeners
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        this.cancelBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Click outside modal to close
        [this.jobModal, this.applicationModal].forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });

        // Form listeners
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
            // Import auth state change listener
            const { onAuthStateChanged } = await import('./firebase-config.js');
            
            // Listen for auth state changes using the auth instance from authManager
            onAuthStateChanged(this.authManager.auth, (user) => {
                if (user) {
                    this.showDashboard(user);
                } else {
                    this.showLogin();
                }
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
            this.showLogin();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            this.clearLoginError();
            await this.authManager.signIn(email, password);
            // Auth state change will trigger showDashboard
        } catch (error) {
            console.error('Login error:', error);
            this.showLoginError(this.getLoginErrorMessage(error.code));
        }
    }

    async handleLogout() {
        try {
            await this.authManager.signOut();
            // Auth state change will trigger showLogin
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    getLoginErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'No admin account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/invalid-email': 'Invalid email address.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/network-request-failed': 'Network error. Please check your connection.'
        };
        
        return errorMessages[errorCode] || 'Login failed. Please try again.';
    }

    showLogin() {
        this.loginSection.style.display = 'flex';
        this.dashboardSection.style.display = 'none';
    }

    async showDashboard(user) {
        this.loginSection.style.display = 'none';
        this.dashboardSection.style.display = 'block';
        
        this.adminEmail.textContent = user.email;
        
        await this.loadDashboardData();
        this.updateDashboardStats();
        this.displayJobs();
    }

    showLoginError(message) {
        this.loginError.textContent = message;
        this.loginError.style.display = 'block';
    }

    clearLoginError() {
        this.loginError.textContent = '';
        this.loginError.style.display = 'none';
    }

    async loadDashboardData() {
        try {
            // Load jobs and applications
            // In production, these would be: 
            // this.jobs = await jobManager.getAllJobs();
            // this.applications = await jobManager.getAllApplications();
            
            // Mock data for demonstration
            this.jobs = await this.getMockJobs();
            this.applications = await this.getMockApplications();
            
            // Set up real-time listeners
            // jobManager.onJobsChanged((jobs) => {
            //     this.jobs = jobs;
            //     this.updateDashboardStats();
            //     this.displayJobs();
            // });
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async getMockJobs() {
        return [
            {
                id: 'job1',
                title: 'Senior Full Stack Developer',
                type: 'full-time',
                department: 'Engineering',
                location: 'Remote • India',
                experience: 'Senior Level',
                salary: '₹80,000 - ₹1,20,000/month',
                description: 'Lead development of client projects and innovative digital solutions.',
                requirements: 'React, Node.js, databases\nAWS/Azure experience\nLeadership skills',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'job2',
                title: 'UI/UX Designer',
                type: 'full-time',
                department: 'Design',
                location: 'Remote • India',
                experience: 'Mid Level',
                salary: '₹50,000 - ₹75,000/month',
                description: 'Create exceptional user experiences for our platform.',
                requirements: 'Figma, Adobe Creative Suite\nDesign systems\nUser research',
                status: 'active',
                createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 'job3',
                title: 'Marketing Coordinator',
                type: 'full-time',
                department: 'Marketing',
                location: 'Remote • India',
                experience: 'Entry Level',
                salary: '₹30,000 - ₹45,000/month',
                description: 'Support marketing campaigns and content creation.',
                requirements: 'Social media experience\nContent writing\nBasic design skills',
                status: 'inactive',
                createdAt: new Date(Date.now() - 172800000).toISOString()
            }
        ];
    }

    async getMockApplications() {
        return [
            {
                id: 'app1',
                jobId: 'job1',
                jobTitle: 'Senior Full Stack Developer',
                name: 'Rahul Sharma',
                email: 'rahul.sharma@email.com',
                phone: '+91 9876543210',
                experience: '6-8',
                status: 'pending',
                submittedAt: new Date().toISOString()
            },
            {
                id: 'app2',
                jobId: 'job2',
                jobTitle: 'UI/UX Designer',
                name: 'Priya Patel',
                email: 'priya.patel@email.com',
                phone: '+91 9876543211',
                experience: '4-5',
                status: 'reviewed',
                submittedAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    }

    updateDashboardStats() {
        const activeJobs = this.jobs.filter(job => job.status === 'active');
        const pendingApps = this.applications.filter(app => app.status === 'pending');

        this.totalJobsCounter.textContent = this.jobs.length;
        this.activeJobsCounter.textContent = activeJobs.length;
        this.totalApplicationsCounter.textContent = this.applications.length;
        this.pendingApplicationsCounter.textContent = pendingApps.length;
    }

    filterJobs() {
        const filter = this.statusFilter.value;
        let filteredJobs = this.jobs;

        if (filter !== 'all') {
            filteredJobs = this.jobs.filter(job => job.status === filter);
        }

        this.displayJobs(filteredJobs);
    }

    displayJobs(jobsToShow = this.jobs) {
        if (!this.jobsList) return;

        if (jobsToShow.length === 0) {
            this.jobsList.innerHTML = `
                <div class="no-jobs-message">
                    <p>No jobs found matching the current filters.</p>
                </div>
            `;
            return;
        }

        this.jobsList.innerHTML = jobsToShow.map(job => this.createJobCard(job)).join('');

        // Add event listeners to action buttons
        this.jobsList.querySelectorAll('.edit-job-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const jobId = btn.dataset.jobId;
                this.editJob(jobId);
            });
        });

        this.jobsList.querySelectorAll('.delete-job-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const jobId = btn.dataset.jobId;
                this.deleteJob(jobId);
            });
        });

        this.jobsList.querySelectorAll('.toggle-status-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const jobId = btn.dataset.jobId;
                this.toggleJobStatus(jobId);
            });
        });
    }

    createJobCard(job) {
        const createdDate = new Date(job.createdAt).toLocaleDateString();
        const applicationCount = this.applications.filter(app => app.jobId === job.id).length;

        return `
            <div class="job-card">
                <div class="job-card-header">
                    <div class="job-card-title">
                        <h3>${job.title}</h3>
                        <div class="job-card-meta">
                            <span><i class="fas fa-building"></i> ${job.department}</span>
                            <span><i class="fas fa-clock"></i> ${job.type}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                            <span><i class="fas fa-calendar"></i> ${createdDate}</span>
                            <span><i class="fas fa-users"></i> ${applicationCount} applications</span>
                        </div>
                    </div>
                    <span class="job-status ${job.status}">${job.status}</span>
                </div>
                
                <div class="job-card-description">
                    <p>${job.description}</p>
                </div>
                
                <div class="job-card-actions">
                    <button class="btn btn-small btn-secondary edit-job-btn" data-job-id="${job.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-small toggle-status-btn" data-job-id="${job.id}">
                        <i class="fas fa-${job.status === 'active' ? 'pause' : 'play'}"></i>
                        ${job.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-small btn-danger delete-job-btn" data-job-id="${job.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    openJobModal(job = null) {
        this.currentEditingJob = job;
        
        if (job) {
            this.modalTitle.textContent = 'Edit Job';
            this.fillJobForm(job);
        } else {
            this.modalTitle.textContent = 'Add New Job';
            this.jobForm.reset();
        }
        
        this.jobModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    fillJobForm(job) {
        document.getElementById('job-title').value = job.title;
        document.getElementById('job-type').value = job.type;
        document.getElementById('job-location').value = job.location;
        document.getElementById('job-department').value = job.department;
        document.getElementById('job-experience').value = job.experience;
        document.getElementById('job-salary').value = job.salary || '';
        document.getElementById('job-description').value = job.description;
        document.getElementById('job-requirements').value = job.requirements;
        document.getElementById('job-benefits').value = job.benefits || '';
        document.getElementById('job-status').value = job.status;
        document.getElementById('job-deadline').value = job.deadline || '';
    }

    async handleJobSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(this.jobForm);
            const jobData = this.prepareJobData(formData);
            
            if (this.currentEditingJob) {
                await this.updateJob(this.currentEditingJob.id, jobData);
                this.showSuccessMessage('Job updated successfully!');
            } else {
                await this.createJob(jobData);
                this.showSuccessMessage('Job created successfully!');
            }
            
            this.closeModals();
            await this.loadDashboardData();
            this.updateDashboardStats();
            this.displayJobs();
            
        } catch (error) {
            console.error('Error saving job:', error);
            this.showErrorMessage('Failed to save job. Please try again.');
        }
    }

    prepareJobData(formData) {
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    async createJob(jobData) {
        return await this.jobManager.addJob(jobData);
        
        // Mock implementation
        const newJob = {
            ...jobData,
            id: 'job_' + Date.now(),
            createdAt: new Date().toISOString()
        };
        
        this.jobs.push(newJob);
        return newJob.id;
    }

    async updateJob(jobId, jobData) {
        return await this.jobManager.updateJob(jobId, jobData);
        
        // Mock implementation
        const jobIndex = this.jobs.findIndex(job => job.id === jobId);
        if (jobIndex !== -1) {
            this.jobs[jobIndex] = {
                ...this.jobs[jobIndex],
                ...jobData,
                updatedAt: new Date().toISOString()
            };
        }
    }

    async deleteJob(jobId) {
        if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            return;
        }
        
        try {
            await this.jobManager.deleteJob(jobId);
            
            // Mock implementation
            this.jobs = this.jobs.filter(job => job.id !== jobId);
            
            this.showSuccessMessage('Job deleted successfully!');
            this.updateDashboardStats();
            this.displayJobs();
            
        } catch (error) {
            console.error('Error deleting job:', error);
            this.showErrorMessage('Failed to delete job. Please try again.');
        }
    }

    async toggleJobStatus(jobId) {
        try {
            const job = this.jobs.find(j => j.id === jobId);
            if (!job) return;
            
            const newStatus = job.status === 'active' ? 'inactive' : 'active';
            await this.updateJob(jobId, { status: newStatus });
            
            this.showSuccessMessage(`Job ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
            this.updateDashboardStats();
            this.displayJobs();
            
        } catch (error) {
            console.error('Error toggling job status:', error);
            this.showErrorMessage('Failed to update job status. Please try again.');
        }
    }

    editJob(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (job) {
            this.openJobModal(job);
        }
    }

    showApplicationsView() {
        document.querySelector('.jobs-management').style.display = 'none';
        this.applicationsView.style.display = 'block';
        this.displayApplications();
    }

    showJobsView() {
        document.querySelector('.jobs-management').style.display = 'block';
        this.applicationsView.style.display = 'none';
    }

    displayApplications() {
        if (!this.applicationsList) return;

        if (this.applications.length === 0) {
            this.applicationsList.innerHTML = `
                <div class="no-applications-message">
                    <p>No applications received yet.</p>
                </div>
            `;
            return;
        }

        this.applicationsList.innerHTML = this.applications.map(app => this.createApplicationCard(app)).join('');

        // Add click listeners to application cards
        this.applicationsList.querySelectorAll('.application-card').forEach(card => {
            card.addEventListener('click', () => {
                const appId = card.dataset.appId;
                this.viewApplicationDetails(appId);
            });
        });
    }

    createApplicationCard(application) {
        const submittedDate = new Date(application.submittedAt).toLocaleDateString();
        
        return `
            <div class="application-card" data-app-id="${application.id}">
                <div class="application-header">
                    <div class="application-info">
                        <h4>${application.name}</h4>
                        <p>${application.jobTitle} • ${application.email}</p>
                        <p class="application-meta">
                            <span><i class="fas fa-calendar"></i> ${submittedDate}</span>
                            <span><i class="fas fa-briefcase"></i> ${application.experience} years</span>
                        </p>
                    </div>
                    <span class="application-status ${application.status}">${application.status}</span>
                </div>
            </div>
        `;
    }

    viewApplicationDetails(appId) {
        const application = this.applications.find(app => app.id === appId);
        if (!application) return;

        const applicationDetails = document.getElementById('application-details');
        applicationDetails.innerHTML = this.createApplicationDetailsHTML(application);
        
        this.applicationModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    createApplicationDetailsHTML(app) {
        const submittedDate = new Date(app.submittedAt).toLocaleDateString();
        
        return `
            <div class="detail-section">
                <h4>Applicant Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Name</strong>
                        <span>${app.name}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Email</strong>
                        <span>${app.email}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Phone</strong>
                        <span>${app.phone}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Experience</strong>
                        <span>${app.experience} years</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Application Details</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Position</strong>
                        <span>${app.jobTitle}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Status</strong>
                        <span class="application-status ${app.status}">${app.status}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Submitted</strong>
                        <span>${submittedDate}</span>
                    </div>
                </div>
            </div>
            
            ${app.coverLetter ? `
                <div class="detail-section">
                    <h4>Cover Letter</h4>
                    <p>${app.coverLetter}</p>
                </div>
            ` : ''}
            
            ${app.skills ? `
                <div class="detail-section">
                    <h4>Skills</h4>
                    <p>${app.skills}</p>
                </div>
            ` : ''}
            
            <div class="detail-section">
                <h4>Actions</h4>
                <div class="application-actions">
                    <button class="btn btn-primary" onclick="window.open('mailto:${app.email}?subject=Re: ${app.jobTitle} Application')">
                        <i class="fas fa-envelope"></i> Email Applicant
                    </button>
                    ${app.resumeUrl ? `
                        <button class="btn btn-secondary">
                            <i class="fas fa-download"></i> Download Resume
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    closeModals() {
        [this.jobModal, this.applicationModal].forEach(modal => {
            if (modal) {
                modal.style.display = 'none';
            }
        });
        
        document.body.style.overflow = 'auto';
        this.currentEditingJob = null;
        this.clearMessages();
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove existing messages
        this.clearMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transition: all 0.3s ease;
            background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        `;
        
        document.body.appendChild(messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    clearMessages() {
        document.querySelectorAll('.message').forEach(msg => msg.remove());
    }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
});