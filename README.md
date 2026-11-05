# 🌱 TogetherForGood

### A Social Development Events Platform

TogetherForGood is a modern, responsive web application designed to bring people together through meaningful social development activities.

The platform allows users to discover upcoming community events, organize their own initiatives, join social activities, and manage their event participation.

Our mission is to encourage volunteering, community engagement, and positive social impact.

---

## 🌐 Live Website

**Live Site:**  
https://together-for-good-client.vercel.app

**Client Repository:**  
https://github.com/fatemakhatun21/together-for-good-client

**Server Repository:**  
https://github.com/fatemakhatun21/together-for-good-server

**Backend API:**  
https://together-for-good-server.onrender.com

---

## ✨ Key Features

### 1. User Authentication
Users can register and log in securely using their email and password. Google authentication is also available.

### 2. Create Community Events
Authenticated users can create social development events by providing a title, description, event type, image URL, location, and event date.

### 3. Explore Upcoming Events
Visitors can browse upcoming events and discover opportunities to participate in community initiatives.

### 4. Event Details
Each event has a dedicated details page containing its information, including the event title, description, location, date, and image.

### 5. Join Events
Authenticated users can join available events. The application prevents duplicate participation in the same event.

### 6. Manage My Events
Users can view the events they created and manage their own event listings.

### 7. Edit and Delete Events
Event creators can update or delete their own events. A confirmation dialog appears before an event is deleted.

### 8. My Joined Events
Users can view the events they have joined through a dedicated Joined Events page.

### 9. Light and Dark Mode
The application supports light and dark themes. Users can switch between themes according to their preferences.

### 10. Toast Notifications
React Toastify provides notifications for successful operations, validation warnings, and errors.

### 11. Responsive Design
The website is designed for desktop, tablet, and mobile devices, with responsive layouts and mobile navigation.

### 12. Protected Routes
Private pages require authentication, while backend APIs use JWT verification to protect restricted operations.

---

## 🛠️ Technologies Used

### Frontend
- Next.js 16
- React.js
- Tailwind CSS
- JavaScript
- shadcn/ui
- Lucide React
- React Toastify
- next-themes

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Better Auth
- JOSE for JWT verification

### Authentication
- Better Auth
- Email and Password Authentication
- Google OAuth
- JWT-based API Authorization

### Deployment
- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## 📄 Main Pages

| Page | Description |
|------|-------------|
| Home | Hero, Features, Recent Events, Gallery, Newsletter UI |
| Upcoming Events | Displays available upcoming events |
| Event Details | Shows event information and Join Event action |
| Login | Email/password and Google authentication |
| Register | New user registration |
| Create Event | Create a new community event |
| Manage Events | View, edit, and delete created events |
| Edit Event | Update an existing event |
| Joined Events | View events joined by the logged-in user |

---

## 🔐 Authentication and Authorization

TogetherForGood uses Better Auth to handle user authentication.

- Users can register using email and password.
- Users can sign in with Google.
- Protected pages require a logged-in user.
- Private API requests use authentication tokens.
- Users can edit or delete only their own events.
- Duplicate event joining is prevented.

---

## 📦 Installation and Local Setup

Follow these steps to run the frontend locally.

### 1. Clone the Repository

```bash
git clone https://github.com/fatemakhatun21/together-for-good-client.git
```

### 2. Navigate to the Project

```bash
cd together-for-good-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

Add the following variables:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_API_URL=https://together-for-good-server.onrender.com
```

Replace the placeholder values with your own credentials.

**Important:** Never commit `.env.local` or expose your secret keys publicly.

### 5. Run the Development Server

```bash
npm run dev
```

### 6. Open the Application

Visit:

http://localhost:3000

The frontend uses the deployed Render API by default when configured with the API URL shown above.

---

## 🧪 Production Build

To generate a production build, run:

```bash
npm run build
```

To start the production server locally after building:

```bash
npm start
```

---

## 📱 Responsive Experience

TogetherForGood includes responsive layouts for:

- Mobile devices
- Tablets
- Laptops
- Desktop screens

The interface includes a responsive navigation menu, event grids, forms, cards, and footer.

---

## 🎯 Project Objective

The main objective of TogetherForGood is to provide a centralized platform for social development activities.

By connecting event organizers with volunteers and community members, the platform helps make social initiatives more accessible and encourages participation in positive community change.

---

## 👩‍💻 Developer

Developed as part of the Programming Hero Web Development course.

**GitHub:**  
https://github.com/fatemakhatun21

---

## 📜 License

This project was developed for educational and assignment purposes.