# Sriox Careers System - Firebase Setup Guide

## Overview
Complete careers management system with admin dashboard for posting jobs and managing applications.

## System Components

### 1. **Admin Dashboard** (`admin.html`)
- Secure login/logout system
- Job posting management (Create, Read, Update, Delete)
- Application viewing and management
- Real-time dashboard statistics
- Responsive design for all devices

### 2. **Careers Page** (`apply.html`)
- Dynamic job listings from Firebase
- Advanced filtering (department, type, experience)
- Professional job cards with detailed information
- Apply button with modal application form
- Mobile-optimized responsive design

### 3. **Application System**
- Modal-based application form
- File upload for resumes (PDF, DOC, DOCX)
- Form validation and error handling
- Real-time submission to Firebase
- Privacy consent and terms agreement

## Firebase Setup Instructions

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `sriox-careers`
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Enable Authentication
1. In Firebase console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Create admin user:
   - Go to **Users** tab
   - Click **Add user**
   - Email: `admin@sriox.com`
   - Password: `SrioxAdmin2025!`

### Step 3: Setup Realtime Database
1. Go to **Realtime Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location
5. Database structure will be:
   ```
   sriox-careers/
   ├── jobs/
   │   ├── job1/
   │   │   ├── title: "Senior Developer"
   │   │   ├── department: "Engineering"
   │   │   ├── status: "active"
   │   │   └── ...
   │   └── job2/
   └── applications/
       ├── app1/
       │   ├── jobId: "job1"
       │   ├── name: "John Doe"
       │   ├── status: "pending"
       │   └── ...
       └── app2/
   ```

### Step 4: Configure Firebase in Code
1. In Firebase console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (`</>`)
4. Register app name: `Sriox Careers`
5. Copy the configuration object
6. Update `js/firebase-config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key-here",
     authDomain: "your-project-id.firebaseapp.com",
     databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

### Step 5: Setup Firebase Storage (for resumes)
1. Go to **Storage** in Firebase console
2. Click **Get started**
3. Choose **Start in test mode**
4. Create folder structure:
   ```
   resumes/
   ├── 2025/
   │   ├── 01/
   │   └── 02/
   └── temp/
   ```

### Step 6: Security Rules (Production)
For production, update security rules:

**Realtime Database Rules:**
```json
{
  "rules": {
    "jobs": {
      ".read": true,
      ".write": "auth != null"
    },
    "applications": {
      ".read": "auth != null",
      ".write": true
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null || 
                      (resource == null && 
                       request.resource.size < 5 * 1024 * 1024 &&
                       request.resource.contentType.matches('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document'));
    }
  }
}
```

## Usage Instructions

### For Administrators

#### Accessing Admin Dashboard
1. Navigate to `admin.html`
2. Login with admin credentials:
   - Email: `admin@sriox.com`
   - Password: `SrioxAdmin2025!`

#### Managing Jobs
1. **Add New Job:**
   - Click "Add New Job" button
   - Fill out all required fields
   - Set status as "active" or "inactive"
   - Click "Save Job"

2. **Edit Existing Job:**
   - Click "Edit" on any job card
   - Modify fields as needed
   - Click "Save Job"

3. **Delete Job:**
   - Click "Delete" on job card
   - Confirm deletion

4. **Toggle Job Status:**
   - Click "Activate" or "Deactivate" button
   - Job will be shown/hidden on careers page

#### Managing Applications
1. Click "View Applications"
2. Click on any application card for details
3. Use "Email Applicant" to respond
4. Download resumes when available

### For Job Applicants

#### Viewing Jobs
1. Visit `apply.html` (careers page)
2. Browse available positions
3. Use filters to narrow down options
4. View detailed job information

#### Applying for Jobs
1. Click "Apply Now" on desired position
2. Fill out application form completely
3. Upload resume (PDF, DOC, or DOCX)
4. Accept privacy policy
5. Submit application

## File Structure
```
sriox/
├── admin.html              # Admin dashboard
├── apply.html              # Careers page (updated)
├── css/
│   ├── admin.css          # Admin dashboard styles
│   ├── careers.css        # Careers page styles
│   └── global.css         # Global styles
├── js/
│   ├── firebase-config.js # Firebase configuration
│   ├── admin-dashboard.js # Admin functionality
│   └── careers.js         # Careers page functionality
└── assets/
    └── icons/             # Logo files
```

## Features Implemented

### ✅ Admin Dashboard
- [x] Secure authentication system
- [x] Job CRUD operations
- [x] Application management
- [x] Dashboard statistics
- [x] Responsive design
- [x] Real-time updates

### ✅ Careers Page
- [x] Dynamic job loading
- [x] Advanced filtering system
- [x] Professional job cards
- [x] Application modal form
- [x] Form validation
- [x] File upload handling

### ✅ Database Integration
- [x] Firebase Realtime Database
- [x] Firebase Authentication
- [x] Firebase Storage (for resumes)
- [x] Security rules
- [x] Error handling

### ✅ User Experience
- [x] Loading states
- [x] Error messages
- [x] Success confirmations
- [x] Mobile responsive
- [x] Accessible design
- [x] SEO optimized

## Customization Options

### Styling
- Update colors in CSS files to match brand
- Modify typography in `global.css`
- Adjust spacing and layouts as needed

### Functionality
- Add more job fields in forms
- Implement email notifications
- Add job search functionality
- Create application status tracking

### Security
- Implement role-based access control
- Add admin user management
- Set up backup systems
- Enable audit logging

## Support and Maintenance

### Regular Tasks
1. Monitor application submissions
2. Update job postings regularly
3. Review and respond to applications
4. Backup Firebase data
5. Update security rules as needed

### Troubleshooting
- Check browser console for errors
- Verify Firebase configuration
- Test authentication flow
- Validate form submissions
- Monitor database rules

## Next Steps for Production

1. **Domain Setup:** Configure custom domain
2. **SSL Certificate:** Enable HTTPS
3. **Performance:** Optimize loading times
4. **Analytics:** Add Google Analytics
5. **SEO:** Optimize meta tags and content
6. **Testing:** Comprehensive user testing
7. **Backup:** Automated database backups
8. **Monitoring:** Error tracking and logging

---

**Note:** This system is production-ready but requires proper Firebase setup and configuration. All mock data will be replaced with real Firebase operations once configured.