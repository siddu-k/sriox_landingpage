// Google Drive Integration for Resume Uploads
// This handles Google Drive API integration for secure file sharing

class GoogleDriveUploader {
    constructor() {
        this.isInitialized = false;
        this.isSignedIn = false;
        this.gapi = null;
        this.testMode = false; // Set to true if you want to enable test mode
        
        // Google Drive API configuration
        // NOTE: Replace these with your actual Google Cloud credentials
        this.CLIENT_ID = '291988856309-6qnp82crfld7k0458nqu1vkuk47bfkpg.apps.googleusercontent.com';
        this.API_KEY = 'AIzaSyCQzsXjATVNWNirkowP4R6Vri2zn6veniw';
        this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
        this.SCOPES = 'https://www.googleapis.com/auth/drive.file';
        
        console.log('GoogleDriveUploader: Constructor called, initializing...');
        
        // Automatically try to initialize
        this.initializeGoogleAPI().catch(error => {
            console.warn('GoogleDriveUploader: Initialization failed, will try test mode:', error);
            this.testMode = true;
        });
    }

    async initializeGoogleAPI() {
        try {
            console.log('GoogleDriveUploader: Starting API initialization...');
            
            // Check if we should use test mode
            if (this.testMode || !this.CLIENT_ID || !this.API_KEY || 
                this.CLIENT_ID.includes('demo') || this.API_KEY.includes('demo')) {
                console.warn('GoogleDriveUploader: Running in TEST MODE - Google Drive functionality will be simulated');
                this.testMode = true;
                this.isInitialized = true;
                return;
            }
            
            // Load Google API
            await this.loadGoogleAPI();
            console.log('GoogleDriveUploader: Google API loaded successfully');
            
            // Initialize gapi with promise wrapper
            await new Promise((resolve, reject) => {
                gapi.load('auth2:client', {
                    callback: async () => {
                        try {
                            console.log('GoogleDriveUploader: gapi loaded, initializing client...');
                            await gapi.client.init({
                                apiKey: this.API_KEY,
                                clientId: this.CLIENT_ID,
                                discoveryDocs: [this.DISCOVERY_DOC],
                                scope: this.SCOPES
                            });
                            
                            this.isInitialized = true;
                            this.authInstance = gapi.auth2.getAuthInstance();
                            
                            // Check if user is already signed in
                            this.isSignedIn = this.authInstance.isSignedIn.get();
                            
                            console.log('GoogleDriveUploader: API initialized successfully', { 
                                isSignedIn: this.isSignedIn,
                                hasAuth: !!this.authInstance 
                            });
                            resolve();
                        } catch (error) {
                            console.error('GoogleDriveUploader: Error in gapi.client.init:', error);
                            reject(error);
                        }
                    },
                    onerror: (error) => {
                        console.error('GoogleDriveUploader: Error loading gapi modules:', error);
                        reject(error);
                    }
                });
            });
            
        } catch (error) {
            console.error('GoogleDriveUploader: Error initializing Google Drive API:', error);
            // Fall back to test mode instead of throwing
            console.warn('GoogleDriveUploader: Falling back to test mode due to initialization error');
            this.testMode = true;
            this.isInitialized = true;
        }
    }

    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async signInToGoogle() {
        try {
            if (!this.isInitialized) {
                throw new Error('Google API not initialized');
            }
            
            if (!this.isSignedIn) {
                await this.authInstance.signIn();
                this.isSignedIn = this.authInstance.isSignedIn.get();
            }
            
            return this.isSignedIn;
        } catch (error) {
            console.error('Error signing in to Google:', error);
            throw error;
        }
    }

