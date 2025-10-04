# Firebase Authentication Domain Fix

## 🚨 **Current Issue:**
Firebase OAuth operations are blocked because `127.0.0.1` is not in the authorized domains list.

## ✅ **Solution Options:**

### **Option 1: Add Authorized Domains (Recommended)**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `sriox-f5ae4`
3. Navigate to: **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain** and add:
   - `127.0.0.1`
   - `localhost`
5. Save changes

### **Option 2: Use Pre-authorized localhost**

Instead of `http://127.0.0.1:5500`, use:
- `http://localhost:5500`

### **Option 3: VS Code Live Server Configuration**

If using VS Code Live Server, you can configure it to use localhost:

1. Open VS Code Settings (Ctrl+,)
2. Search for "Live Server"
3. Find "Live Server > Settings: Host"
4. Change from `127.0.0.1` to `localhost`
5. Restart Live Server

## 📝 **Complete Firebase Setup Checklist:**

- [ ] Enable Email/Password authentication
- [ ] Add authorized domains (`127.0.0.1`, `localhost`)
- [ ] Create admin account using the setup button
- [ ] Test login with admin credentials

## 🔗 **Quick Links:**
- [Firebase Console](https://console.firebase.google.com/)
- [Authentication Settings](https://console.firebase.google.com/project/sriox-f5ae4/authentication/settings)

---

After completing these steps, the admin login should work without domain authorization errors.