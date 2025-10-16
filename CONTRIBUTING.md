# 🤝 Contributing to Bitgame

Thank you for your interest in contributing to Bitgame! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/bitgame.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -m "feat: add awesome feature"`
7. Push: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

See [QUICK_START.md](./QUICK_START.md) for local development setup.

## Project Structure

- `apps/web/` - Frontend React application
- `apps/api/` - Backend Express server
- `apps/contracts/` - Clarity smart contracts
- `games-external/` - External HTML games
- `tools/` - Build and sync utilities

## How to Contribute

### 🎮 Adding a New Game

#### React Game (Internal)

1. Create game folder:
```bash
mkdir -p apps/web/src/games/your-game
```

2. Add `manifest.json`:
```json
{
  "slug": "your-game",
  "name": "Your Game",
  "description": "Description here",
  "thumbnail": "/games/your-game-thumb.png",
  "type": "react",
  "category": "arcade"
}
```

3. Create `index.tsx`:
```tsx
import { useState, useEffect } from 'react';
import BitgameBridge from '../../sdk/BitgameBridge';

export default function YourGame() {
  const [score, setScore] = useState(0);

  const endGame = () => {
    const bridge = new BitgameBridge();
    bridge.gameOver(score);
  };

  return (
    <div>
      {/* Your game UI */}
    </div>
  );
}
```

4. Add to seed data in `apps/api/src/seed.ts`

#### HTML Game (External)

1. Create game folder:
```bash
mkdir -p games-external/your-game
```

2. Add `manifest.json`:
```json
{
  "slug": "your-game",
  "name": "Your Game",
  "description": "Description here",
  "thumbnail": "/games/your-game-thumb.png",
  "type": "html",
  "category": "casual"
}
```

3. Create `index.html` with game logic

4. Send game-over message:
```javascript
window.parent.postMessage({
  type: 'bitgame',
  event: 'game-over',
  data: { score: yourScore, metadata: {} }
}, '*');
```

5. Sync: `pnpm sync:games`

### 🐛 Reporting Bugs

Create an issue with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

### 💡 Suggesting Features

Create an issue with:
- Clear description
- Use cases
- Mockups or examples if possible
- Potential implementation approach

### 📝 Code Style

- **TypeScript**: Strict mode enabled
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Formatting**: Let Prettier handle it
- **Comments**: Document complex logic

### ✅ Code Quality Checklist

Before submitting PR:

- [ ] Code follows TypeScript strict mode
- [ ] All existing tests pass
- [ ] New features have tests (if applicable)
- [ ] No console.logs in production code
- [ ] Meaningful commit messages
- [ ] Updated documentation if needed
- [ ] No breaking changes (or clearly documented)

### 🧪 Testing

```bash
# Backend tests
cd apps/api
pnpm test

# Frontend tests
cd apps/web
pnpm test

# Smart contract tests
cd apps/contracts
clarinet test
```

### 📚 Documentation

Update relevant docs when:
- Adding new features
- Changing APIs
- Modifying architecture
- Adding environment variables

## Pull Request Process

1. **Title**: Use conventional commits format
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code restructuring
   - `test:` - Adding tests
   - `chore:` - Maintenance

2. **Description**: 
   - What changes were made
   - Why they were made
   - How to test them

3. **Screenshots**: Add for UI changes

4. **Breaking Changes**: Clearly mark and explain

5. **Linked Issues**: Reference related issues

## Smart Contract Contributions

When modifying Clarity contracts:

1. Update tests in `tests/` folder
2. Run `clarinet check`
3. Run `clarinet test`
4. Document new functions
5. Consider gas costs
6. Test on devnet before PR

## Community Guidelines

- Be respectful and inclusive
- Help newcomers
- Provide constructive feedback
- Stay on topic in discussions
- Follow code of conduct

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Open an issue for questions
- Join discussions in GitHub Discussions
- Check existing issues and PRs first

Thank you for making Bitgame better! 🎮✨





