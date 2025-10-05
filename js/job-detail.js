// Job Detail Page JavaScript
class JobDetailPage {
    constructor() {
        this.jobId = null;
        this.jobData = null;
        this.driveUploader = null;
        
        this.initializeElements();
        this.initializeGoogleDrive();
        this.setupEventListeners();
        this.loadJobFromURL();
    }

    initializeElements() {
        // Loading and error states
        this.loadingScreen = document.getElementById('loading-screen');
        this.jobNotFound = document.getElementById('job-not-found');
        this.jobDetailContent = document.getElementById('job-detail-content');
        
        // Job header elements
        this.jobTitle = document.getElementById('job-title');
        this.jobTitleHead = document.getElementById('job-title-head');
        this.breadcrumbJobTitle = document.getElementById('breadcrumb-job-title');
        this.jobDepartment = document.getElementById('job-department').querySelector('span');
        this.jobType = document.getElementById('job-type').querySelector('span');
        this.jobLocation = document.getElementById('job-location').querySelector('span');
        
        // Job content elements
        this.jobDescription = document.getElementById('job-description');
        this.jobRequirements = document.getElementById('job-requirements');
        this.jobBenefits = document.getElementById('job-benefits');
        this.jobBenefitsSection = document.getElementById('job-benefits-section');
        
        // Sidebar elements
        this.sidebarDepartment = document.getElementById('sidebar-department');
        this.sidebarType = document.getElementById('sidebar-type');
        this.sidebarLocation = document.getElementById('sidebar-location');
        this.sidebarSalary = document.getElementById('sidebar-salary');
        this.sidebarPosted = document.getElementById('sidebar-posted');
        this.sidebarDeadline = document.getElementById('sidebar-deadline');
        this.salaryInfo = document.getElementById('salary-info');
        this.deadlineInfo = document.getElementById('deadline-info');
        
        // Action buttons
        this.applyNowBtn = document.getElementById('apply-now-btn');
        this.shareJobBtn = document.getElementById('share-job-btn');
        this.sidebarApplyBtn = document.getElementById('sidebar-apply-btn');
        
        // Modal elements
        this.applicationModal = document.getElementById('application-modal');
        this.closeApplicationModal = document.getElementById('close-application-modal');
        this.applicationForm = document.getElementById('application-form');
        this.modalJobTitle = document.getElementById('modal-job-title');
        this.applicationJobId = document.getElementById('application-job-id');
        this.cancelApplication = document.getElementById('cancel-application');
        
        // Upload elements
        this.uploadResumeBtn = document.getElementById('upload-resume-btn');
        this.driveUploadStatus = document.getElementById('drive-upload-status');
        this.resumeDriveLink = document.getElementById('resume-drive-link');
        this.resumeFileName = document.getElementById('resume-file-name');
        
        // Message elements
        this.successMessage = document.getElementById('success-message');
        this.errorMessage = document.getElementById('error-message');
        this.errorText = document.getElementById('error-text');
        
        // Debug: Log missing elements
        this.debugMissingElements();
    }
    
    debugMissingElements() {
        const elements = {
            'application-modal': this.applicationModal,
            'application-form': this.applicationForm,
            'modal-job-title': this.modalJobTitle,
            'application-job-id': this.applicationJobId,
            'resume-drive-link': this.resumeDriveLink,
            'resume-file-name': this.resumeFileName,
            'drive-upload-status': this.driveUploadStatus
        };
        
        const missing = Object.entries(elements)
            .filter(([name, element]) => !element)
            .map(([name]) => name);
        
        if (missing.length > 0) {
            console.warn('Missing job detail form elements:', missing);
        }
    }

    async initializeGoogleDrive() {
        try {
            if (window.GoogleDriveUploader) {
                this.driveUploader = new GoogleDriveUploader();
            }
        } catch (error) {
            console.error('Error initializing Google Drive:', error);
        }
    }

