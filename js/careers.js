// Careers Page JavaScript - Dynamic Job Loading and Application Form
// Using Firebase REST API for reliable job loading

class CareersPage {
    constructor() {
        this.jobs = [];
        this.filteredJobs = [];
        this.currentFilters = {
            department: '',
            type: '',
            experience: ''
        };
        
        // Initialize Google Drive uploader
        this.driveUploader = null;
        this.initializeGoogleDrive();
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadJobs();
    }

    async initializeGoogleDrive() {
        try {
            // Load Google Drive uploader
            await this.loadGoogleDriveScript();
            this.driveUploader = new GoogleDriveUploader();
        } catch (error) {
            console.error('Error initializing Google Drive:', error);
        }
    }

    loadGoogleDriveScript() {
        return new Promise((resolve, reject) => {
            if (window.GoogleDriveUploader) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'js/google-drive-uploader.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    initializeElements() {
        // Filter elements
        this.departmentFilter = document.getElementById('department-filter');
        this.typeFilter = document.getElementById('type-filter');
        this.experienceFilter = document.getElementById('experience-filter');
        
        // Content elements
        this.jobsLoading = document.getElementById('jobs-loading');
        this.noJobsState = document.getElementById('no-jobs');
        this.careersPositions = document.getElementById('careers-positions');
        
        // Modal elements
        this.applicationModal = document.getElementById('application-modal');
        this.applicationForm = document.getElementById('application-form');
        this.modalTitle = document.getElementById('application-modal-title');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        this.cancelBtns = document.querySelectorAll('.cancel-btn');
        
        // Form elements
        this.jobIdInput = document.getElementById('job-id');
        this.jobTitleInput = document.getElementById('job-title-hidden');
        this.submitBtn = document.getElementById('submit-application');
        this.submitText = this.submitBtn?.querySelector('.submit-text');
        this.submitLoading = this.submitBtn?.querySelector('.submit-loading');
        
        // Debug: Log missing elements
        this.debugMissingElements();
    }
    
    debugMissingElements() {
        const elements = {
            'application-modal': this.applicationModal,
            'application-form': this.applicationForm,
            'application-modal-title': this.modalTitle,
            'job-id': this.jobIdInput,
            'job-title-hidden': this.jobTitleInput,
            'submit-application': this.submitBtn,
            'submit-text': this.submitText,
            'submit-loading': this.submitLoading
        };
        
        const missing = Object.entries(elements)
            .filter(([name, element]) => !element)
            .map(([name]) => name);
        
        if (missing.length > 0) {
            console.warn('Missing form elements:', missing);
        }
    }

    setupEventListeners() {
        // Filter event listeners
        this.departmentFilter?.addEventListener('change', () => this.applyFilters());
        this.typeFilter?.addEventListener('change', () => this.applyFilters());
        this.experienceFilter?.addEventListener('change', () => this.applyFilters());
        
        // Modal event listeners
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeApplicationModal());
        });
        
