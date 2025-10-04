# Sriox Landing Page

A modern, responsive landing page for Sriox - delivering exceptional digital solutions with cutting-edge technology and innovative design.

## 🚀 Features

### 🎨 **Modern UI/UX Design**
- Responsive design optimized for all devices
- Modern gradient backgrounds and animations
- Professional typography with Google Fonts
- Interactive hover effects and smooth transitions

### 📱 **Pages & Sections**
- **Home Page** - Hero section with company overview
- **About** - Company mission and team information
- **Services** - Detailed service offerings
- **How It Works** - Process explanation
- **Careers** - Job listings with advanced filtering
- **Certificate** - Certification information
- **Testimonials** - Client feedback and reviews
- **Legal Pages** - Privacy Policy, Terms, Intern Policies

### 💼 **Career Portal**
- Dynamic job listings with real-time filtering
- Professional application forms
- Google Drive integration for resume uploads
- LinkedIn, GitHub, and Discord profile integration
- Comprehensive address collection
- **Unpaid internship notice** highlighting learning opportunities

### 🛠 **Technical Stack**
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern features
- **Icons**: Font Awesome 6.0
- **Fonts**: Google Fonts (Poppins, Inter, Montserrat)
- **Backend Integration**: Firebase (optional)

### ✨ **Advanced Features**
- Firebase authentication and database integration
- Admin dashboard for job management
- Google Drive file upload system
- Form validation and error handling
- Mobile-first responsive design
- SEO optimized structure

## 📁 Project Structure

```
sriox/
├── index.html                 # Main landing page
├── about.html                 # About page
├── services.html              # Services page
├── apply.html                 # Careers page
├── job-detail.html           # Individual job details
├── testimonials.html         # Client testimonials
├── certificate.html          # Certification page
├── how-it-works.html         # Process explanation
├── dashboard.html            # Admin dashboard
├── privacy-policy.html       # Privacy policy
├── terms.html                # Terms and conditions
├── intern-policy.html        # Internship policies
├── assets/
│   ├── icons/                # Logo and icon assets
│   └── images/               # Image assets
├── css/
│   ├── global.css            # Global styles
│   ├── home.css              # Homepage styles
│   ├── about.css             # About page styles
│   ├── services.css          # Services page styles
│   ├── careers.css           # Career page styles
│   ├── apply.css             # Application form styles
│   ├── job-detail.css        # Job detail page styles
│   ├── testimonials.css      # Testimonials page styles
│   ├── certificate.css       # Certificate page styles
│   ├── how-it-works.css      # How it works page styles
│   └── admin.css             # Admin dashboard styles
├── js/
│   ├── main.js               # Main JavaScript functionality
│   ├── careers.js            # Career page functionality
│   ├── job-detail.js         # Job detail functionality
│   ├── firebase-config.js    # Firebase configuration
│   ├── admin-dashboard.js    # Admin panel functionality
│   ├── drive-instructions.js # Google Drive help modal
│   └── google-drive-uploader.js # File upload handling
└── README.md                 # Project documentation
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/siddu-k/sriox_landingpage.git
cd sriox_landingpage
```

### 2. Open in Browser
Simply open `index.html` in your web browser or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have live-server installed)
npx live-server

# Using PHP
php -S localhost:8000
```

### 3. Access the Site
Navigate to `http://localhost:8000` in your browser.

## ⚙️ Configuration

### Firebase Setup (Optional)
If you want to enable the backend features:

1. Create a Firebase project
2. Update `js/firebase-config.js` with your credentials
3. Configure Firestore rules using `firestore-rules.txt`
4. Set up Firebase Authentication

### Admin Dashboard
Access the admin panel at `/dashboard.html` to:
- Manage job listings
- View applications
- Monitor system status

## 🎨 Customization

### Colors & Branding
Main brand colors are defined in `css/global.css`:
- Primary: `#FF7B00` (Orange)
- Secondary: `#333333` (Dark Gray)
- Background: `#0D0D0D` (Near Black)

### Content Updates
- Update company information in `about.html`
- Modify services in `services.html`
- Add/edit job listings through the admin dashboard
- Update contact information across all pages

## 📱 Responsive Design

The site is fully responsive with breakpoints at:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Advanced Features

### Job Application System
- **Enhanced Forms**: LinkedIn, GitHub, Discord profiles
- **Address Collection**: Complete address information
- **File Uploads**: Google Drive integration
- **Validation**: Real-time form validation
- **Notifications**: Success/error messaging

### Internship Notice
- **Highlighted Warning**: Unpaid internship positions are clearly marked
- **Professional Styling**: Eye-catching yellow/orange gradient design
- **Clear Messaging**: Explains learning value and expectations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@sriox.com
- **GitHub Issues**: [Create an issue](https://github.com/siddu-k/sriox_landingpage/issues)

## 🌟 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Firebase for backend services
- Modern CSS features for animations

---

**Built with ❤️ by the Sriox Team**

*Delivering exceptional digital solutions with cutting-edge technology.*