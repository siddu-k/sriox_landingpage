# Firebase Security Setup Guide for Sriox Careers Dashboard

## 🔐 Security Rules Overview

I've created comprehensive Firebase security rules for your careers dashboard. Here's what each rule does:

## 📋 Firestore Database Rules

### Jobs Collection
- **Public Read Access**: Anyone can view job postings (for your careers page)
- **Admin Only Write**: Only `sridatta.k99@gmail.com` can create, update, or delete jobs
- **Data Validation**: Ensures all job data has required fields and proper formats
- **Field Limits**: Title (200 chars), Location (100 chars), Description (5000 chars), Requirements (3000 chars)

### Applications Collection
- **Admin Only Read**: Only you can view applications
- **Public Create**: Anyone can submit applications (job applicants)
- **Admin Update**: Only you can update application status and add notes
- **Data Validation**: Validates email format, required fields, and status values

### Admin Settings Collection
- **Admin Only**: Complete access restricted to your email only
- **Dashboard Config**: Store dashboard settings, preferences, etc.

### Analytics Collection
- **Admin Read/Write**: Full access for you to track metrics
- **Public Create**: Allow tracking of public interactions (page views, etc.)

## 📁 Storage Rules

### Resume Uploads (`/resumes/`)
- **Public Upload**: Job applicants can upload resumes
- **File Size Limit**: 10MB maximum
- **File Types**: PDF, Word documents, plain text only
- **Admin Access**: You can read and delete all resumes
- **Temporary Access**: Applicants can access their uploaded resume for 1 hour

### Admin Files (`/admin/`)
- **Admin Only**: Complete access for your internal documents
- **File Size Limit**: 50MB maximum
- **Use For**: Internal documents, backups, etc.

### Public Assets (`/public/`)
- **Public Read**: Everyone can view (company logos, job images)
- **Admin Upload**: Only you can upload/modify
- **File Types**: Images only
- **File Size Limit**: 20MB maximum

### Job Attachments (`/job_attachments/`)
- **Public Read**: Anyone can download job-related files
- **Admin Upload**: Only you can upload job attachments
- **File Size Limit**: 25MB maximum
- **Use For**: Job descriptions, company brochures, etc.

## 🛠️ How to Apply These Rules

### Step 1: Firestore Rules
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`sriox-f5ae4`)
3. Navigate to **Firestore Database** > **Rules**
4. Copy the content from `firestore-rules.txt`
5. Paste it in the rules editor
6. Click **Publish**

### Step 2: Storage Rules
1. In Firebase Console, navigate to **Storage** > **Rules**
2. Copy the content from `storage-rules.txt`
3. Paste it in the rules editor
4. Click **Publish**

## 🔒 Security Features

### Admin Protection
- Only `sridatta.k99@gmail.com` can access admin functions
- All admin operations require authentication
- Data modification is logged automatically

### Data Validation
- Email format validation for applications
- File type restrictions for uploads
- Size limits to prevent abuse
- Required field validation

### Public Safety
- Job seekers can apply without accounts
- Resume uploads are secure and private
- Public content is read-only
- No unauthorized data access

## 📊 Best Practices Implemented

### Performance
- Efficient queries with proper indexing suggestions
- Minimal data transfer requirements
- Optimized for your dashboard needs

### Scalability
- Rules designed to handle growth
- Efficient for both small and large datasets
- Future-proof structure

### Compliance
- GDPR-friendly data handling
- Secure file storage
- Audit trail capabilities

## 🚨 Important Notes

1. **Test First**: Always test rules in Firebase Console simulator before publishing
2. **Backup Data**: Export your data before applying new rules
3. **Monitor Usage**: Check Firebase Console for any rule violations
4. **Update Email**: If you change admin email, update the rules accordingly

## 🔧 Customization Options

### Adding More Admins
Replace:
```
request.auth.token.email == 'sridatta.k99@gmail.com'
```

With:
```
request.auth.token.email in ['sridatta.k99@gmail.com', 'other-admin@email.com']
```

### Changing File Size Limits
Modify the size checks:
```
request.resource.size < 10 * 1024 * 1024  // 10MB
```

### Adding New Collections
Follow the same pattern with appropriate validation functions.

These rules provide enterprise-level security while keeping your dashboard functional and user-friendly!