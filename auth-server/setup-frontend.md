# Frontend Setup Instructions

## 🚀 Quick Start

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Frontend
```bash
npm run dev
```

The frontend will run on `http://localhost:3001`

## 🔧 Prerequisites

Make sure your backend is running first:
```bash
# In the root directory (backend)
node app.js
```

## 📱 Features

### ✅ What's Working
- **Login/Logout** - Full authentication flow
- **Automatic Token Refresh** - Seamless token management
- **Todo Management** - Create and view todos
- **RLS Integration** - User-specific data protection
- **Modern UI** - Clean, responsive design

### 🎯 Demo Credentials
- **Email:** user@example.com
- **Password:** 123456

## 🔄 How It Works

1. **Login** → Gets access token (15min) + refresh token (7 days)
2. **API Calls** → Automatically includes auth headers
3. **Token Expiry** → Automatically refreshes tokens
4. **RLS Protection** → Only shows user's own todos
5. **Logout** → Clears all tokens

## 🛠️ Development

### File Structure
```
frontend/
├── app/                    # Next.js pages
├── components/            # React components
├── lib/                   # API and auth utilities
└── package.json          # Dependencies
```

### Key Files
- `lib/api.ts` - API client with interceptors
- `lib/auth.ts` - Authentication context
- `components/LoginPage.tsx` - Login form
- `components/Dashboard.tsx` - Main app with todos

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure backend is running on port 3000
   - Check `next.config.js` proxy settings

2. **Login Fails**
   - Verify demo credentials
   - Check browser console for errors

3. **Todos Not Loading**
   - Check if user is authenticated
   - Verify RLS policies are working

4. **Token Refresh Issues**
   - Check browser cookies
   - Verify refresh token is valid

### Debug Steps

1. **Check Backend Status**
   ```bash
   curl http://localhost:3000/login
   ```

2. **Check Frontend Status**
   ```bash
   curl http://localhost:3001
   ```

3. **Browser Developer Tools**
   - Network tab to see API calls
   - Application tab to check cookies
   - Console for error messages

## 🎨 Customization

### Styling
- Uses Tailwind CSS
- Modify `globals.css` for custom styles
- Update `tailwind.config.ts` for theme changes

### API Configuration
- Update `lib/api.ts` for different backend URLs
- Modify interceptors for custom auth logic

### Components
- Add new components in `components/` directory
- Update routing in `app/` directory

## 📦 Production Build

```bash
npm run build
npm start
```

## 🔐 Security Notes

- Tokens stored in HTTP-only cookies
- Automatic CSRF protection
- Secure token refresh flow
- RLS ensures data isolation
