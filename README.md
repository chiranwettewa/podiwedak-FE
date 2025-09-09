# PodiWedak.com - Airtasker Clone Frontend

A beautiful, modern, and responsive frontend for a task marketplace application built with ReactJS.

## Features

### 🌟 Core Features
- **Multi-language Support** (English & Sinhala) with react-i18next
- **Dark/Light Mode Toggle** with persistent theme
- **Responsive Design** - Mobile-first approach
- **Beautiful UI/UX** with TailwindCSS and Framer Motion animations

### 🔐 Authentication
- SSO Login (Google, Facebook) - UI ready
- Mobile number signup/login with OTP
- Email/password authentication

### 📋 Task Management
- Browse tasks with search and filters
- Post new tasks with photos, budget, location
- Task categories and subcategories
- Location-based search (map integration ready)
- Make offers and apply for tasks

### 👤 User Features
- User dashboard with statistics
- Profile management with portfolio
- Ratings and reviews system
- Verification badges
- Skills and bio management

### 💰 Additional Features
- Wallet/balance page (mock UI)
- Messaging/chat interface (mock)
- Notifications system
- Dispute resolution UI
- Promo codes/discounts UI
- Help & support pages

## Tech Stack

- **React 18** - Frontend framework
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **react-i18next** - Internationalization
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Navbar.js
│   ├── tasks/
│   │   └── TaskCard.js
│   └── ui/
│       ├── Button.js
│       └── Input.js
├── contexts/
│   └── ThemeContext.js
├── i18n/
│   └── index.js
├── pages/
│   ├── Home.js
│   ├── TaskList.js
│   ├── PostTask.js
│   ├── Auth.js
│   ├── Dashboard.js
│   └── Profile.js
├── App.js
├── index.js
└── index.css
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Key Components

### Pages
- **Home** - Landing page with hero section and categories
- **TaskList** - Browse tasks with filters and search
- **PostTask** - Create new tasks with photos and details
- **Auth** - Login/signup with SSO and OTP options
- **Dashboard** - User dashboard with statistics and recent tasks
- **Profile** - User profile with portfolio and reviews

### Reusable Components
- **Button** - Customizable button with variants and animations
- **Input** - Form input with validation and styling
- **TaskCard** - Task display card with hover effects
- **Navbar** - Navigation with language toggle and theme switch

### Features Ready for Backend Integration
- User authentication (SSO, OTP, email/password)
- Task CRUD operations
- File upload for photos
- Real-time messaging
- Payment processing
- Map integration
- Push notifications

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
  },
  // Add your colors
}
```

### Languages
Add new languages in `src/i18n/index.js`:

```javascript
const resources = {
  en: { translation: { /* English translations */ } },
  si: { translation: { /* Sinhala translations */ } },
  // Add new language
  ta: { translation: { /* Tamil translations */ } }
};
```

## Mock Data & Integration Points

The application includes mock data for:
- User profiles and authentication
- Task listings and details
- Reviews and ratings
- Notifications
- Payment transactions

### Ready for Backend Integration:
- REST API calls (replace mock functions)
- WebSocket for real-time chat
- File upload endpoints
- Payment gateway integration
- Map services (Google Maps API)
- Push notification services

## Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Performance Features

- Lazy loading ready
- Image optimization
- Component-based architecture
- Efficient re-rendering with React hooks
- Smooth animations with Framer Motion

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