    setupEventListeners() {
        // Apply button listeners
        this.applyNowBtn?.addEventListener('click', () => this.openApplicationModal());
        this.sidebarApplyBtn?.addEventListener('click', () => this.openApplicationModal());
        
        // Share button listener
        this.shareJobBtn?.addEventListener('click', () => this.shareJob());
        
        // Modal listeners
        this.closeApplicationModal?.addEventListener('click', () => this.closeModal());
        this.cancelApplication?.addEventListener('click', () => this.closeModal());
        
        // Form submission
        this.applicationForm?.addEventListener('submit', (e) => this.handleFormSubmission(e));
        
        // Google Drive link validation
        const resumeLinkInput = document.getElementById('resume-drive-link');
        resumeLinkInput?.addEventListener('input', (e) => this.validateGoogleDriveLink(e));
        resumeLinkInput?.addEventListener('blur', (e) => this.validateGoogleDriveLink(e));
        
        // Close modal on outside click
        this.applicationModal?.addEventListener('click', (e) => {
            if (e.target === this.applicationModal) {
                this.closeModal();
            }
        });
    }

    loadJobFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const rawJobId = urlParams.get('id');
        this.jobId = rawJobId ? decodeURIComponent(rawJobId) : null;
        
        console.log('🔍 Job detail page loaded with:', {
            rawJobId: rawJobId,
            decodedJobId: this.jobId,
            fullURL: window.location.href
        });
        
        if (!this.jobId) {
            console.warn('❌ No job ID found in URL');
            this.showJobNotFound();
            return;
        }
        
