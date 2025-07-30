# XPRESS - Inventory Management System

A modern, full-stack inventory management solution designed to streamline business operations and provide real-time inventory tracking capabilities.

![XPRESS Logo](src/assets/xpress_logo.png)

## 🚀 Project Overview

XPRESS is a comprehensive inventory management system that helps businesses efficiently track, manage, and optimize their inventory operations. Built with modern web technologies, it provides an intuitive interface for inventory control, real-time analytics, and seamless user management.

## ✨ Features

### 🔐 Authentication & Security
- Secure user authentication with JWT tokens
- Role-based access control
- Password encryption and validation
- Session management with automatic logout

### 📦 Inventory Management
- Real-time inventory tracking
- Product categorization and organization
- Stock level monitoring with low-stock alerts
- Barcode/QR code scanning support
- Batch and expiry date tracking

### 📊 Analytics & Reporting
- Real-time inventory analytics
- Stock movement reports
- Sales and purchase history
- Customizable dashboards
- Export functionality (PDF, Excel)

### 👥 User Management
- Multi-user support with role assignments
- User activity logging
- Profile management
- Admin controls

### 🔄 Operations
- Purchase order management
- Sales tracking
- Supplier management
- Customer management
- Return and refund processing

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling with modern CSS features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Database
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - ODM for MongoDB

## 📁 Project Structure

```
XPRESS/
├── frontend/
│   └── my-app/
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── pages/          # Page components
│       │   ├── contexts/       # React Context providers
│       │   ├── hooks/          # Custom React hooks
│       │   ├── styles/         # CSS stylesheets
│       │   └── assets/         # Images, icons, and static files
│       ├── public/             # Public assets
│       └── package.json        # Frontend dependencies
└── backend/                    # Backend API server
    ├── routes/                 # API route handlers
    ├── models/                 # Database models
    ├── middleware/             # Custom middleware
    ├── controllers/            # Business logic
    └── config/                 # Configuration files
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lamba237/XPRESS.git
   cd XPRESS
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend/my-app
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../../backend
   npm install
   ```

4. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/xpress
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

5. **Start the Development Servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend/my-app
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 📱 Usage

### First Time Setup
1. Navigate to the application URL
2. Create an admin account through the signup process
3. Configure your inventory categories
4. Start adding products and managing inventory

### Daily Operations
1. **Login** to your account
2. **Dashboard** - View real-time inventory status
3. **Add Products** - Register new inventory items
4. **Track Stock** - Monitor stock levels and movements
5. **Generate Reports** - Analyze inventory performance

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run test` - Run test suite

### Code Quality
- ESLint configuration for consistent code style
- Prettier for code formatting
- Husky for pre-commit hooks

## 🤝 Contributing

We welcome contributions to XPRESS! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced analytics with charts and graphs
- [ ] Integration with external APIs (suppliers, shipping)
- [ ] Multi-location inventory support
- [ ] Automated reorder points
- [ ] Integration with accounting software

## 🐛 Bug Reports & Feature Requests

Please use the [Issues](https://github.com/Lamba237/XPRESS/issues) tab to report bugs or request new features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Lamba237** - *Initial work* - [GitHub Profile](https://github.com/Lamba237)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the lightning-fast build tool
- All contributors who help improve this project

---

**Built with ❤️ for efficient inventory management**
