// Google Drive Instructions Helper
// This provides instructions for users on how to share Google Drive files

function showDriveInstructions() {
    const modal = document.createElement('div');
    modal.className = 'instructions-modal';
    modal.innerHTML = `
        <div class="instructions-modal-content">
            <div class="instructions-header">
                <h3><i class="fab fa-google-drive"></i> How to Share Your Resume from Google Drive</h3>
                <button type="button" class="close-instructions" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            
            <div class="instructions-body">
                <div class="instruction-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>Upload your resume to Google Drive</h4>
                        <p>Go to <a href="https://drive.google.com" target="_blank">drive.google.com</a> and upload your resume file (PDF, DOC, or DOCX).</p>
                    </div>
                </div>
                
                <div class="instruction-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>Right-click on your resume file</h4>
                        <p>Select "Share" from the context menu.</p>
                    </div>
                </div>
                
                <div class="instruction-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4>Change sharing permissions</h4>
                        <p>Click "Change to anyone with the link" and make sure "Viewer" is selected.</p>
                    </div>
                </div>
                
                <div class="instruction-step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h4>Copy the link</h4>
                        <p>Click "Copy link" and paste it in the resume field above.</p>
                    </div>
                </div>
                
                <div class="example-section">
                    <h4><i class="fas fa-info-circle"></i> Example link format:</h4>
                    <code>https://drive.google.com/file/d/1ABC123def456GHI789/view?usp=sharing</code>
                </div>
            </div>
            
            <div class="instructions-footer">
                <button type="button" class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                    Got it!
                </button>
            </div>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('instructions-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'instructions-modal-styles';
        styles.textContent = `
            .instructions-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 2rem;
                box-sizing: border-box;
            }
            
            .instructions-modal-content {
                background: #1a1a1a;
                border-radius: 12px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                border: 1px solid #333;
            }
            
            .instructions-header {
                padding: 1.5rem;
                border-bottom: 1px solid #333;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .instructions-header h3 {
                margin: 0;
                color: #fff;
                font-size: 1.3rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .instructions-header .fab.fa-google-drive {
                color: #4285F4;
            }
            
            .close-instructions {
                background: none;
                border: none;
                color: #ccc;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                line-height: 1;
            }
            
            .close-instructions:hover {
                color: #fff;
            }
            
            .instructions-body {
                padding: 1.5rem;
            }
            
            .instruction-step {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
                align-items: flex-start;
            }
            
            .step-number {
                background: #FF7B00;
                color: white;
                width: 2rem;
                height: 2rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .step-content h4 {
                margin: 0 0 0.5rem 0;
                color: #fff;
                font-size: 1rem;
            }
            
            .step-content p {
                margin: 0;
                color: #ccc;
                line-height: 1.4;
            }
            
            .step-content a {
                color: #FF7B00;
                text-decoration: none;
            }
            
            .step-content a:hover {
                text-decoration: underline;
            }
            
            .example-section {
                background: rgba(255, 123, 0, 0.1);
                padding: 1rem;
                border-radius: 6px;
                border-left: 3px solid #FF7B00;
                margin-top: 1rem;
            }
            
            .example-section h4 {
                margin: 0 0 0.5rem 0;
                color: #FF7B00;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .example-section code {
                background: #333;
                padding: 0.5rem;
                border-radius: 4px;
                display: block;
                color: #fff;
                font-family: monospace;
                word-break: break-all;
                font-size: 0.85rem;
            }
            
            .instructions-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid #333;
                text-align: center;
            }
            
            @media (max-width: 768px) {
                .instructions-modal {
                    padding: 1rem;
                }
                
                .instructions-modal-content {
                    max-height: 95vh;
                }
                
                .instruction-step {
                    gap: 0.75rem;
                }
                
                .step-number {
                    width: 1.75rem;
                    height: 1.75rem;
                    font-size: 0.9rem;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    });
}

// Make function available globally
window.showDriveInstructions = showDriveInstructions;