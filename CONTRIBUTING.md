# Contributing to VitalOps

Thank you for considering contributing to VitalOps! This document provides guidelines and instructions for contributing.

## Development Process

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-org/vitalops.git
   cd vitalops
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Changes**
   - Follow the existing code style
   - Write meaningful commit messages
   - Test your changes thoroughly

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug in asset module"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes clearly

## Commit Message Convention

We follow the Conventional Commits specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add QR code scanning for assets
fix: resolve authentication token expiry issue
docs: update API reference for rental endpoints
refactor: improve error handling in payment service
```

## Code Style

### TypeScript
- Use TypeScript for all new code
- Avoid `any` type when possible
- Use meaningful variable and function names
- Add JSDoc comments for public functions

### Backend
- Follow Controller → Service → Prisma pattern
- Keep controllers thin (delegation only)
- Put business logic in services
- Use async/await for asynchronous operations

### Frontend
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Follow Tailwind CSS utility-first approach

## Adding a New Module

### Backend Module

1. Create module directory:
   ```bash
   mkdir -p apps/backend-api/src/modules/your-module
   ```

2. Create files:
   ```
   your-module/
   ├── your-module.routes.ts
   ├── your-module.controller.ts
   └── your-module.service.ts
   ```

3. Add route to main router:
   ```typescript
   // apps/backend-api/src/routes/index.ts
   import yourModuleRoutes from '../modules/your-module/your-module.routes';
   router.use('/your-module', yourModuleRoutes);
   ```

4. Update Prisma schema if needed:
   ```bash
   cd apps/backend-api
   npx prisma migrate dev --name add_your_module
   ```

5. Document API endpoints in `docs/API_REFERENCE.md`

### Frontend Page

1. Create page in admin-web:
   ```bash
   mkdir -p apps/admin-web/src/app/your-page
   touch apps/admin-web/src/app/your-page/page.tsx
   ```

2. Create mobile screen:
   ```bash
   touch apps/mobile-app/app/your-screen.tsx
   ```

## Testing Guidelines

### Backend Tests
```bash
cd apps/backend-api
npm test
```

### Integration Tests
- Test complete flows (e.g., create asset → rent → return)
- Test error cases
- Test authentication and authorization

### Manual Testing
- Test API endpoints using Postman/Insomnia
- Test UI flows in browser and mobile device
- Verify database changes

## Documentation

When adding new features:

1. Update API reference in `docs/API_REFERENCE.md`
2. Update architecture docs if structure changes
3. Add inline code comments for complex logic
4. Update README if setup process changes

## Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: Explain what and why
- **Screenshots**: For UI changes
- **Testing**: Describe how you tested
- **Breaking Changes**: Highlight any breaking changes

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New features have tests
- [ ] Documentation updated
- [ ] No console.log statements in production code
- [ ] Environment variables documented
- [ ] Database migrations included (if applicable)

## Code Review Process

1. At least one approval required
2. All tests must pass
3. No merge conflicts
4. Documentation updated
5. Code style followed

## Questions or Issues?

- Check existing issues first
- Create a new issue with:
  - Clear title
  - Detailed description
  - Steps to reproduce (for bugs)
  - Expected vs actual behavior
  - Screenshots/logs if applicable

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Thank You!

Your contributions make VitalOps better for everyone!



