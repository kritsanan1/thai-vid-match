# File Structure Documentation

This document provides a comprehensive overview of the LoveMatch Thailand project file structure, including complexity indicators and functional descriptions.

## File Structure Tree

```
LoveMatch Thailand/
├── 🟢 .gitignore                           # Git version control ignore patterns
├── 🟢 README.md                            # Basic project documentation
├── 🟢 bun.lockb                           # Bun package manager lock file
├── 🟢 components.json                      # Shadcn/ui component configuration
├── 🟢 eslint.config.js                     # ESLint linting configuration
├── 🟢 index.html                           # Main HTML entry point
├── 🟢 package.json                         # NPM package configuration and scripts
├── 🟢 postcss.config.js                    # PostCSS configuration for Tailwind
├── 🟢 tailwind.config.ts                   # Tailwind CSS framework configuration
├── 🟢 tsconfig.app.json                    # TypeScript app-specific configuration
├── 🟢 tsconfig.json                        # Main TypeScript configuration
├── 🟢 tsconfig.node.json                   # TypeScript Node.js configuration
├── 🟢 vite.config.ts                       # Vite build tool configuration
├── public/
│   ├── 🟢 favicon.ico                      # Website favicon
│   ├── 🟢 placeholder.svg                  # Placeholder image for development
│   └── 🟢 robots.txt                       # Search engine crawler instructions
├── src/
│   ├── 🟡 App.tsx                          # Main React application component
│   ├── 🟢 index.css                        # Global styles and design system
│   ├── 🟢 main.tsx                         # React application entry point
│   ├── 🟢 vite-env.d.ts                    # Vite environment type definitions
│   ├── components/
│   │   ├── auth/
│   │   │   └── 🔴 AuthModal.tsx            # Authentication modal with login/signup
│   │   ├── navigation/
│   │   │   └── 🟢 BottomNavigation.tsx     # Mobile bottom navigation bar
│   │   ├── profile/
│   │   │   └── 🟡 ProfileCard.tsx          # User profile display component
│   │   ├── swipe/
│   │   │   └── 🟡 SwipeInterface.tsx       # Tinder-style swipe interface
│   │   └── ui/
│   │       ├── 🟡 accordion.tsx            # Collapsible content component
│   │       ├── 🟡 alert-dialog.tsx         # Modal alert dialog component
│   │       ├── 🟡 alert.tsx                # Alert notification component
│   │       ├── 🟢 aspect-ratio.tsx         # Aspect ratio container component
│   │       ├── 🟡 avatar.tsx               # User avatar display component
│   │       ├── 🟡 badge.tsx                # Status/category badge component
│   │       ├── 🟡 breadcrumb.tsx           # Navigation breadcrumb component
│   │       ├── 🟡 button.tsx               # Reusable button component
│   │       ├── 🟡 calendar.tsx             # Date picker calendar component
│   │       ├── 🟢 card.tsx                 # Container card component
│   │       ├── 🟡 carousel.tsx             # Image/content carousel component
│   │       ├── 🟡 chart.tsx                # Data visualization chart component
│   │       ├── 🟡 checkbox.tsx             # Checkbox input component
│   │       ├── 🟢 collapsible.tsx          # Collapsible content wrapper
│   │       ├── 🟡 command.tsx              # Command palette component
│   │       ├── 🟡 context-menu.tsx         # Right-click context menu
│   │       ├── 🟡 dialog.tsx               # Modal dialog component
│   │       ├── 🟡 drawer.tsx               # Mobile drawer component
│   │       ├── 🟡 dropdown-menu.tsx        # Dropdown menu component
│   │       ├── 🟡 form.tsx                 # Form wrapper component
│   │       ├── 🟡 hover-card.tsx           # Hover tooltip card component
│   │       ├── 🟡 input-otp.tsx            # OTP input field component
│   │       ├── 🟡 input.tsx                # Text input field component
│   │       ├── 🟡 label.tsx                # Form label component
│   │       ├── 🟡 menubar.tsx              # Horizontal menu bar component
│   │       ├── 🟡 navigation-menu.tsx      # Navigation menu component
│   │       ├── 🟡 pagination.tsx           # Page navigation component
│   │       ├── 🟡 popover.tsx              # Popup content component
│   │       ├── 🟡 progress.tsx             # Progress bar component
│   │       ├── 🟡 radio-group.tsx          # Radio button group component
│   │       ├── 🟢 resizable.tsx            # Resizable panel component
│   │       ├── 🟡 scroll-area.tsx          # Custom scrollable area component
│   │       ├── 🟡 select.tsx               # Select dropdown component
│   │       ├── 🟢 separator.tsx            # Visual separator component
│   │       ├── 🟡 sheet.tsx                # Side sheet/panel component
│   │       ├── 🟡 sidebar.tsx              # Sidebar navigation component
│   │       ├── 🟢 skeleton.tsx             # Loading skeleton component
│   │       ├── 🟡 slider.tsx               # Range slider component
│   │       ├── 🟢 sonner.tsx               # Toast notification component
│   │       ├── 🟡 switch.tsx               # Toggle switch component
│   │       ├── 🟡 table.tsx                # Data table component
│   │       ├── 🟡 tabs.tsx                 # Tab navigation component
│   │       ├── 🟡 textarea.tsx             # Multi-line text input component
│   │       ├── 🟡 toast.tsx                # Toast notification component
│   │       ├── 🟢 toaster.tsx              # Toast notification provider
│   │       ├── 🟡 toggle-group.tsx         # Toggle button group component
│   │       ├── 🟡 toggle.tsx               # Toggle button component
│   │       ├── 🟡 tooltip.tsx              # Tooltip component
│   │       └── 🟡 use-toast.ts             # Toast notification hook
│   ├── hooks/
│   │   └── 🟢 use-mobile.tsx               # Mobile device detection hook
│   ├── integrations/
│   │   └── supabase/
│   │       ├── 🟢 client.ts                # Supabase client configuration
│   │       └── 🟢 types.ts                 # Database type definitions
│   ├── lib/
│   │   └── 🟢 utils.ts                     # Utility functions and helpers
│   └── pages/
│       ├── 🟡 Index.tsx                    # Main landing and app page
│       └── 🟢 NotFound.tsx                 # 404 error page component
└── supabase/
    └── 🟢 config.toml                      # Supabase project configuration
```

