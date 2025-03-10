# Contributing to MultiLingual Company Showcase

First off, thank you for considering contributing to MultiLingual Company Showcase! It's people like you that make this project such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Exercise consideration and empathy
- Gracefully accept constructive criticism

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Your environment (OS, Node.js version, npm version)
- Steps to reproduce the issue
- Current behavior vs expected behavior
- Screenshots (if applicable)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- Detailed explanation of the proposed functionality
- Examples of how it would be used
- Why this enhancement would be useful

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints

### Development Process

1. Clone the repository
```bash
git clone https://github.com/yourusername/multilingual-company-showcase.git
```

2. Create a branch
```bash
git checkout -b feature/your-feature-name
```

3. Set up development environment
```bash
npm install
npm run dev
```

4. Make your changes and test them

5. Commit your changes
```bash
git add .
git commit -m "feat: add your feature description"
```

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat: add Chinese language support
fix: resolve image lazy loading issue
docs: update installation instructions
```

### Adding New Languages

1. Create a new translation file:
```
public/locales/[lang]/common.json
```

2. Add translations following the existing format
3. Update language switcher component
4. Test the new language implementation

### Style Guide

- Use TypeScript for new components
- Follow existing code formatting
- Add comments for complex logic
- Keep components focused and reusable

### Testing

Before submitting a PR:

```bash
# Run tests
npm run test

# Check types
npm run type-check

# Lint code
npm run lint
```

### Documentation

- Update README.md if needed
- Add JSDoc comments for new functions
- Update API documentation if applicable

## Questions?

Feel free to contact us if you have any questions. Opening an issue is a great way to reach us.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.