        this.loadJobDetails(this.jobId);
    }

    async loadJobDetails(jobId) {
        try {
            console.log('🔄 Loading job details for ID:', jobId);
            
            // Fetch job from Firebase using REST API
            const apiUrl = `https://firestore.googleapis.com/v1/projects/sriox-f5ae4/databases/(default)/documents/jobs/${jobId}`;
            console.log('📡 Making request to:', apiUrl);
            
            const response = await fetch(apiUrl);
            
            console.log('📈 Response status:', response.status);
            console.log('📊 Response ok:', response.ok);
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('❌ Job not found (404)');
                    this.showJobNotFound();
                    return;
                }
                const errorText = await response.text();
                console.error('❌ Firebase response error:', errorText);
                throw new Error(`Failed to fetch job: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('📦 Job data received:', data);
            
            // Transform Firebase document to job object
            const fields = data.fields;
            this.jobData = {
                id: jobId,
                title: fields.title?.stringValue || '',
                type: fields.type?.stringValue || '',
                department: fields.department?.stringValue || '',
                location: fields.location?.stringValue || '',
                description: fields.description?.stringValue || '',
                requirements: fields.requirements?.stringValue || '',
                status: fields.status?.stringValue || 'active',
                createdAt: fields.createdAt?.timestampValue || new Date().toISOString(),
                salary: fields.salary?.stringValue || '',
                benefits: fields.benefits?.stringValue || '',
                deadline: fields.deadline?.timestampValue || null
            };
            
            // Check if job is active
            if (this.jobData.status !== 'active') {
                this.showJobNotFound();
                return;
            }
            
            this.displayJobDetails();
            
        } catch (error) {
            console.error('❌ Error loading job details:', error);
            
            // Check if it's a network error vs job not found
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                this.showJobNotFound('Unable to load job details. Please check your internet connection and try again.');
            } else {
                this.showJobNotFound();
            }
        }
    }

    displayJobDetails() {
        console.log('✅ Displaying job details');
        
        // Hide loading and show content
        this.loadingScreen.style.display = 'none';
        this.jobDetailContent.style.display = 'block';
        
        // Update page title and breadcrumb
        this.jobTitleHead.textContent = `${this.jobData.title} - Sriox`;
        this.breadcrumbJobTitle.textContent = this.jobData.title;
        
        // Update job header
        this.jobTitle.textContent = this.jobData.title;
        this.jobDepartment.textContent = this.jobData.department;
        this.jobType.textContent = this.formatJobType(this.jobData.type);
        this.jobLocation.textContent = this.jobData.location;
        
        // Update job content
        this.jobDescription.innerHTML = this.formatDescription(this.jobData.description);
        this.jobRequirements.innerHTML = this.formatRequirements(this.jobData.requirements);
        
        // Update benefits - always show section with fallback content
        this.jobBenefits.innerHTML = this.formatBenefits(this.jobData.benefits);
        this.jobBenefitsSection.style.display = 'block';
        
        // Update sidebar
        this.sidebarDepartment.textContent = this.jobData.department;
        this.sidebarType.textContent = this.formatJobType(this.jobData.type);
        this.sidebarLocation.textContent = this.jobData.location;
        this.sidebarPosted.textContent = this.formatDate(this.jobData.createdAt);
        
        // Update salary if available
        if (this.jobData.salary && this.jobData.salary.trim()) {
            this.sidebarSalary.textContent = this.jobData.salary;
            this.salaryInfo.style.display = 'block';
        } else {
            this.salaryInfo.style.display = 'none';
        }
        
        // Update deadline if available
        if (this.jobData.deadline) {
            this.sidebarDeadline.textContent = this.formatDate(this.jobData.deadline);
            this.deadlineInfo.style.display = 'block';
        } else {
            this.deadlineInfo.style.display = 'none';
        }
        
        // Update modal title
        if (this.modalJobTitle) this.modalJobTitle.textContent = this.jobData.title;
        if (this.applicationJobId) this.applicationJobId.value = this.jobData.id;
    }

    showJobNotFound(customMessage = null) {
        this.loadingScreen.style.display = 'none';
        this.jobNotFound.style.display = 'block';
        this.jobDetailContent.style.display = 'none';
        
        if (customMessage) {
            const messageP = this.jobNotFound.querySelector('p');
            if (messageP) {
                messageP.textContent = customMessage;
            }
        }
    }

    formatJobType(type) {
        const typeMap = {
            'full-time': 'Full Time',
            'part-time': 'Part Time',
            'contract': 'Contract',
            'internship': 'Internship',
            'freelance': 'Freelance'
        };
        return typeMap[type] || type;
    }

    formatDescription(description) {
        if (!description || description.trim().length < 3) {
            return '<p class="placeholder-text">Job description will be updated soon. Please contact HR for more details.</p>';
        }
        
        const paragraphs = description.split('\n').map(paragraph => {
            const trimmed = paragraph.trim();
            return trimmed ? `<p>${trimmed}</p>` : '';
        }).filter(p => p).join('');
        
        return paragraphs || '<p class="placeholder-text">Job description will be updated soon.</p>';
    }

    formatRequirements(requirements) {
        if (!requirements || requirements.trim().length < 3) {
            return '<ul><li class="placeholder-text">Specific requirements will be discussed during the interview process</li><li class="placeholder-text">Relevant experience in the field preferred</li><li class="placeholder-text">Strong communication and problem-solving skills</li></ul>';
        }
        
        const items = requirements.split('\n').filter(req => req.trim());
        if (items.length === 0) {
            return '<ul><li class="placeholder-text">Requirements will be updated soon</li></ul>';
        }
        
        return `<ul>${items.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
    }

    formatBenefits(benefits) {
        if (!benefits || benefits.trim().length < 3) {
            return '<ul><li class="placeholder-text">Competitive salary package</li><li class="placeholder-text">Professional development opportunities</li><li class="placeholder-text">Flexible working arrangements</li><li class="placeholder-text">Health and wellness benefits</li></ul>';
        }
        
        const items = benefits.split('\n').filter(benefit => benefit.trim());
        if (items.length === 0) {
            return '<ul><li class="placeholder-text">Benefits package details will be provided during interview</li></ul>';
        }
        
        return `<ul>${items.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Recently';
        }
    }

    openApplicationModal() {
        if (!this.jobData) return;
        
        // Use Tally form instead of old modal
        if (typeof openApplicationForm === 'function') {
            openApplicationForm(this.jobData.title);
        } else {
            console.warn('Tally form function not available');
        }
    }

    closeModal() {
        this.applicationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form
        if (this.applicationForm) this.applicationForm.reset();
        if (this.driveUploadStatus) this.driveUploadStatus.innerHTML = '';
        if (this.resumeDriveLink) this.resumeDriveLink.value = '';
        if (this.resumeFileName) this.resumeFileName.value = '';
    }

    async shareJob() {
        const jobUrl = window.location.href;
        const shareText = `Check out this job opportunity: ${this.jobData.title} at Sriox`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${this.jobData.title} - Sriox`,
                    text: shareText,
                    url: jobUrl
                });
            } catch (error) {
                console.log('Share cancelled or failed:', error);
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(jobUrl);
                this.showMessage('Job URL copied to clipboard!', 'success');
            } catch (error) {
                console.error('Failed to copy URL:', error);
                this.showMessage('Failed to copy URL. Please copy manually.', 'error');
            }
        }
    }

    validateGoogleDriveLink(event) {
        const input = event.target;
        const value = input.value.trim();
        const statusDiv = document.getElementById('drive-link-status');
        
        if (!value) {
            statusDiv.innerHTML = '';
            statusDiv.className = 'upload-status';
            return;
        }
        
        // Check if it's a valid Google Drive link
        const driveRegex = /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view/;
        const driveOpenRegex = /^https:\/\/drive\.google\.com\/open\?id=[a-zA-Z0-9_-]+/;
        
        if (driveRegex.test(value) || driveOpenRegex.test(value)) {
            statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Valid Google Drive link';
            statusDiv.className = 'upload-status success';
        } else if (value.includes('drive.google.com')) {
            statusDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please make sure the link is shareable and in the correct format';
            statusDiv.className = 'upload-status error';
        } else {
            statusDiv.innerHTML = '<i class="fas fa-times-circle"></i> Please enter a valid Google Drive link';
            statusDiv.className = 'upload-status error';
        }
    }

    showUploadStatus(message, type) {
        this.driveUploadStatus.innerHTML = message;
        this.driveUploadStatus.className = `upload-status ${type}`;
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(this.applicationForm);
        
        // Show loading state
        const submitBtn = document.getElementById('submit-application');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        try {
            // Enhanced validation
            if (!formData.get('name')?.trim()) {
                throw new Error('Please enter your full name.');
            }
            
            if (!formData.get('email')?.trim()) {
                throw new Error('Please enter your email address.');
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.get('email'))) {
                throw new Error('Please enter a valid email address.');
            }
            
            if (!formData.get('coverLetter')?.trim()) {
                throw new Error('Please write a cover letter.');
            }
            
            // Check if resume is uploaded
            if (!this.resumeDriveLink || !this.resumeDriveLink.value) {
                throw new Error('Please upload your resume using Google Drive.');
            }
            
            // Check privacy consent
            if (!formData.get('privacyConsent')) {
                throw new Error('Please agree to the Privacy Policy to continue.');
            }
            // Prepare application data
            const applicationData = {
                jobId: this.jobData.id,
                jobTitle: this.jobData.title,
                applicantName: formData.get('name').trim(),
                email: formData.get('email').trim().toLowerCase(),
                phone: formData.get('phone')?.trim() || '',
                experience: formData.get('experience') || '',
                coverLetter: formData.get('coverLetter').trim(),
                resumeLink: this.resumeDriveLink?.value || '',
                resumeFileName: this.resumeFileName?.value || '',
                appliedAt: new Date().toISOString(),
                status: 'pending'
            };
            
            console.log('📋 Submitting application:', applicationData);
            
            // Submit to Firebase
            const response = await fetch('https://firestore.googleapis.com/v1/projects/sriox-f5ae4/databases/(default)/documents/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        jobId: { stringValue: applicationData.jobId },
                        jobTitle: { stringValue: applicationData.jobTitle },
                        applicantName: { stringValue: applicationData.applicantName },
                        email: { stringValue: applicationData.email },
                        phone: { stringValue: applicationData.phone || '' },
                        experience: { stringValue: applicationData.experience || '' },
                        coverLetter: { stringValue: applicationData.coverLetter },
                        resumeLink: { stringValue: applicationData.resumeLink },
                        resumeFileName: { stringValue: applicationData.resumeFileName },
                        appliedAt: { timestampValue: applicationData.appliedAt },
                        status: { stringValue: applicationData.status }
                    }
                })
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Firebase error response:', errorData);
                throw new Error(`Application submission failed. Please try again. (Error: ${response.status})`);
            }
            
            const result = await response.json();
            console.log('✅ Application submitted successfully:', result);
            
            this.closeModal();
            this.showMessage(
                `Thank you ${applicationData.applicantName}! Your application for ${applicationData.jobTitle} has been submitted successfully. We'll review your application and get back to you soon.`, 
                'success'
            );
            
        } catch (error) {
            console.error('❌ Error submitting application:', error);
            this.showMessage(error.message || 'Failed to submit application. Please try again.', 'error');
        } finally {
            // Reset submit button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showMessage(message, type) {
        const messageEl = type === 'success' ? this.successMessage : this.errorMessage;
        
        if (type === 'error') {
            this.errorText.textContent = message;
        } else {
            messageEl.querySelector('p').textContent = message;
        }
        
        messageEl.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
        
        // Hide on click
        messageEl.addEventListener('click', () => {
            messageEl.style.display = 'none';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JobDetailPage();
});