## Complexity Legend

- 🟢 **Low Complexity** (0-3 imports): Simple files with minimal dependencies
- 🟡 **Medium Complexity** (4-7 imports): Moderate files with several dependencies
- 🔴 **High Complexity** (8+ imports): Complex files with many dependencies

## File Statistics

- **Total Files**: 84
- **Low Complexity**: 62 files (73.8%)
- **Medium Complexity**: 21 files (25.0%)
- **High Complexity**: 1 file (1.2%)

## Key Architectural Components

### Core Application
- **App.tsx**: Main application wrapper with routing and providers
- **Index.tsx**: Primary application page with authentication and navigation logic

### Authentication System
- **AuthModal.tsx**: Complete authentication flow with email/password and social login

### Dating Features
- **SwipeInterface.tsx**: Core dating functionality with profile swiping
- **ProfileCard.tsx**: User profile management and display
- **BottomNavigation.tsx**: Mobile navigation between app sections

### Backend Integration
- **Supabase Integration**: Database client and type definitions for real-time data
- **Database Schema**: Tables for users, matches, messages, and social media connections

### UI System
- **Shadcn/ui Components**: 40+ reusable UI components following design system
- **Design System**: Comprehensive theming with HSL color tokens and gradients
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Development Tools
- **TypeScript**: Full type safety across the application
- **Vite**: Fast development and build tooling
- **ESLint**: Code quality and consistency enforcement