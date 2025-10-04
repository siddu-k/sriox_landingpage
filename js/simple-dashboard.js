// Simple Dashboard JavaScript - Fixed Version
import { JobManager } from './firebase-config.js';

class SimpleDashboard {
    constructor() {
        this.jobs = [];
        this.applications = [];
        this.jobManager = new JobManager();
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Simple Dashboard...');
        
        // Get DOM elements
        this.jobForm = document.getElementById('job-form');
        this.jobsList = document.getElementById('jobs-list');
        this.successMessage = document.getElementById('success-message');
        
        // Stats elements
        this.totalJobsCounter = document.getElementById('total-jobs');
        this.activeJobsCounter = document.getElementById('active-jobs');
        this.totalApplicationsCounter = document.getElementById('total-applications');
        this.pendingApplicationsCounter = document.getElementById('pending-applications');
        
        // Check if elements exist
        console.log('Form found:', !!this.jobForm);
        console.log('Jobs list found:', !!this.jobsList);
        
        // Add event listeners
        if (this.jobForm) {
            this.jobForm.addEventListener('submit', (e) => {
                console.log('📝 Form submit event triggered');
                e.preventDefault();
                e.stopPropagation();
                this.addJob(e);
                return false; // Extra prevention
            });
            console.log('✅ Form event listener added');
        }
        
        // Load initial data
        await this.loadJobs();
    }

    async addJob(e) {
        console.log('🎯 addJob method called');
        console.log('🔍 JobManager instance:', this.jobManager);
        
        try {
            // Get form data
            const formData = new FormData(this.jobForm);
            const jobData = {
                title: formData.get('title') || '',
                department: formData.get('department') || '',
                location: formData.get('location') || '',
                type: formData.get('type') || '',
                description: formData.get('description') || '',
                requirements: formData.get('requirements') || '',
                isActive: true
            };

            console.log('📋 Form data collected:', jobData);

            // Basic validation
            if (!jobData.title.trim()) {
                alert('Please enter a job title');
                return;
            }
            if (!jobData.department) {
                alert('Please select a department');
                return;
            }

            console.log('🔄 Adding job to Firebase...');
            console.log('🔍 JobManager methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.jobManager)));
            
            // Add to Firebase
            const jobId = await this.jobManager.addJob(jobData);
            console.log('✅ Job added successfully with ID:', jobId);
            
            // Show success message
            this.showSuccess('Job added successfully!');
            
            // Clear form
            this.jobForm.reset();
            
            // Reload jobs
            setTimeout(() => {
                this.loadJobs();
            }, 500);
            
        } catch (error) {
            console.error('❌ Error in addJob:');
            console.error('Error message:', error.message);
            console.error('Error code:', error.code);
            console.error('Error stack:', error.stack);
            console.error('Full error object:', error);
            
            // Try to add locally as fallback
            console.log('🔄 Adding to local array as fallback...');
            const fallbackJob = {
                id: Date.now().toString(),
                title: formData.get('title'),
                department: formData.get('department'),
                location: formData.get('location'),
                type: formData.get('type'),
                description: formData.get('description'),
                requirements: formData.get('requirements'),
                isActive: true,
                createdAt: new Date().toISOString()
            };
            
            this.jobs.unshift(fallbackJob);
            this.renderJobs();
            this.updateStats();
            this.showSuccess('Job added locally (Firebase error)');
            this.jobForm.reset();
            
            alert('Job added locally. Firebase error: ' + error.message);
        }
    }

    async loadJobs() {
        console.log('📋 Loading jobs...');
        
        try {
            this.jobs = await this.jobManager.getAllJobs();
            console.log('✅ Loaded jobs:', this.jobs.length);
            
            this.renderJobs();
            this.updateStats();
            
        } catch (error) {
            console.error('❌ Error loading jobs:', error);
            
            // Use mock data
            this.jobs = [
                {
                    id: '1',
                    title: 'Sample Job',
                    department: 'engineering',
                    location: 'Remote',
                    type: 'full-time',
                    description: 'Sample job description',
                    requirements: 'Sample requirements',
                    isActive: true,
                    createdAt: new Date().toISOString()
                }
            ];
            
            this.renderJobs();
            this.updateStats();
        }
    }

    renderJobs() {
        if (!this.jobsList) return;
        
        if (this.jobs.length === 0) {
            this.jobsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #718096;">
                    <p>No jobs posted yet</p>
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
                <p><i class="fas fa-calendar"></i> ${this.formatDate(job.createdAt)}</p>
            </div>
        `).join('');
    }

    updateStats() {
        const activeJobs = this.jobs.filter(job => job.isActive !== false);
        
        if (this.totalJobsCounter) this.totalJobsCounter.textContent = this.jobs.length;
        if (this.activeJobsCounter) this.activeJobsCounter.textContent = activeJobs.length;
        if (this.totalApplicationsCounter) this.totalApplicationsCounter.textContent = '0';
        if (this.pendingApplicationsCounter) this.pendingApplicationsCounter.textContent = '0';
    }

    showSuccess(message) {
        if (this.successMessage) {
            this.successMessage.style.display = 'block';
            setTimeout(() => {
                this.successMessage.style.display = 'none';
            }, 3000);
        }
        console.log('✅ ' + message);
    }

    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch {
            return 'Invalid Date';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, initializing dashboard...');
    window.dashboard = new SimpleDashboard();
});

export default SimpleDashboard;