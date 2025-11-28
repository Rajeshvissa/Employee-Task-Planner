# Employee Task Tracker - Frontend

A beautiful and modern React-based frontend for the Employee Task Tracker application. This frontend provides a complete UI for managing tasks, employees, and dashboard analytics.

## Features

- **User Authentication**: Secure login and registration
- **Task Management**: Create, view, update, and delete tasks
- **Employee Management**: Add and manage team members (Admin only)
- **Dashboard**: Analytics and statistics (Admin only)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations
- **Role-based Access**: Different features for admin and regular users

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── TaskCard.js
│   │   ├── TaskForm.js
│   │   ├── EmployeeCard.js
│   │   └── EmployeeForm.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Tasks.js
│   │   └── Employees.js
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── styles/
│   │   ├── Auth.css
│   │   ├── Navbar.css
│   │   ├── Dashboard.css
│   │   ├── Tasks.css
│   │   ├── TaskCard.css
│   │   ├── TaskForm.css
│   │   ├── Employees.css
│   │   ├── EmployeeForm.css
│   │   └── EmployeeCard.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Environment Variables

Create a `.env` file in the frontend directory (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Technologies Used

- **React 18**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Lucide React**: Beautiful icons
- **CSS3**: Modern styling with gradients and animations

## Features Overview

### Authentication
- Register new accounts
- Login with email and password
- Persistent sessions with JWT tokens

### Task Management
- View all tasks with filtering (All, Pending, Completed)
- Create new tasks (Admin only)
- Update task status
- Delete tasks (Admin only)
- Assign tasks to employees

### Employee Management
- View all employees with details
- Add new employees (Admin only)
- View employee information

### Dashboard
- View task statistics
- Track completed vs pending tasks
- Monitor total employees

## Usage

1. **Register**: Create a new account as a regular user or admin
2. **Login**: Sign in with your credentials
3. **Dashboard** (Admin): View statistics and analytics
4. **Tasks**: 
   - Regular users: View and manage their assigned tasks
   - Admin: Create, update, and delete tasks
5. **Employees** (Admin): Add and manage team members

## Styling

The application uses a modern gradient color scheme:
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#48bb78)
- **Danger**: Red (#f56565)
- **Warning**: Orange (#ed8936)

All components feature:
- Smooth animations
- Hover effects
- Responsive design
- Accessibility considerations

## Notes

- Ensure the backend server is running on `http://localhost:5000`
- The frontend uses JWT tokens for authentication
- Tokens are stored in localStorage
- All API calls are intercepted and authenticated with JWT

## Future Enhancements

- Search and pagination for large lists
- Task priorities and due dates
- User profile management
- Email notifications
- Activity logs
- Advanced filtering and sorting
