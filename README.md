
# ZSH Config Builder
<small>Readme mostly AI generated so have to edit someday</small>


A visual editor for creating and managing modular ZSH/Bash configurations. Split your monolithic `.zshrc` into maintainable, focused modules with a beautiful drag-and-drop interface.

![ZSH Config Builder Screenshot](https://source.unsplash.com/random/1200x630/?code)

## Local development if you want that for some reason

1. `git clone https://github.com/remcostoeten/zsh-config-builder.git`
2. Run `pnpm install`
3. Start the dev server: `pnpm dev`

Not mandatory to run but if you want oauth2 to work and a database you need to set up the following:

1. `cp .env.example .env`
2. If you have the turso CLI installed run `pnpm gen:db` and paste those keys in the `.env`. Otherwise go to https://turso.tech/ and create a new database.
3. Retrieve github client id and secret from https://github.com/settings/applications/new
4. run `pnpm gen` to generate the schema and `pnpm dbpush` to push it to the database. If that doesn't work run `pnpm drizzle-kit generate` and `the same but push`
5. `git checkout master; git pull; git checkout -b feature/yourcontribution;git push

## ✨ Features

- 🎨 Visual node-based editor for ZSH configurations
- 📦 Split configs into modular, reusable files
- ✅ Real-time shell syntax validation
- 🔌 Smart dependency management
- 💡 Built-in shell scripting helpers and snippets
- 🎯 Drag-and-drop interface
- 🚀 One-click command generation

## 🛠️ Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- Monaco Edito
- Shell-parse for validation

## 📦 Project Structure

```
src/
  ├── components/     # React components
  ├── hooks/         # Custom React hooks
  ├── utils/         # Utility functions
  ├── types/         # TypeScript types
  └── config/        # App configuration
```

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
