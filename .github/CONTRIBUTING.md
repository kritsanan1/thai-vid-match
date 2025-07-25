# Contributing to LoveMatch Thailand 💕

Thank you for your interest in contributing to LoveMatch Thailand! This document provides guidelines and information for contributors.

## 🌟 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Modern browser (Chrome, Firefox, Safari, Edge)

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/lovematch-thailand.git
   cd lovematch-thailand
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Verify setup**
   - Open http://localhost:8080
   - Ensure the app loads correctly
   - Check that hot reload works

## 📋 How to Contribute

### 🐛 Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/your-org/lovematch-thailand/issues)
2. Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)
3. Provide detailed information:
   - Steps to reproduce
   - Expected vs actual behavior
   - Device/browser information
   - Screenshots if applicable

### 💡 Suggesting Features

1. Check if the feature has been suggested in [Issues](https://github.com/your-org/lovematch-thailand/issues)
2. Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)
3. Provide detailed information:
   - Problem statement
   - Proposed solution
   - User value and impact
   - Technical considerations

### 🔧 Contributing Code

#### Branch Naming Convention

```
[type]/[ticket-number]-[brief-description]

Types:
- feature/   : New features
- bugfix/    : Bug fixes
- hotfix/    : Critical fixes
- chore/     : Maintenance tasks
- docs/      : Documentation updates

Examples:
- feature/LMT-123-video-profile-upload
- bugfix/LMT-456-swipe-animation-fix
- hotfix/LMT-789-security-patch
```

#### Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/LMT-123-your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards (see below)
   - Write tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint        # Check code style
   npm run build       # Ensure build works
   npx tsc --noEmit    # Check TypeScript types
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(profile): add video upload functionality"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/LMT-123-your-feature-name
   ```

## 📏 Coding Standards

### TypeScript Guidelines

- **Strict typing**: Use TypeScript strictly, avoid `any`
- **Interface definitions**: Define clear interfaces for props and data
- **Proper imports**: Use path aliases (`@/components/...`)

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  age: number;
}

const ProfileCard: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  return <div>{profile.name}</div>;
};

// ❌ Avoid
const ProfileCard = ({ profile }: any) => {
  return <div>{profile.name}</div>;
};
```

### React Best Practices

- **Functional components**: Use function components with hooks
- **Component naming**: Use PascalCase for components
- **Props interfaces**: Define clear prop interfaces
- **Custom hooks**: Extract reusable logic into custom hooks

```typescript
// ✅ Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary' }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Styling Guidelines

- **Tailwind classes**: Use Tailwind utility classes
- **Design system**: Follow the established design tokens
- **Responsive design**: Mobile-first approach
- **Dark mode**: Consider dark mode support

```typescript
// ✅ Good - Using design system tokens
<button className="btn-love shadow-glow">
  Like
</button>

// ❌ Avoid - Direct styling
<button className="bg-pink-500 text-white px-4 py-2 rounded">
  Like
</button>
```

### File Organization

- **Feature-based structure**: Group related files together
- **Index exports**: Use barrel exports for clean imports
- **Component co-location**: Keep related files close together

```
src/features/auth/
├── components/
│   ├── AuthModal.tsx
│   └── LoginForm.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useLogin.ts
├── services/
│   └── authService.ts
└── index.ts          # Barrel export
```

### Testing Guidelines

- **Unit tests**: Test individual components and functions
- **Integration tests**: Test component interactions
- **User-focused tests**: Test from user perspective

```typescript
// ✅ Good test structure
describe('AuthModal', () => {
  it('should show login form by default', () => {
    render(<AuthModal />);
    expect(screen.getByText('เข้าสู่ระบบ')).toBeInTheDocument();
  });

  it('should switch to signup form when tab clicked', async () => {
    render(<AuthModal />);
    await user.click(screen.getByText('สมัครสมาชิก'));
    expect(screen.getByText('สร้างบัญชีใหม่')).toBeInTheDocument();
  });
});
```

## 📝 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add social media login integration
fix(swipe): resolve animation performance issue
docs(readme): update installation instructions
style(ui): improve button hover animations
refactor(profile): extract profile logic to custom hook
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Writing Tests

- **Test behavior, not implementation**: Focus on what users experience
- **Use Testing Library**: Follow testing-library best practices
- **Mock external dependencies**: Mock APIs and third-party services
- **Test accessibility**: Include accessibility tests

## 📚 Documentation

### Code Documentation

- **JSDoc comments**: Document complex functions
- **README updates**: Update relevant documentation
- **Component documentation**: Document component props and usage

```typescript
/**
 * Displays a user profile card with swipe functionality
 * @param profile - User profile data
 * @param onSwipe - Callback when user swipes
 * @param className - Additional CSS classes
 */
interface ProfileCardProps {
  profile: UserProfile;
  onSwipe: (direction: 'left' | 'right') => void;
  className?: string;
}
```

### Documentation Updates

When making changes that affect:
- Public APIs
- User workflows
- Installation/setup
- Configuration

Please update the relevant documentation files.

## 🔍 Code Review Process

### For Contributors

1. **Self-review**: Review your own code before submitting
2. **Complete PR template**: Fill out all relevant sections
3. **Respond to feedback**: Address review comments promptly
4. **Update based on feedback**: Make requested changes

### For Reviewers

1. **Be constructive**: Provide helpful, specific feedback
2. **Check functionality**: Verify the changes work as intended
3. **Consider edge cases**: Think about potential issues
4. **Approve when ready**: Approve PRs that meet standards

### Review Criteria

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Performance impact is acceptable
- [ ] Security considerations are addressed
- [ ] Accessibility standards are met

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Workflow

1. **Feature freeze**: Stop adding new features
2. **Testing phase**: Comprehensive testing
3. **Release candidate**: Create RC for final testing
4. **Production release**: Deploy to production
5. **Post-release monitoring**: Monitor for issues

## 🆘 Getting Help

### Community Support

- **Discord**: [Join our Discord server](https://discord.gg/lovematch-thailand)
- **Discussions**: Use GitHub Discussions for questions
- **Stack Overflow**: Tag questions with `lovematch-thailand`

### Maintainer Contact

- **Email**: developers@lovematch-thailand.com
- **GitHub**: @maintainer-username
- **Discord**: @maintainer#1234

## 📄 License

By contributing to LoveMatch Thailand, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## 🙏 Recognition

Contributors are recognized in:
- **Contributors file**: [CONTRIBUTORS.md](CONTRIBUTORS.md)
- **Release notes**: Major contributions highlighted
- **Hall of Fame**: Top contributors featured on website

Thank you for making LoveMatch Thailand better! 💕