        this.cancelBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeApplicationModal());
        });
        
        // Click outside modal to close
        this.applicationModal?.addEventListener('click', (e) => {
            if (e.target === this.applicationModal) {
                this.closeApplicationModal();
            }
        });
        
        // Form submission
        this.applicationForm?.addEventListener('submit', (e) => this.handleApplicationSubmit(e));
        
        // Google Drive link validation
        const resumeLinkInput = document.getElementById('resume-drive-link');
        resumeLinkInput?.addEventListener('input', (e) => this.validateGoogleDriveLink(e));
        resumeLinkInput?.addEventListener('blur', (e) => this.validateGoogleDriveLink(e));
    }

    async loadJobs() {
        try {
            this.showLoading();
            
            // In a real implementation, you would load from Firebase
            // For now, we'll use the existing jobs and simulate Firebase structure
            this.jobs = await this.getJobsFromFirebase();
            
            this.filteredJobs = [...this.jobs];
            this.displayJobs();
            
        } catch (error) {
            console.error('Error loading jobs:', error);
            this.showError('Failed to load job openings. Please try again later.');
        }
    }

    async getJobsFromFirebase() {
        try {
            console.log('🔄 Loading jobs from Firebase...');
            
            // Use REST API to fetch jobs from Firebase (same approach as working dashboard)
            const apiUrl = 'https://firestore.googleapis.com/v1/projects/sriox-f5ae4/databases/(default)/documents/jobs';
            console.log('📡 Making request to:', apiUrl);
            
            const response = await fetch(apiUrl);
            
            console.log('📈 Response status:', response.status);
            console.log('📊 Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Firebase response error:', errorText);
                throw new Error(`Firebase request failed: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('📦 Raw Firebase response:', data);
            
            if (!data.documents) {
                console.log('📝 No jobs found in Firebase - showing empty state');
                return [];
            }
            
            // Transform Firebase documents to job objects
            const jobs = data.documents.map(doc => {
                const fields = doc.fields;
                const pathParts = doc.name.split('/');
                const id = pathParts[pathParts.length - 1];
                
                console.log('🔧 Processing document:', {
                    fullPath: doc.name,
                    extractedId: id,
                    pathParts: pathParts
                });
                
                const job = {
                    id: id,
                    title: fields.title?.stringValue || '',
                    type: fields.type?.stringValue || '',
                    department: fields.department?.stringValue || '',
                    location: fields.location?.stringValue || '',
                    description: fields.description?.stringValue || '',
                    requirements: fields.requirements?.stringValue || '',
                    status: fields.status?.stringValue || 'active',
                    createdAt: fields.createdAt?.timestampValue || new Date().toISOString(),
                    salary: fields.salary?.stringValue || 'Competitive',
                    benefits: fields.benefits?.stringValue || '',
                    deadline: fields.deadline?.timestampValue || null
                };
                
                console.log('🔧 Transformed job:', job);
                return job;
            });
            
            // Filter only active jobs for public careers page
            const activeJobs = jobs.filter(job => job.status === 'active');
            console.log(`✅ Loaded ${activeJobs.length} active jobs from Firebase (${jobs.length} total)`);
            
            return activeJobs;
            
        } catch (error) {
            console.error('❌ Error fetching jobs from Firebase:', error);
            console.error('❌ Full error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            // Return empty array instead of mock data on error
            return [];
        }
    }

    applyFilters() {
        this.currentFilters.department = this.departmentFilter?.value || '';
        this.currentFilters.type = this.typeFilter?.value || '';
        this.currentFilters.experience = this.experienceFilter?.value || '';

        this.filteredJobs = this.jobs.filter(job => {
            const matchesDepartment = !this.currentFilters.department || 
                                    job.department === this.currentFilters.department;
            const matchesType = !this.currentFilters.type || 
                              job.type === this.currentFilters.type;
            const matchesExperience = !this.currentFilters.experience || 
                                    job.experience === this.currentFilters.experience;

            return matchesDepartment && matchesType && matchesExperience;
        });

        this.displayJobs();
    }

    displayJobs() {
        this.hideLoading();

        if (this.filteredJobs.length === 0) {
            this.showNoJobs();
            return;
        }

        this.hideNoJobs();
        this.careersPositions.innerHTML = this.filteredJobs.map(job => this.createJobCard(job)).join('');
        
        // Add event listeners to quick apply buttons
        this.careersPositions.querySelectorAll('.quick-apply').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const jobTitle = e.target.closest('.position-card').querySelector('h4').textContent;
                // Use the Tally form function that's already in apply.html
                if (typeof openApplicationForm === 'function') {
                    openApplicationForm(jobTitle);
                } else {
                    console.warn('Tally form function not available');
                }
            });
        });
        
        // Add hover effects to job cards
        this.careersPositions.querySelectorAll('.clickable-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    createJobCard(job) {
        const deadline = job.deadline ? new Date(job.deadline).toLocaleDateString() : null;

        return `
            <div class="position-card clickable-card" data-job-id="${job.id}" onclick="this.querySelector('.view-details-btn').click()">
                <div class="position-header">
                    <div class="position-title">
                        <h4>${job.title}</h4>
                        <div class="position-meta">
                            <span class="position-type">
                                <i class="fas fa-clock"></i> ${this.formatJobType(job.type)}
                            </span>
                            <span class="position-department">
                                <i class="fas fa-building"></i> ${job.department}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="position-content">
                    <p class="position-description">${this.truncateText(job.description, 150)}</p>
                </div>
                
                <div class="position-footer">
                    <div class="position-actions">
                        <button class="view-details-btn" data-job-id="${job.id}" onclick="event.stopPropagation(); console.log('Navigating to job detail with ID:', '${job.id}'); window.location.href='job-detail.html?id=${encodeURIComponent(job.id)}'">
                            <i class="fas fa-eye"></i>
                            View Details
                        </button>
                        <button class="apply-btn quick-apply" data-job-id="${job.id}" data-job-title="${job.title}" onclick="event.stopPropagation();">
                            <i class="fas fa-paper-plane"></i>
                            Quick Apply
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    makeFriendlyRequirement(text, maxLength) {
        // Make requirements sound more friendly and welcoming
        let friendlyText = text;
        
        // Replace harsh requirement language with friendlier alternatives
        const friendlyReplacements = {
            'Must have': 'Experience with',
            'Required:': 'We\'d love if you have',
            'Minimum': 'Some',
            'At least': 'Around',
            'Strong knowledge': 'Good understanding',
            'Expert level': 'Solid experience',
            'Proficiency in': 'Familiarity with',
            'years of experience': 'years working with',
            'Bachelor\'s degree': 'degree or equivalent experience',
            'Master\'s degree': 'advanced degree or similar background'
        };
        
        // Apply friendly replacements
        Object.keys(friendlyReplacements).forEach(harsh => {
            const friendlyRegex = new RegExp(harsh, 'gi');
            friendlyText = friendlyText.replace(friendlyRegex, friendlyReplacements[harsh]);
        });
        
        // Truncate if needed
        if (friendlyText.length <= maxLength) return friendlyText;
        return friendlyText.substring(0, maxLength).trim() + '...';
    }

    formatJobType(type) {
        const types = {
            'full-time': 'Full-time',
            'part-time': 'Part-time',
            'contract': 'Contract',
            'internship': 'Internship'
        };
        return types[type] || type;
    }

    timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        return `${Math.floor(diffInDays / 30)} months ago`;
    }

    openApplicationModal(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (!job) return;

        if (this.jobIdInput) this.jobIdInput.value = jobId;
        if (this.jobTitleInput) this.jobTitleInput.value = job.title;
        if (this.modalTitle) this.modalTitle.textContent = `Apply for ${job.title}`;
        
        if (this.applicationModal) {
            this.applicationModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        
        // Reset form
        if (this.applicationForm) {
            this.applicationForm.reset();
            if (this.jobIdInput) this.jobIdInput.value = jobId;
            if (this.jobTitleInput) this.jobTitleInput.value = job.title;
        }
    }

    closeApplicationModal() {
        if (this.applicationModal) {
            this.applicationModal.style.display = 'none';
        }
        document.body.style.overflow = 'auto';
        
        // Reset form and error states
        if (this.applicationForm) {
            this.applicationForm.reset();
        }
        this.resetSubmitButton();
        this.clearMessages();
    }

    async handleApplicationSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = new FormData(this.applicationForm);
        await this.handleFormSubmission(formData);
    }

    prepareApplicationData(formData) {
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (key !== 'resume') {
                data[key] = value;
            }
        }
        
        // Add metadata
        data.submittedAt = new Date().toISOString();
        data.status = 'pending';
        data.source = 'career-page';
        
        // Handle resume - check if Google Drive link exists
        const driveLink = formData.get('resumeDriveLink');
        const driveFileName = formData.get('resumeFileName');
        
        if (driveLink && driveFileName) {
            // Google Drive upload
            data.resumeType = 'google-drive';
            data.resumeUrl = driveLink;
            data.resumeFileName = driveFileName;
            data.resumeSource = 'Google Drive (User\'s personal drive)';
        } else {
            // Traditional file upload
            const resumeFile = formData.get('resume');
            if (resumeFile && resumeFile.size > 0) {
                data.resumeType = 'traditional-upload';
                data.resumeFileName = resumeFile.name;
                data.resumeSize = resumeFile.size;
                data.resumeSource = 'Direct upload to server';
                // In production, upload file to Firebase Storage and store URL
                data.resumeUrl = 'pending-upload';
            }
        }
        
        return data;
    }

    async submitApplication(applicationData) {
        try {
            // This would normally call: return await jobManager.submitApplication(applicationData);
            // For demo purposes, simulating Firebase submission
            console.log('Submitting application:', applicationData);
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Return mock application ID
            return 'app_' + Date.now();
            
        } catch (error) {
            console.error('Error in submitApplication:', error);
            throw error;
        }
    }

    validateForm() {
        if (!this.applicationForm) {
            console.error('Application form not found');
            return false;
        }
        
        const requiredFields = [
            'name', 'email', 'phone', 'location', 'experience', 
            'noticePeriod', 'skills', 'coverLetter'
        ];
        
        let isValid = true;
        
        requiredFields.forEach(fieldName => {
            const field = this.applicationForm.querySelector(`[name="${fieldName}"]`);
            if (field && !field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field) {
                this.clearFieldError(field);
            }
        });
        
        // Validate email
        const emailField = this.applicationForm.querySelector('[name="email"]');
        if (emailField && emailField.value && !this.isValidEmail(emailField.value)) {
            this.showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate phone
        const phoneField = this.applicationForm.querySelector('[name="phone"]');
        if (phoneField && phoneField.value && !this.isValidPhone(phoneField.value)) {
            this.showFieldError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Validate resume upload (either Google Drive or traditional)
        const driveLinkField = this.applicationForm.querySelector('[name="resumeDriveLink"]');
        const traditionalFileField = this.applicationForm.querySelector('[name="resume"]');
        
        const driveLink = driveLinkField ? driveLinkField.value : '';
        const traditionalFile = traditionalFileField ? traditionalFileField.files[0] : null;
        
        if (!driveLink && !traditionalFile) {
            this.showErrorMessage('Please upload your resume using Google Drive or traditional upload');
            isValid = false;
        }
        
        // Validate privacy consent
        const consentField = this.applicationForm.querySelector('[name="privacyConsent"]');
        if (consentField && !consentField.checked) {
            this.showErrorMessage('Please accept the privacy policy to continue');
            isValid = false;
        }
        
        return isValid;
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

    displayUploadSuccess(result) {
        const uploadContainer = document.querySelector('.resume-upload-container');
        const driveLink = result.shareableLink || result.webViewLink;
        const demoIndicator = result.isDemo ? ' (Demo Mode)' : '';
        
        // Create success display
        const successDiv = document.createElement('div');
        successDiv.className = 'upload-success';
        successDiv.innerHTML = `
            <div class="upload-success-content">
                <i class="fas fa-check-circle"></i>
                <div class="upload-info">
                    <h4>Resume Uploaded Successfully!${demoIndicator}</h4>
                    <p><strong>File:</strong> ${result.fileName}</p>
                    <p><strong>Google Drive Link:</strong> 
                        <a href="${driveLink}" target="_blank" class="drive-link">
                            View in Google Drive <i class="fas fa-external-link-alt"></i>
                        </a>
                    </p>
                    ${result.isDemo ? '<p class="demo-note"><em>This is a demo simulation. In production, this would link to your actual Google Drive file.</em></p>' : ''}
                </div>
                <button type="button" class="btn btn-small btn-secondary" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i> Remove
                </button>
            </div>
        `;
        
        // Replace upload section with success display
        const existingSuccess = uploadContainer.querySelector('.upload-success');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        uploadContainer.appendChild(successDiv);
        
        // Hide traditional file upload
        const traditionalUpload = document.querySelector('.traditional-upload');
        if (traditionalUpload) {
            traditionalUpload.style.display = 'none';
        }
    }

    getUploadErrorMessage(errorMessage) {
        const errorMessages = {
            'User not signed in to Google': 'Please sign in to Google Drive to upload your resume.',
            'User cancelled file selection': 'File upload was cancelled.',
            'File size must be less than 10MB': 'Resume file must be smaller than 10MB.',
            'Only PDF, DOC, and DOCX files are allowed': 'Please upload a PDF, DOC, or DOCX file.',
            'Google API not initialized': 'Google Drive service is not available. Please try the traditional upload option.'
        };
        
        return errorMessages[errorMessage] || 'Failed to upload resume. Please try again or use the traditional upload option.';
    }

    validateFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (file.size > maxSize) {
            this.showFieldError(e.target, 'File size must be less than 5MB');
            e.target.value = '';
            return false;
        }
        
        if (!allowedTypes.includes(file.type)) {
            this.showFieldError(e.target, 'Only PDF, DOC, and DOCX files are allowed');
            e.target.value = '';
            return false;
        }
        
        this.clearFieldError(e.target);
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#ef4444';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        if (field) {
            field.style.borderColor = '#444';
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    }

    setSubmitLoading(loading) {
        if (!this.submitBtn) {
            console.warn('Submit button not found');
            return;
        }
        
        this.submitBtn.disabled = loading;
        
        if (this.submitText && this.submitLoading) {
            // Use the structured button with separate text and loading elements
            if (loading) {
                this.submitText.style.display = 'none';
                this.submitLoading.style.display = 'inline-flex';
            } else {
                this.submitText.style.display = 'inline';
                this.submitLoading.style.display = 'none';
            }
        } else {
            // Fallback: use simple text content change
            if (loading) {
                this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            } else {
                this.submitBtn.innerHTML = 'Submit Application';
            }
        }
    }

    resetSubmitButton() {
        if (this.submitBtn) {
            this.setSubmitLoading(false);
        }
    }

    showSuccessMessage(message) {
        this.clearMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        this.applicationForm.prepend(successDiv);
    }

    showErrorMessage(message) {
        this.clearMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        this.applicationForm.prepend(errorDiv);
    }

    clearMessages() {
        const messages = this.applicationForm.querySelectorAll('.success-message, .error-message');
        messages.forEach(msg => msg.remove());
    }

    showLoading() {
        this.jobsLoading.style.display = 'block';
        this.careersPositions.style.display = 'none';
        this.noJobsState.style.display = 'none';
    }

    hideLoading() {
        this.jobsLoading.style.display = 'none';
        this.careersPositions.style.display = 'block';
    }

    showNoJobs() {
        this.careersPositions.style.display = 'none';
        this.noJobsState.style.display = 'block';
    }

    hideNoJobs() {
        this.noJobsState.style.display = 'none';
    }

    showError(message) {
        this.hideLoading();
        this.careersPositions.innerHTML = `
            <div class="error-state">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Failed to load job openings</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh"></i> Try Again
                </button>
            </div>
        `;
    }

    async handleFormSubmission(formData) {
        try {
            const submitButton = document.getElementById('submit-application');
            if (!submitButton) {
                console.error('Submit button not found!');
                return;
            }
            
            const originalText = submitButton.textContent;
            
            // Show loading state using the safer method
            this.setSubmitLoading(true);
            
            // Check which upload method was used
            const driveLink = formData.get('resumeDriveLink');
            const traditionalFile = formData.get('resume');
            
            let applicationData;
            
            if (driveLink) {
                // Using Google Drive upload
                applicationData = {
                    position: formData.get('position'),
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    location: formData.get('location'),
                    experience: formData.get('experience'),
                    noticePeriod: formData.get('noticePeriod'),
                    skills: formData.get('skills'),
                    coverLetter: formData.get('coverLetter'),
                    resumeType: 'google-drive',
                    resumeLink: driveLink,
                    resumeFileName: formData.get('resumeFileName') || 'Resume',
                    resumeFileId: formData.get('resumeFileId'),
                    appliedAt: new Date().toISOString(),
                    status: 'pending'
                };
            } else if (traditionalFile) {
                // Using traditional file upload
                // First upload file to Firebase Storage
                const fileUrl = await this.uploadFileToStorage(traditionalFile);
                
                applicationData = {
                    position: formData.get('position'),
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    location: formData.get('location'),
                    experience: formData.get('experience'),
                    noticePeriod: formData.get('noticePeriod'),
                    skills: formData.get('skills'),
                    coverLetter: formData.get('coverLetter'),
                    resumeType: 'uploaded',
                    resumeUrl: fileUrl,
                    resumeFileName: traditionalFile.name,
                    appliedAt: new Date().toISOString(),
                    status: 'pending'
                };
            }
            
            // Submit to Firebase
            const applicationId = await this.submitApplication(applicationData);
            
            // Show success message
            this.showSuccessMessage('Application submitted successfully! We will contact you soon.');
            
            // Reset form
            this.applicationForm.reset();
            this.clearAllErrors();
            
            // Reset upload states
            if (window.driveUploader) {
                window.driveUploader.resetUploadState();
            }
            
            // Reset button
            this.setSubmitLoading(false);
            
            // Optional: Close modal or redirect
            setTimeout(() => {
                this.hideSuccessMessage();
            }, 5000);
            
        } catch (error) {
            console.error('Error submitting application:', error);
            this.showErrorMessage('Failed to submit application. Please try again.');
            
            // Reset button
            this.setSubmitLoading(false);
        }
    }

    async uploadFileToStorage(file) {
        // This method would handle traditional file upload to Firebase Storage
        // For now, return a placeholder URL
        console.log('Uploading file to storage:', file.name);
        
        // Simulate upload process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Return mock URL
        return `https://firebasestorage.googleapis.com/v0/b/sriox-f5ae4.appspot.com/o/resumes%2F${Date.now()}_${file.name}?alt=media`;
    }

    clearAllErrors() {
        const fields = this.applicationForm.querySelectorAll('input, textarea, select');
        fields.forEach(field => this.clearFieldError(field));
        this.clearMessages();
    }

    hideSuccessMessage() {
        const successMsg = this.applicationForm.querySelector('.success-message');
        if (successMsg) {
            successMsg.remove();
        }
    }
}

// Initialize careers page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CareersPage();
});