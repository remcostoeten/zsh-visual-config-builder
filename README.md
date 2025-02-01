# ZSH Config Builder

A visual editor for creating and managing modular ZSH configurations. Split your monolithic `.zshrc` into maintainable, focused modules with a beautiful drag-and-drop interface.

![ZSH Config Builder Screenshot](https://source.unsplash.com/random/1200x630/?code)

## ✨ Features

- 🎨 Visual node-based editor for ZSH configurations
- 📦 Split configs into modular, reusable files
- ✅ Real-time shell syntax validation
- 🔌 Smart dependency management
- 💡 Built-in shell scripting helpers and snippets
- 🎯 Drag-and-drop interface
- 🚀 One-click command generation
- 🔒 GitHub authentication for saving configurations
- ☁️ Cloud sync with GitHub Gists

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zsh-config-builder.git
cd zsh-config-builder
```

2. Install dependencies:
```bash
# Install frontend dependencies
pnpm install

# Install server dependencies
cd server && pnpm install
```

3. Set up environment variables:
```bash
# In server/.env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
PORT=3001

# In .env
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

4. Start development servers:
```bash
pnpm start
```

## 🛠️ Tech Stack

- React + TypeScript
- Tailwind CSS
- Monaco Editor
- Express.js backend
- GitHub OAuth
- Shell-parse for validation
- Zustand for state management

## 📝 Development

```bash
# Start both frontend and backend
pnpm start

# Start only frontend
pnpm dev

# Start only backend
pnpm server

# Build for production
pnpm build

# Format code
pnpm f
```

## 📦 Project Structure

```
.
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── features/         # Feature modules
│   │   ├── auth/        # Authentication
│   │   ├── canvas/      # Editor canvas
│   │   └── persistence/ # Storage & sync
│   └── types/           # TypeScript types
├── server/              # Backend server
│   ├── index.ts         # Server entry point
│   └── auth.ts          # OAuth handlers
└── package.json         # Project configuration
```

## 🔒 Authentication

The application uses GitHub OAuth for authentication, allowing users to:
- Save configurations to GitHub Gists
- Sync configurations across devices
- Share configurations with others

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📜 License

MIT License - See [LICENSE](LICENSE) for details

## 👥 Authors

- [@remcostoeten](https://github.com/remcostoeten) - Initial work