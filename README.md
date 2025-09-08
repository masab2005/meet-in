## MeetIN

A minimal messaging app built with Next.js App Router, credential-based auth, and MongoDB. It supports user registration/login, password reset via email, profile picture upload, direct messages, recent chats, and account deletion.

### Features
- **Auth**: Credentials login with `next-auth` (JWT strategy)
- **User management**: Register, find users, delete account
- **Password reset**: Email token flow with `nodemailer`
- **Messaging**: Send and fetch messages, view previous chat partners
- **Profile pictures**: Upload/remove via UploadThing
- **State/session**: `zustand` store, `next-auth` session provider

### Tech Stack
- **Frontend/Runtime**: Next.js 15 (App Router), React 19, TypeScript
- **Database**: MongoDB with Mongoose
- **Auth**: next-auth (Credentials)
- **Uploads**: uploadthing
- **Email**: nodemailer (Gmail example)
- **UI/Utils**: Tailwind CSS 4, tailwindcss-animate, framer-motion, lucide-react, clsx

### Getting Started
1) Clone and install
```bash
npm install
```

2) Create `.env.local` in `meet-in/`
```bash
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_long_random_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Gmail example)
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_app_password

# UploadThing (if required by your setup)
UPLOADTHING_SECRET=your_uploadthing_secret
NEXT_PUBLIC_UPLOADTHING_APP_ID=your_uploadthing_app_id
```

3) Run the app
```bash
npm run dev
```
App runs on `http://localhost:3000`.

### Scripts
- `npm run dev`: Start dev server (Turbopack)
- `npm run build`: Production build
- `npm run start`: Start production server
- `npm run lint`: Lint

### API Overview (App Router)
- `POST /api/auth/register` – register user
- `GET|POST /api/auth/[...nextauth]` – next-auth routes
- `POST /api/sendResetPasswordEmail?email=...` – send reset link
- `POST /api/resetPassword` – reset password with token
- `POST /api/findUser` – lookup by name/email/id
- `POST /api/setMessage` – create message
- `POST /api/getMessage` – fetch last messages between two users
- `GET /api/previousChats/:id` – list users previously chatted with
- `DELETE /api/deleteAccount` – delete own account and messages
- `POST /api/removeProfilePic` – clear profile picture
- `GET|POST /api/uploadthing` – UploadThing route handler

### Data Models (Mongoose)
- `User`: name, email, password (hashed), profilePicture, online, socketId, resetPasswordToken/Expire
- `Message`: from, to, content, timestamps

### Project Structure
```text
app/
  api/                # Route handlers
  (pages)/            # App Router pages (login, register, chat, etc.)
lib/                  # Auth options, DB connection, stores, utils
models/               # Mongoose models (User, Message)
public/               # Static assets
```

### Environment Notes
- Ensure MongoDB is reachable via `MONGODB_URI` before starting.
- For password reset, configure Gmail App Passwords or your SMTP provider.
- UploadThing requires valid credentials; see UploadThing docs for obtaining keys.

### Deployment
- Works well on Vercel. Configure all environment variables in the hosting provider.

---
If you run into issues, check server logs and verify environment variables are set correctly.


