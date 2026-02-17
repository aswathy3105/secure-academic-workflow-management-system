# Secure Academic Workflow Authorization System

A full-stack MERN application for managing academic request workflows with role-based authorization.

## 📋 Features

- **JWT Authentication** with role-based access control
- **Four User Roles**: Admin, Student, Staff, HOD
- **Multi-level Approval Workflow**: Student → Staff → HOD
- **Real-time Request Tracking** with status updates
- **Comprehensive Admin Dashboard** with filtering
- **Secure Password Hashing** with bcrypt
- **Clean Academic UI** with responsive design

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Vite for build tooling
- Modern CSS with responsive design

## 📁 Project Structure

```
academic_workflow/
├── backend/
│   ├── models/           # Database models (User, Request)
│   ├── controllers/      # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & role-based middleware
│   ├── server.js         # Express server
│   ├── seedData.js       # Sample data script
│   └── .env              # Environment variables
└── frontend/
    ├── src/
    │   ├── pages/        # Dashboard pages
    │   ├── components/   # Reusable components
    │   ├── services/     # API service
    │   ├── App.jsx       # Main app component
    │   └── index.css     # Styles
    └── index.html        # HTML template
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Installation

1. **Clone or navigate to the project directory**
```bash
cd c:\Users\aswat\OneDrive\Desktop\academic_workflow
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Configuration

1. **Backend Environment Variables**

The `.env` file is already created in the backend directory with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/academic_workflow
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
JWT_EXPIRE=7d
```

**Important**: Change `JWT_SECRET` to a secure random string in production.

2. **MongoDB Setup**

Make sure MongoDB is running locally on port 27017, or update the `MONGODB_URI` in `.env` to point to your MongoDB Atlas cluster.

### Running the Application

1. **Seed the Database** (First time only)
```bash
cd backend
npm run seed
```

This creates sample users for all roles:
- Admin: admin@university.edu / admin123
- Student: student@university.edu / student123
- Staff: staff@university.edu / staff123
- HOD: hod@university.edu / hod123

2. **Start Backend Server**
```bash
cd backend
npm start
```
Server runs on http://localhost:5000

3. **Start Frontend Development Server** (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

4. **Access the Application**

Open http://localhost:5173 in your browser and login with any of the demo credentials.

## 👥 User Roles & Permissions

### Student
- Submit new requests
- View own request history
- Track approval status (Staff → HOD → Final)

### Staff
- View pending requests (staffStatus = pending)
- Approve or reject requests
- Approved requests move to HOD queue

### HOD
- View staff-approved requests
- Provide final approval or rejection
- Final decision updates request status

### Admin
- View all requests in the system
- Filter by student, status, date
- Access complete approval history
- View comprehensive statistics

## 🔄 Workflow Logic

1. **Student** submits a request
   - Initial status: `staffStatus = pending`

2. **Staff** reviews and approves/rejects
   - If rejected: `finalStatus = rejected` (workflow ends)
   - If approved: Request moves to HOD queue

3. **HOD** provides final decision
   - Approve: `finalStatus = approved`
   - Reject: `finalStatus = rejected`

4. **Admin** can view all requests at any stage

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Student
- `POST /api/student/request` - Submit request
- `GET /api/student/requests` - Get own requests

### Staff
- `GET /api/staff/requests` - Get pending requests
- `PUT /api/staff/request/:id` - Update request status

### HOD
- `GET /api/hod/requests` - Get approved requests
- `PUT /api/hod/request/:id` - Final approval/rejection

### Admin
- `GET /api/admin/requests` - Get all requests (with filters)

## 🎨 UI Features

- Clean academic dashboard layout
- Responsive design for all screen sizes
- Color-coded status badges
- Real-time statistics
- Interactive request cards
- Professional color scheme

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control middleware
- Protected API routes
- Input validation
- Secure HTTP headers

## 📝 Sample Credentials

| Role    | Email                    | Password   |
|---------|--------------------------|------------|
| Admin   | admin@university.edu     | admin123   |
| Student | student@university.edu   | student123 |
| Staff   | staff@university.edu     | staff123   |
| HOD     | hod@university.edu       | hod123     |

Additional test students:
- alice@university.edu / alice123
- bob@university.edu / bob123

## 🛡️ Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong random string
2. Update `MONGODB_URI` to production database
3. Set `NODE_ENV=production`
4. Build frontend: `npm run build`
5. Configure CORS for production domain
6. Use environment variables for sensitive data
7. Enable HTTPS
8. Set up proper logging

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Development

- Backend runs on port 5000
- Frontend runs on port 5173
- API proxy configured in Vite for development

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

**Port Already in Use**
- Backend: Change `PORT` in `.env`
- Frontend: Vite will prompt for alternative port

**CORS Issues**
- Backend CORS is enabled for all origins in development
- Configure specific origins for production

## 📞 Support

For issues or questions, please check the code comments or review the implementation plan.
