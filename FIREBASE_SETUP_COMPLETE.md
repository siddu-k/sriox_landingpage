# Firebase Setup for Sriox Careers System

## Your Firebase Project Configuration ✅
**Project ID:** sriox-f5ae4
**Project URL:** https://console.firebase.google.com/project/sriox-f5ae4

The Firebase configuration has been successfully updated with your credentials!

## Next Steps to Complete Setup

### 1. Enable Authentication 🔐
1. Go to [Firebase Console](https://console.firebase.google.com/project/sriox-f5ae4)
2. Click on **Authentication** in the left sidebar
3. Click **Get started**
4. Go to **Sign-in method** tab
5. Click on **Email/Password**
6. Enable **Email/Password** authentication
7. Click **Save**

### 2. Create Admin User 👤
1. In Authentication, go to **Users** tab
2. Click **Add user**
3. Create admin account:
   - **Email:** `admin@sriox.com`
   - **Password:** `SrioxAdmin2025!` (or your preferred secure password)
4. Click **Add user**

### 3. Setup Realtime Database 🗄️
1. In Firebase Console, click **Realtime Database**
2. Click **Create Database**
3. **Choose location:** Select your preferred region (e.g., us-central1)
4. **Security rules:** Start in **test mode** for now
5. Click **Done**

Your database URL will be: `https://sriox-f5ae4-default-rtdb.firebaseio.com`

### 4. Configure Database Structure 📊
Once database is created, you can add sample data:

```json
{
  "jobs": {
    "job1": {
      "title": "Senior Full Stack Developer",
      "type": "full-time",
      "department": "Engineering",
      "location": "Remote • India",
      "experience": "Senior Level",
      "salary": "₹80,000 - ₹1,20,000/month",
      "description": "Lead development of client projects and innovative digital solutions.",
      "requirements": "Strong experience in React, Node.js, and databases\\nExperience with cloud platforms (AWS/Azure)\\nLeadership and mentoring experience",
      "status": "active",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "applications": {}
}
```

### 5. Setup Firebase Storage (for Resume Uploads) 📁
1. Go to **Storage** in Firebase Console
2. Click **Get started**
3. Choose **Start in test mode**
4. Select same location as database
5. Click **Done**

### 6. Update Security Rules (Production Ready) 🔒

**Realtime Database Rules:**
```json
{
  "rules": {
    "jobs": {
      ".read": true,
      ".write": "auth != null && auth.token.email == 'admin@sriox.com'"
    },
    "applications": {
      ".read": "auth != null && auth.token.email == 'admin@sriox.com'",
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
      allow read: if request.auth != null && request.auth.token.email == 'admin@sriox.com';
      allow write: if request.resource.size < 5 * 1024 * 1024 &&
                      request.resource.contentType.matches('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    }
  }
}
```

## Testing Your Setup 🧪

### 1. Test Admin Dashboard
1. Open `admin.html` in your browser
2. Login with your admin credentials
3. Try adding a test job posting

### 2. Test Careers Page
1. Open `apply.html` in your browser
2. Verify jobs are loading (may show mock data initially)
3. Test the application form

### 3. Check Browser Console
- Open Developer Tools (F12)
- Check Console for any Firebase connection errors
- Verify all scripts are loading correctly

## Troubleshooting 🔧

### Common Issues:

**Authentication Error:**
- Verify admin email/password is correct
- Check if Email/Password auth is enabled
- Ensure database rules allow admin access

**Database Connection Error:**
- Verify database URL is correct
- Check if Realtime Database is created
- Ensure database rules allow read access

**CORS Errors:**
- Make sure you're serving files via HTTP server (not file://)
- Use Live Server extension in VS Code
- Or use `python -m http.server 8000`

## Files Updated ✅
- ✅ `js/firebase-config.js` - Updated with your Firebase credentials
- ✅ `admin.html` - Updated Firebase SDK version
- ✅ `apply.html` - Updated Firebase SDK version

## What's Working Now 🎯
- Firebase configuration is properly set up
- SDK versions are updated to match your Firebase project
- All authentication and database functions are ready
- Admin dashboard and careers page are configured

## Next Actions Required 📋
1. [ ] Enable Authentication in Firebase Console
2. [ ] Create admin user account
3. [ ] Setup Realtime Database
4. [ ] Test admin login and job posting
5. [ ] Test careers page and application form

Once you complete these steps, your careers system will be fully functional with Firebase! 🚀

---

**Need Help?**
- Check Firebase Console: https://console.firebase.google.com/project/sriox-f5ae4
- Firebase Documentation: https://firebase.google.com/docs
- Project GitHub Issues: Create issues for any problems