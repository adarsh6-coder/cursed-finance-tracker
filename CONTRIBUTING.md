# 🤝 Contributing to Cursed Finance Tracker

First off, thank you for considering contributing to Cursed Finance Tracker! It's people like you that make this project awesome. 🌀

## 📋 Code of Conduct

Be respectful, inclusive, and constructive. We're all here to learn and build something great together!

## 🚀 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Python version, browser)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### 🔧 Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request**

## 💻 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/cursed-finance-tracker.git
cd cursed-finance-tracker

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

## 📝 Coding Standards

### Python
- Follow **PEP 8** style guide
- Use **meaningful variable names**
- Write **docstrings** for functions/classes
- Keep functions **small and focused**
- Add **type hints** where appropriate

### JavaScript
- Use **ES6+ features**
- Follow **camelCase** naming
- Write **comments** for complex logic
- Keep functions **pure** when possible
- Use **const/let** instead of var

### CSS
- Use **CSS variables** for theming
- Follow **BEM naming** convention where applicable
- Keep selectors **specific but not overly nested**
- Comment **complex animations**

### Git Commits
- Use **present tense** ("Add feature" not "Added feature")
- Use **imperative mood** ("Move cursor to..." not "Moves cursor to...")
- Limit first line to **72 characters**
- Reference **issues and pull requests**

Example:
```
Add domain expansion animation to login page

- Implement rotating circles with gradient
- Add sound effect on button click
- Update CSS variables for new colors

Fixes #123
```

## 🧪 Testing

Before submitting a PR, ensure:
- [ ] All existing tests pass
- [ ] New features have tests
- [ ] Code is linted (flake8 for Python)
- [ ] No console errors in browser

```bash
# Run Django tests
python manage.py test

# Run linter
flake8 .
```

## 📚 Documentation

- Update **README.md** for new features
- Add **comments** for complex code
- Update **JJK_THEME_FEATURES.md** for theme changes
- Include **screenshots** for UI changes

## 🎨 JJK Theme Guidelines

When adding JJK-themed features:
- Use the **established color palette**
- Add **appropriate sound effects**
- Include **smooth animations**
- Reference **JJK characters/techniques** creatively
- Maintain **dark theme** aesthetic

## 🌟 Recognition

Contributors will be added to the README! We appreciate your help in making this project better.

## ❓ Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

---

**Happy Coding! 🌀 呪術廻戦**
