# Admin Login Setup for Sriox Careers System

## 🔐 **Admin Account Setup Instructions**

### **Step 1: Enable Firebase Authentication**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `sriox-f5ae4`
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. Click **Save**

### **Step 1.5: Add Authorized Domains (IMPORTANT!)**

1. Still in Firebase Console → **Authentication**
2. Go to **Settings** → **Authorized domains** tab
3. Click **Add domain** and add:
   - `127.0.0.1`
   - `localhost`
4. Save changes

⚠️ **Without this step, you'll get OAuth domain authorization errors!**

### **Step 2: Create Admin Account**

#### **Option A: Using the Setup Script (Recommended)**

1. Open your browser and navigate to: `http://localhost:5500/admin.html`
2. Open browser console (F12)
3. Run the following command:
   ```javascript
   setupAdminAccount()
   ```
4. This will create an admin account with these credentials:
   - **Email**: `admin@sriox.com`
   - **Password**: `SrioxAdmin2024!`

#### **Option B: Manual Setup via Firebase Console**

1. Go to Firebase Console → Authentication → Users
2. Click **Add user**
3. Enter:
   - **Email**: `admin@sriox.com`
   - **Password**: `SrioxAdmin2024!`
4. Click **Add user**

### **Step 3: Test Admin Login**

1. Go to: `http://localhost:5500/admin.html`
2. Use these credentials:
   - **Email**: `admin@sriox.com`
   - **Password**: `SrioxAdmin2024!`
3. Click **Login**

## 🚀 **Admin Dashboard Features**

Once logged in, you can:

- ✅ **View Dashboard Stats**: Total jobs, applications, pending reviews
- ✅ **Manage Job Postings**: Add, edit, delete job listings
- ✅ **Review Applications**: View submitted applications and resumes
- ✅ **Real-time Updates**: Live updates when new applications come in
- ✅ **Secure Access**: Firebase authentication with session management

## 🔧 **Customization**

### **Change Admin Credentials**

Edit the credentials in `js/admin-setup.js`:

```javascript
const ADMIN_EMAIL = 'your-admin@company.com';
const ADMIN_PASSWORD = 'YourSecurePassword123!';
```

### **Add Multiple Admins**

1. Use the Firebase Console to add more users
2. Or modify the setup script to create multiple accounts

### **Security Rules**

Consider adding Firestore security rules to restrict admin access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🆘 **Troubleshooting**

### **"Firebase not loaded" Error**
- Make sure you're accessing via `http://localhost:5500` (Live Server)
- Check that Firebase SDK files are loading properly

### **"Invalid email or password" Error**
- Make sure Firebase Authentication is enabled
- Verify the admin account was created successfully
- Check browser console for detailed error messages

### **Dashboard not loading data**
- Check browser console for Firebase connection errors
- Verify Firestore is enabled in Firebase Console
- Make sure you have proper internet connection

## 📱 **Mobile Access**

The admin dashboard is responsive and works on mobile devices. Access it from any device using the same URL.

## 🔒 **Security Best Practices**

1. **Change default password** immediately after setup
2. **Use strong passwords** (12+ characters, mixed case, numbers, symbols)
3. **Enable 2FA** in Firebase Console for extra security
4. **Regularly review** admin access and remove unused accounts
5. **Monitor login attempts** in Firebase Console

---

**Need help?** Check the browser console for error messages or contact the development team.