    async uploadResumeToGoogleDrive(file, applicantName, jobTitle) {
        try {
            // Ensure user is signed in
            await this.signInToGoogle();
            
            if (!this.isSignedIn) {
                throw new Error('User not signed in to Google');
            }
            
            // Validate file
            this.validateResumeFile(file);
            
            // Create file metadata
            const fileName = this.generateFileName(file.name, applicantName, jobTitle);
            const metadata = {
                name: fileName,
                parents: [], // Upload to root folder
                description: `Resume for ${jobTitle} position - ${applicantName}`,
            };
            
            // Convert file to base64
            const base64Data = await this.fileToBase64(file);
            
            // Upload file to Google Drive
            const response = await gapi.client.request({
                path: 'https://www.googleapis.com/upload/drive/v3/files',
                method: 'POST',
                params: {
                    uploadType: 'multipart'
                },
                headers: {
                    'Content-Type': 'multipart/related; boundary="foo_bar_baz"'
                },
                body: this.createMultipartBody(metadata, base64Data, file.type)
            });
            
            const fileId = response.result.id;
            
            // Make file shareable (anyone with link can view)
            await this.makeFileShareable(fileId);
            
            // Get shareable link
            const shareableLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
            
            return {
                fileId: fileId,
                fileName: fileName,
                shareableLink: shareableLink,
                success: true
            };
            
        } catch (error) {
            console.error('Error uploading to Google Drive:', error);
            throw error;
        }
    }

    async makeFileShareable(fileId) {
        try {
            await gapi.client.drive.permissions.create({
                fileId: fileId,
                resource: {
                    role: 'reader',
                    type: 'anyone'
                }
            });
        } catch (error) {
            console.error('Error making file shareable:', error);
            // Don't throw error here, file is uploaded but may not be shareable
        }
    }

    validateResumeFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (file.size > maxSize) {
            throw new Error('File size must be less than 10MB');
        }
        
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Only PDF, DOC, and DOCX files are allowed');
        }
    }

    generateFileName(originalName, applicantName, jobTitle) {
        const timestamp = new Date().toISOString().split('T')[0];
        const cleanApplicantName = applicantName.replace(/[^a-zA-Z0-9]/g, '_');
        const cleanJobTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, '_');
        const extension = originalName.split('.').pop();
        
        return `Resume_${cleanApplicantName}_${cleanJobTitle}_${timestamp}.${extension}`;
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
        });
    }

    createMultipartBody(metadata, data, contentType) {
        const delimiter = 'foo_bar_baz';
        const close_delim = `\r\n--${delimiter}--`;
        
        let body = `--${delimiter}\r\n`;
        body += 'Content-Type: application/json\r\n\r\n';
        body += JSON.stringify(metadata) + '\r\n';
        body += `--${delimiter}\r\n`;
        body += `Content-Type: ${contentType}\r\n`;
        body += 'Content-Transfer-Encoding: base64\r\n\r\n';
        body += data;
        body += close_delim;
        
        return body;
    }

    async openGoogleDrivePicker(applicantName, jobTitle) {
        try {
            await this.signInToGoogle();
            
            if (!this.isSignedIn) {
                throw new Error('User not signed in to Google');
            }
            
            return new Promise((resolve, reject) => {
                const picker = new google.picker.PickerBuilder()
                    .addView(google.picker.ViewId.DOCS)
                    .setOAuthToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
                    .setDeveloperKey(this.API_KEY)
                    .setCallback((data) => {
                        if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
                            const file = data[google.picker.Response.DOCUMENTS][0];
                            resolve({
                                fileId: file[google.picker.Document.ID],
                                fileName: file[google.picker.Document.NAME],
                                shareableLink: file[google.picker.Document.URL],
                                success: true
                            });
                        } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
                            reject(new Error('User cancelled file selection'));
                        }
                    })
                    .build();
                
                picker.setVisible(true);
            });
            
        } catch (error) {
            console.error('Error opening Google Drive picker:', error);
            throw error;
        }
    }

    // Alternative method: Upload file using file picker
    async uploadWithPicker(applicantName, jobTitle) {
        try {
            console.log('GoogleDriveUploader: uploadWithPicker called', { applicantName, jobTitle });
            
            // If in test mode, simulate the upload process
            if (this.testMode) {
                console.log('GoogleDriveUploader: Running in test mode, simulating upload...');
                return await this.simulateGoogleDriveUpload(applicantName, jobTitle);
            }

            // Wait for initialization if still in progress
            if (!this.isInitialized) {
                console.log('GoogleDriveUploader: Waiting for initialization...');
                await this.waitForInitialization();
            }

            // Try to sign in to Google
            try {
                await this.signInToGoogle();
            } catch (signInError) {
                console.error('GoogleDriveUploader: Failed to sign in, falling back to simulation:', signInError);
                return await this.simulateGoogleDriveUpload(applicantName, jobTitle);
            }
            
            return new Promise((resolve, reject) => {
                // Create file input for local file selection
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.pdf,.doc,.docx';
                fileInput.style.display = 'none';
                
                fileInput.onchange = async (event) => {
                    try {
                        const file = event.target.files[0];
                        if (file) {
                            console.log('GoogleDriveUploader: File selected:', file.name);
                            const result = await this.uploadResumeToGoogleDrive(file, applicantName, jobTitle);
                            resolve({
                                success: true,
                                fileId: result.fileId,
                                fileName: result.fileName,
                                shareableLink: result.shareableLink,
                                webViewLink: result.shareableLink,
                                message: 'File uploaded successfully to Google Drive'
                            });
                        } else {
                            reject(new Error('No file selected'));
                        }
                    } catch (error) {
                        console.error('GoogleDriveUploader: Upload error, falling back to simulation:', error);
                        // Fallback to simulation if real upload fails
                        try {
                            const simulationResult = await this.simulateGoogleDriveUpload(applicantName, jobTitle);
                            resolve(simulationResult);
                        } catch (simError) {
                            reject(error);
                        }
                    } finally {
                        if (document.body.contains(fileInput)) {
                            document.body.removeChild(fileInput);
                        }
                    }
                };
                
                // Handle cancel case
                fileInput.oncancel = () => {
                    reject(new Error('File selection cancelled'));
                };
                
                document.body.appendChild(fileInput);
                fileInput.click();
            });
            
        } catch (error) {
            console.error('GoogleDriveUploader: Error in upload with picker, falling back to simulation:', error);
            return await this.simulateGoogleDriveUpload(applicantName, jobTitle);
        }
    }

    // Helper method to wait for initialization
    async waitForInitialization(maxWait = 5000) {
        const startTime = Date.now();
        while (!this.isInitialized && (Date.now() - startTime) < maxWait) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (!this.isInitialized) {
            throw new Error('Google Drive API initialization timeout');
        }
    }

    // Check if user has necessary permissions
    async checkDrivePermissions() {
        try {
            if (!this.isSignedIn) {
                return false;
            }
            
            const response = await gapi.client.drive.about.get({
                fields: 'user'
            });
            
            return response.status === 200;
        } catch (error) {
            console.error('Error checking Drive permissions:', error);
            return false;
        }
    }

    // Sign out from Google
    async signOut() {
        try {
            if (this.authInstance && this.isSignedIn) {
                await this.authInstance.signOut();
                this.isSignedIn = false;
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    // Simulate Google Drive upload for testing purposes
    async simulateGoogleDriveUpload(applicantName, jobTitle) {
        console.log('GoogleDriveUploader: Simulating Google Drive upload...');
        
        // Show a confirmation dialog to simulate user interaction
        const confirmed = confirm(`Demo Mode: Simulate uploading resume for ${applicantName} applying to ${jobTitle}?\n\nThis will create a mock Google Drive response for testing purposes.`);
        
        if (!confirmed) {
            return {
                success: false,
                error: 'Upload cancelled by user'
            };
        }
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock Google Drive response
        const mockFileId = 'demo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const mockFileName = `${applicantName.replace(/\s+/g, '_')}_Resume_${jobTitle.replace(/\s+/g, '_')}.pdf`;
        const mockWebViewLink = `https://drive.google.com/file/d/${mockFileId}/view?usp=sharing`;
        
        console.log('GoogleDriveUploader: Mock upload completed', {
            fileId: mockFileId,
            fileName: mockFileName,
            webViewLink: mockWebViewLink
        });
        
        return {
            success: true,
            fileId: mockFileId,
            fileName: mockFileName,
            webViewLink: mockWebViewLink,
            message: 'File uploaded successfully (Demo Mode)',
            isDemo: true
        };
    }

    // Reset upload state
    resetUploadState() {
        console.log('GoogleDriveUploader: Resetting upload state');
        // In a real implementation, this would clear any upload progress or cached data
    }
}

// Export for use in other modules
window.GoogleDriveUploader = GoogleDriveUploader;