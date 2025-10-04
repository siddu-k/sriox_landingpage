// Dashboard JavaScript - Simple Careers Management
import { JobManager } from './firebase-config.js';

class Dashboard {
    constructor() {
        this.jobs = [];
        this.applications = [];
        this.jobManager = new JobManager();
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadData();
    }

    initializeElements() {
        // Form elements
        this.jobForm = document.getElementById('job-form');
        this.successMessage = document.getElementById('success-message');
        
        // Stats elements
        this.totalJobsCounter = document.getElementById('total-jobs');
        this.activeJobsCounter = document.getElementById('active-jobs');
        this.totalApplicationsCounter = document.getElementById('total-applications');
        this.pendingApplicationsCounter = document.getElementById('pending-applications');
        
        // Content areas
        this.jobsList = document.getElementById('jobs-list');
        this.applicationsList = document.getElementById('applications-list');
        
        // Buttons
        this.refreshJobsBtn = document.getElementById('refresh-jobs');
        this.refreshApplicationsBtn = document.getElementById('refresh-applications');
    }

    setupEventListeners() {
        // Prevent form from reloading the page
        this.jobForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('📝 Form submission intercepted - preventing page reload');
            this.handleJobSubmit(e);
        });
        
        this.refreshJobsBtn?.addEventListener('click', () => this.loadJobs());
        this.refreshApplicationsBtn?.addEventListener('click', () => this.loadApplications());
    }

    async loadData() {
        console.log('🔄 Loading dashboard data...');
        await this.loadJobs();
        await this.loadApplications();
        this.updateStats();
    }

    async loadJobs() {
        try {
            console.log('📋 Loading jobs...');
            console.log('JobManager instance:', this.jobManager);
            
            this.jobs = await this.jobManager.getAllJobs();
            console.log('✅ Loaded jobs from Firebase:', this.jobs.length);
            console.log('Jobs data:', this.jobs);
        } catch (error) {
            console.error('❌ Error loading jobs from Firebase:', error);
            console.log('🔄 Falling back to mock data...');
            // Use mock data as fallback
            this.jobs = this.getMockJobs();
            console.log('⚠️ Using mock jobs data:', this.jobs.length);
        }
        
        this.renderJobs();
        this.updateStats();
    }

    async loadApplications() {
        try {
            console.log('📄 Loading applications...');
            this.applications = await this.jobManager.getAllApplications();
            console.log('✅ Loaded applications:', this.applications.length);
        } catch (error) {
            console.error('❌ Error loading applications:', error);
            // Use mock data as fallback
            this.applications = this.getMockApplications();
            console.log('⚠️ Using mock applications data');
        }
        
        this.renderApplications();
        this.updateStats();
    }

    async handleJobSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.jobForm);
        const jobData = {
            title: formData.get('title'),
            department: formData.get('department'),
            location: formData.get('location'),
            type: formData.get('type'),
            description: formData.get('description'),
            requirements: formData.get('requirements'),
            isActive: true,
            createdAt: new Date().toISOString(),
            id: Date.now().toString() // Simple ID generation
        };

        console.log('📝 Submitting job data:', jobData);

        try {
            console.log('� Attempting to add job to Firebase...');
            await this.jobManager.addJob(jobData);
            
            console.log('✅ Job added to Firebase successfully');
            this.showSuccessMessage();
            this.jobForm.reset();
            await this.loadJobs();
            
        } catch (error) {
            console.error('❌ Error adding job to Firebase:', error);
            console.log('🔄 Adding to local array as fallback...');
            
            // Fallback: add to local array
            this.jobs.unshift(jobData);
            this.renderJobs();
            this.updateStats();
            this.showSuccessMessage();
            this.jobForm.reset();
            
            console.log('⚠️ Job added to local storage only');
        }
    }

    showSuccessMessage() {
        this.successMessage.style.display = 'block';
        setTimeout(() => {
            this.successMessage.style.display = 'none';
        }, 3000);
    }

    updateStats() {
        const activeJobs = this.jobs.filter(job => job.isActive !== false);
        const pendingApps = this.applications.filter(app => app.status === 'pending');
        
        this.totalJobsCounter.textContent = this.jobs.length;
        this.activeJobsCounter.textContent = activeJobs.length;
        this.totalApplicationsCounter.textContent = this.applications.length;
        this.pendingApplicationsCounter.textContent = pendingApps.length;
    }

    renderJobs() {
        if (this.jobs.length === 0) {
            this.jobsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #718096;">
                    <i class="fas fa-briefcase" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>No jobs posted yet</p>
                    <p style="font-size: 0.9rem;">Add your first job posting using the form on the left</p>
                </div>
            `;
            return;
        }

        this.jobsList.innerHTML = this.jobs.map(job => `
            <div class="job-item">
                <h4>${job.title}</h4>
                <p><i class="fas fa-building"></i> ${job.department}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                <p><i class="fas fa-clock"></i> ${job.type}</p>
                <p><i class="fas fa-calendar"></i> Posted: ${this.formatDate(job.createdAt)}</p>
                <div class="job-actions">
                    <button class="btn btn-small" onclick="dashboard.editJob('${job.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-small btn-secondary" onclick="dashboard.toggleJobStatus('${job.id}')">
                        <i class="fas fa-${job.isActive ? 'pause' : 'play'}"></i> 
                        ${job.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-small" onclick="dashboard.deleteJob('${job.id}')" style="background: #e53e3e;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderApplications() {
        if (this.applications.length === 0) {
            this.applicationsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #718096;">
                    <i class="fas fa-file-alt" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>No applications received yet</p>
                    <p style="font-size: 0.9rem;">Applications will appear here once people apply</p>
                </div>
            `;
            return;
        }

        this.applicationsList.innerHTML = this.applications.slice(0, 10).map(app => `
            <div class="application-item">
                <h4>${app.name}</h4>
                <p><i class="fas fa-envelope"></i> ${app.email}</p>
                <p><i class="fas fa-briefcase"></i> Applied for: ${app.jobTitle}</p>
                <p><i class="fas fa-calendar"></i> Applied: ${this.formatDate(app.appliedAt)}</p>
                <p>
                    <span class="status-badge status-${app.status}">
                        ${app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}
                    </span>
                </p>
                <div class="job-actions">
                    <button class="btn btn-small" onclick="dashboard.viewApplication('${app.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-small btn-secondary" onclick="dashboard.updateApplicationStatus('${app.id}', 'reviewed')">
                        <i class="fas fa-check"></i> Mark Reviewed
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Job management methods
    async editJob(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (job) {
            // Simple edit: just fill the form with current data
            document.getElementById('job-title').value = job.title;
            document.getElementById('job-department').value = job.department;
            document.getElementById('job-location').value = job.location;
            document.getElementById('job-type').value = job.type;
            document.getElementById('job-description').value = job.description;
            document.getElementById('job-requirements').value = job.requirements;
            
            // Scroll to form
            document.querySelector('.section').scrollIntoView({ behavior: 'smooth' });
        }
    }

    async toggleJobStatus(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (job) {
            job.isActive = !job.isActive;
            
            try {
                await this.jobManager.updateJob(jobId, { isActive: job.isActive });
                console.log('✅ Job status updated');
            } catch (error) {
                console.error('❌ Error updating job status:', error);
                console.log('⚠️ Status updated locally only');
            }
            
            this.renderJobs();
            this.updateStats();
        }
    }

    async deleteJob(jobId) {
        if (confirm('Are you sure you want to delete this job posting?')) {
            try {
                await this.jobManager.deleteJob(jobId);
                console.log('✅ Job deleted');
            } catch (error) {
                console.error('❌ Error deleting job:', error);
                console.log('⚠️ Job removed locally only');
            }
            
            this.jobs = this.jobs.filter(j => j.id !== jobId);
            this.renderJobs();
            this.updateStats();
        }
    }

    // Application management methods
    viewApplication(appId) {
        const app = this.applications.find(a => a.id === appId);
        if (app) {
            alert(`Application Details:\n\nName: ${app.name}\nEmail: ${app.email}\nJob: ${app.jobTitle}\nStatus: ${app.status}\n\nResume: ${app.resumeUrl || 'No resume uploaded'}`);
        }
    }

    async updateApplicationStatus(appId, status) {
        const app = this.applications.find(a => a.id === appId);
        if (app) {
            app.status = status;
            
            try {
                await this.jobManager.updateApplication(appId, { status });
                console.log('✅ Application status updated');
            } catch (error) {
                console.error('❌ Error updating application status:', error);
                console.log('⚠️ Status updated locally only');
            }
            
            this.renderApplications();
            this.updateStats();
        }
    }

    // Mock data for fallback
    getMockJobs() {
        return [
            {
                id: '1',
                title: 'Senior Software Engineer',
                department: 'engineering',
                location: 'Remote',
                type: 'full-time',
                description: 'We are looking for a Senior Software Engineer to join our growing team.',
                requirements: 'Bachelor\'s degree in Computer Science, 5+ years experience',
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Marketing Manager',
                department: 'marketing',
                location: 'New York, NY',
                type: 'full-time',
                description: 'Lead our marketing initiatives and drive brand growth.',
                requirements: 'Marketing degree, 3+ years experience, strong communication skills',
                isActive: true,
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    }

    getMockApplications() {
        return [
            {
                id: '1',
                name: 'John Doe',
                email: 'john.doe@email.com',
                jobTitle: 'Senior Software Engineer',
                status: 'pending',
                appliedAt: new Date().toISOString(),
                resumeUrl: 'path/to/resume.pdf'
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane.smith@email.com',
                jobTitle: 'Marketing Manager',
                status: 'reviewed',
                appliedAt: new Date(Date.now() - 43200000).toISOString(),
                resumeUrl: 'path/to/resume2.pdf'
            }
        ];
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

export default Dashboard;