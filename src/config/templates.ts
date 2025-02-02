import { ConfigNode } from '@/types/config'
import { generateId } from '@/utils/generateId'

const createTemplate = (nodes: Partial<ConfigNode>[]): ConfigNode => ({
    id: 'main',
    title: '.zshrc',
    type: 'main',
    level: 0,
    content: `# Shell Configuration
# Generated with Shell Config Builder

# Create Shell Config directory structure
[ ! -d ~/.zsh ] && mkdir -p ~/.zsh/{core,git,node,docker}

# Source all configuration files
# Strategy 1: Simple wildcard with error check
for config_file (~/.zsh/**/*.sh) {
  [ -r "\$config_file" ] && source "\$config_file"
}

# Strategy 2: Module-specific sourcing
modules=(
  core    # Base Shell Configuration
  git     # Git integration
  node    # Node.js development
  docker  # Docker tools
)

for module in \$modules; do
  if [ -d "\$HOME/.zsh/\$module" ]; then
    for config_file ("\$HOME/.zsh/\$module"/*.sh); do
      [ -r "\$config_file" ] && source "\$config_file"
    done
  fi
}`,
    children: nodes.map(node => ({
        id: generateId(),
        level: 1,
        ...node,
        children: node.children?.map(child => ({
            id: generateId(),
            level: 2,
            ...child
        }))
    }))
})

export const devTemplate = createTemplate([
    {
        title: 'core.sh',
        type: 'injector',
        content:
            '# Core Shell Configuration\nsource ~/.zsh/core/history.sh\nsource ~/.zsh/core/completion.sh\nsource ~/.zsh/core/keybindings.sh\nsource ~/.zsh/core/options.sh',
        children: [
            {
                title: 'history.sh',
                type: 'partial',
                content: `# History configuration
HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000

# History options
setopt EXTENDED_HISTORY       # Write timestamps to history
setopt HIST_EXPIRE_DUPS_FIRST # Expire duplicate entries first
setopt HIST_IGNORE_DUPS       # Don't record duplicates
setopt HIST_IGNORE_SPACE      # Don't record entries starting with space
setopt HIST_VERIFY           # Show command before executing from history
setopt SHARE_HISTORY         # Share history between sessions`
            },
            {
                title: 'completion.sh',
                type: 'partial',
                content: `# Initialize completion system
autoload -Uz compinit && compinit

# Completion options
zstyle ':completion:*' menu select
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}' # Case insensitive
zstyle ':completion:*' list-colors ''
zstyle ':completion:*:*:kill:*:processes' list-colors '=(#b) #([0-9]#) ([0-9a-z-]#)*=01;34=0=01'

# Cache completion
zstyle ':completion::complete:*' use-cache 1
zstyle ':completion::complete:*' cache-path $ZSH_CACHE_DIR`
            },
            {
                title: 'keybindings.sh',
                type: 'partial',
                content: `# Vim mode
bindkey -v
export KEYTIMEOUT=1

# Use vim keys in tab complete menu
bindkey -M menuselect 'h' vi-backward-char
bindkey -M menuselect 'k' vi-up-line-or-history
bindkey -M menuselect 'l' vi-forward-char
bindkey -M menuselect 'j' vi-down-line-or-history

# Reverse search
bindkey '^R' history-incremental-search-backward

# Edit command in editor
autoload -z edit-command-line
zle -N edit-command-line
bindkey "^X^E" edit-command-line`
            }
        ]
    },
    {
        title: 'git.sh',
        type: 'injector',
        content:
            '# Git configuration\nsource ~/.zsh/git/aliases.sh\nsource ~/.zsh/git/functions.sh\nsource ~/.zsh/git/prompt.sh\nsource ~/.zsh/git/workflow.sh',
        children: [
            {
                title: 'aliases.sh',
                type: 'partial',
                content: `# Git aliases
alias g='git'
alias ga='git add'
alias gaa='git add --all'
alias gb='git branch'
alias gba='git branch -a'
alias gbd='git branch -d'
alias gc='git commit -v'
alias gc!='git commit -v --amend'
alias gcn!='git commit -v --no-edit --amend'
alias gco='git checkout'
alias gcb='git checkout -b'
alias gcm='git checkout main'
alias gcd='git checkout develop'
alias gd='git diff'
alias gf='git fetch'
alias gl='git pull'
alias gp='git push'
alias gpf='git push --force-with-lease'
alias gst='git status'
alias grb='git rebase'
alias grbm='git rebase main'
alias grbc='git rebase --continue'
alias grba='git rebase --abort'`
            },
            {
                title: 'functions.sh',
                type: 'partial',
                content: `# Git utility functions

# Clean merged branches
gclean() {
  git branch --merged | grep -v "\\*\\|main\\|master\\|develop" | xargs -n 1 git branch -d
}

# Create feature branch
gfeat() {
  git checkout -b "feature/$1"
}

# Create bugfix branch
gfix() {
  git checkout -b "bugfix/$1"
}

# Interactive rebase last N commits
grebase() {
  git rebase -i HEAD~$1
}

# Show git history with pretty format
glog() {
  git log --graph --pretty='%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'
}

# Show modified files in last commit
gdiff() {
  git diff-tree --no-commit-id --name-only -r HEAD
}`
            },
            {
                title: 'prompt.sh',
                type: 'partial',
                content: `# Git prompt configuration
autoload -Uz vcs_info
precmd_vcs_info() { vcs_info }
precmd_functions+=( precmd_vcs_info )

# Format VCS info
zstyle ':vcs_info:git:*' formats '%b %u%c'
zstyle ':vcs_info:*' enable git
zstyle ':vcs_info:*' check-for-changes true
zstyle ':vcs_info:git:*' unstagedstr '!'
zstyle ':vcs_info:git:*' stagedstr '+'

# Set prompt
setopt PROMPT_SUBST
PROMPT='%F{green}%~%f %F{blue}\${vcs_info_msg_0_}%f $ '`
            },
            {
                title: 'workflow.sh',
                type: 'partial',
                content: `# Git workflow utilities

# Create and switch to feature branch
feature() {
  local branch="feature/$1"
  git checkout -b $branch develop
  git push -u origin $branch
}

# Create and switch to bugfix branch
bugfix() {
  local branch="bugfix/$1"
  git checkout -b $branch develop
  git push -u origin $branch
}

# Create and switch to hotfix branch
hotfix() {
  local branch="hotfix/$1"
  git checkout -b $branch main
  git push -u origin $branch
}

# Finish current feature/bugfix branch
finish() {
  local current_branch=$(git rev-parse --abbrev-ref HEAD)
  local target_branch="develop"
  
  # If hotfix, merge to main and develop
  if [[ $current_branch == hotfix/* ]]; then
    target_branch="main"
    git checkout $target_branch
    git merge --no-ff $current_branch
    git push origin $target_branch
    
    git checkout develop
    git merge --no-ff $current_branch
    git push origin develop
  else
    git checkout $target_branch
    git merge --no-ff $current_branch
    git push origin $target_branch
  fi
  
  git branch -d $current_branch
  git push origin :$current_branch
}

# Create GitHub PR
pr() {
  local branch=$(git rev-parse --abbrev-ref HEAD)
  local target="develop"
  [[ $branch == hotfix/* ]] && target="main"
  
  gh pr create --base $target --head $branch --title "$1" --body "$2"
}

# Sync all branches with remote
sync() {
  git fetch --all --prune
  git checkout main
  git pull origin main
  git checkout develop
  git pull origin develop
}`
            }
        ]
    },
    {
        title: 'node.sh',
        type: 'injector',
        content:
            '# Node.js development setup\nsource ~/.zsh/node/env.sh\nsource ~/.zsh/node/aliases.sh\nsource ~/.zsh/node/nvm.sh\nsource ~/.zsh/node/tools.sh',
        children: [
            {
                title: 'env.sh',
                type: 'partial',
                content: `# Node.js environment setup
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"

# Add local node_modules to PATH
export PATH="./node_modules/.bin:$PATH"

# NPM token for private packages
[ -f ~/.npmrc ] && export NPM_TOKEN=$(cat ~/.npmrc | grep authToken | cut -d'=' -f2)

# Increase memory limit for Node.js
export NODE_OPTIONS="--max-old-space-size=8192"`
            },
            {
                title: 'aliases.sh',
                type: 'partial',
                content: `# NPM aliases
alias n='npm'
alias ni='npm install'
alias nid='npm install --save-dev'
alias nig='npm install -g'
alias nr='npm run'
alias nrs='npm run start'
alias nrb='npm run build'
alias nrt='npm run test'
alias nrw='npm run watch'
alias nrl='npm run lint'

# Yarn aliases
alias y='yarn'
alias ya='yarn add'
alias yad='yarn add --dev'
alias yag='yarn global add'
alias yr='yarn run'
alias ys='yarn start'
alias yb='yarn build'
alias yt='yarn test'
alias yl='yarn lint'

# PNPM aliases
alias p='pnpm'
alias pi='pnpm install'
alias pa='pnpm add'
alias pad='pnpm add -D'
alias pr='pnpm run'`
            },
            {
                title: 'nvm.sh',
                type: 'partial',
                content: `# NVM auto-switching
autoload -U add-zsh-hook

load-nvmrc() {
  local nvmrc_path
  nvmrc_path="\$(nvm_find_nvmrc)"

  if [ -n "\$nvmrc_path" ]; then
    local nvmrc_node_version=\$(nvm version "\$(cat "\${nvmrc_path}")")
    local nvmrc_node_version_dir=\$(dirname "\${nvmrcth}")

    if [ "\$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "\$nvmrc_node_version" != "\$(nvm version)" ]; then
      nvm use
    fi
  elif [ -n "\$(PWD=\$nvmrc_node_version_dir nvm_find_nvmrc)" ] && [ "\$(nvm version)" != "\$(nvm version default)" ]; then
    nvm use default
  fi
}

add-zsh-hook chpwd load-nvmrc
load-nvmrc`
            },
            {
                title: 'tools.sh',
                type: 'partial',
                content: `# Node.js development tools

# Initialize new project
init-node() {
  local template=$1
  if [[ $template == "ts" ]]; then
    # TypeScript setup
    npm init -y
    npm i -D typescript @types/node ts-node nodemon
    npx tsc --init
    echo '{"watch": ["src"],"ext": ".ts,.js","ignore": [],"exec": "ts-node ./src/index.ts"}' > nodemon.json
    mkdir src
    touch src/index.ts
  elif [[ $template == "express" ]]; then
    # Express.js setup
    npm init -y
    npm i express cors dotenv helmet
    npm i -D typescript @types/node @types/express @types/cors ts-node nodemon
    npx tsc --init
    mkdir src src/routes src/controllers src/middleware
    touch src/index.ts src/routes/index.ts
  fi
}

# Run security audit
audit-deps() {
  echo "Running npm audit..."
  npm audit
  
  echo "\nChecking for outdated packages..."
  npm outdated
  
  echo "\nChecking bundle size..."
  npx cost-of-modules
}

# Clean node_modules
clean-node() {
  find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
}

# Start dev server with environment
dev() {
  local env=$1
  if [[ -f .env.$env ]]; then
    env-cmd -f .env.$env npm run dev
  else
    echo "No .env.$env file found"
  fi
}`
            }
        ]
    },
    {
        title: 'docker.sh',
        type: 'injector',
        content:
            '# Docker development tools\nsource ~/.zsh/docker/aliases.sh\nsource ~/.zsh/docker/functions.sh\nsource ~/.zsh/docker/compose.sh\nsource ~/.zsh/docker/monitoring.sh',
        children: [
            {
                title: 'aliases.sh',
                type: 'partial',
                content: `# Docker aliases
alias d='docker'
alias dc='docker compose'
alias dcu='docker compose up'
alias dcd='docker compose down'
alias dcr='docker compose restart'
alias dcp='docker compose ps'
alias dcl='docker compose logs'
alias dex='docker exec -it'
alias dps='docker ps'
alias dpsa='docker ps -a'
alias di='docker images'
alias drm='docker rm'
alias drmi='docker rmi'
alias dp='docker pull'
alias db='docker build'

# Docker system cleanup
alias dprune='docker system prune -af'
alias dclean='docker container prune -f'
alias dvclean='docker volume prune -f`
            },
            {
                title: 'functions.sh',
                type: 'partial',
                content: `# Docker utility functions

# Enter container shell
dsh() {
  docker exec -it $1 /bin/sh
}

# Follow container logs
dfl() {
  docker logs -f $1
}

# Build and run container
dbr() {
  docker build -t $1 . && docker run -it $1
}

# Stop all containers
dstop() {
  docker stop $(docker ps -aq)
}

# Remove all containers
drma() {
  docker rm $(docker ps -aq)
}

# Remove all images
drmia() {
  docker rmi $(docker images -q)
}

# Get container IP
dip() {
  docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $1
}`
            },
            {
                title: 'compose.sh',
                type: 'partial',
                content: `# Docker Compose utilities

# Start development environment
denv() {
  local env=$1
  if [[ -f docker-compose.$env.yml ]]; then
    docker compose -f docker-compose.yml -f docker-compose.$env.yml up -d
  else
    docker compose up -d
  fi
}

# Rebuild and restart single service
drebuild() {
  docker compose up -d --build $1
}

# View logs of multiple services
dlogs() {
  docker compose logs -f $@
}

# Execute command in service
dexec() {
  docker compose exec $1 \${@:2}
}

# Run one-off command
drun() {  
  docker compose run --rm $@
}`
            },
            {
                title: 'monitoring.sh',
                type: 'partial',
                content: `# Docker monitoring tools

# Show container stats
dstats() {
  docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

# Show container processes
dtop() {
  docker top $1
}

# Show container logs with timestamp
dlogt() {
  docker logs -f --timestamps $1
}

# Monitor resource usage
dmon() {
  watch -n 1 'docker ps -q | xargs docker stats --no-stream'
}

# Show container events
devents() {
  docker events --format 'Type={{.Type}} Status={{.Status}} ID={{.ID}} Image={{.From}}'
}

# Inspect container networking
dnet() {
  docker network inspect $(docker inspect -f '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{end}}' $1)
}`
            }
        ]
    }
])

export const dockerTemplate: ConfigNode = {
    id: generateId(),
    title: '.zshrc',
    type: 'main',
    level: 0,
    content:
        '# Docker development configuration\nsource ~/.zsh/docker/config.sh\nsource ~/.zsh/docker/compose.sh\nsource ~/.zsh/docker/functions.sh',
    children: [
        {
            id: generateId(),
            title: 'config.sh',
            type: 'partial',
            level: 1,
            content:
                '# Docker configuration\nexport DOCKER_BUILDKIT=1\nexport COMPOSE_DOCKER_CLI_BUILD=1\n\n# Docker aliases\nalias d="docker"\nalias di="docker images"\nalias dps="docker ps"\nalias dpsa="docker ps -a"\nalias drm="docker rm"\nalias drmi="docker rmi"\nalias dex="docker exec -it"\nalias dl="docker logs -f"'
        },
        {
            id: generateId(),
            title: 'compose.sh',
            type: 'partial',
            level: 1,
            content:
                '# Docker Compose aliases\nalias dc="docker compose"\nalias dcu="docker compose up"\nalias dcud="docker compose up -d"\nalias dcd="docker compose down"\nalias dcr="docker compose restart"\nalias dcl="docker compose logs -f"\nalias dcp="docker compose pull"\nalias dcb="docker compose build"'
        },
        {
            id: generateId(),
            title: 'functions.sh',
            type: 'partial',
            level: 1,
            content:
                '# Docker utility functions\n\n# Remove all containers\ndclean() {\n  docker rm -f $(docker ps -aq)\n}\n\n# Remove all unused images\ndiclean() {\n  docker image prune -af\n}\n\n# Remove all unused volumes\ndvclean() {\n  docker volume prune -f\n}\n\n# Remove everything\ndprune() {\n  docker system prune -af --volumes\n}\n\n# Build and run a Dockerfile in current directory\nddev() {\n  docker build -t "$1" . && docker run -it --rm "$1"\n}'
        }
    ]
}

export const gitWorkflowTemplate: ConfigNode = {
    id: generateId(),
    title: '.zshrc',
    type: 'main',
    level: 0,
    content:
        '# Git workflow configuration\nsource ~/.zsh/git/workflow.sh\nsource ~/.zsh/git/hooks.sh\nsource ~/.zsh/git/scripts.sh',
    children: [
        {
            id: generateId(),
            title: 'workflow.sh',
            type: 'injector',
            level: 1,
            content:
                '# Git workflow configuration\nsource ~/.zsh/git/workflow/branch.sh\nsource ~/.zsh/git/workflow/commit.sh',
            children: [
                {
                    id: generateId(),
                    title: 'branch.sh',
                    type: 'partial',
                    level: 2,
                    content:
                        '# Branch management\n\n# Feature branch\nfeature() {\n  git checkout -b "feature/$1" develop\n}\n\n# Bugfix branch\nbugfix() {\n  git checkout -b "bugfix/$1" develop\n}\n\n# Release branch\nrelease() {\n  git checkout -b "release/$1" develop\n}\n\n# Hotfix branch\nhotfix() {\n  git checkout -b "hotfix/$1" main\n}'
                },
                {
                    id: generateId(),
                    title: 'commit.sh',
                    type: 'partial',
                    level: 2,
                    content:
                        '# Commit helpers\n\n# Conventional commits\nfeat() {\n  git commit -m "feat: $1"\n}\n\nfix() {\n  git commit -m "fix: $1"\n}\n\ndocs() {\n  git commit -m "docs: $1"\n}\n\nstyle() {\n  git commit -m "style: $1"\n}\n\nrefactor() {\n  git commit -m "refactor: $1"\n}\n\nperf() {\n  git commit -m "perf: $1"\n}\n\ntest() {\n  git commit -m "test: $1"\n}'
                }
            ]
        },
        {
            id: generateId(),
            title: 'hooks.sh',
            type: 'partial',
            level: 1,
            content:
                '# Git hooks configuration\n\n# Set hooks path\ngit config core.hooksPath ~/.git/hooks\n\n# Commit message validation\necho \'#!/bin/sh\n\ncommit_msg=$(cat "$1")\npattern="^(feat|fix|docs|style|refactor|perf|test|chore|revert)((.+))?: .+"\n\nif ! echo "$commit_msg" | grep -qE "$pattern"; then\n  echo "Error: Commit message must follow Conventional Commits format"\n  exit 1\nfi\' > ~/.git/hooks/commit-msg\n\nchmod +x ~/.git/hooks/commit-msg'
        },
        {
            id: generateId(),
            title: 'scripts.sh',
            type: 'partial',
            level: 1,
            content:
                '# Git workflow scripts\n\n# Start new feature\nstart_feature() {\n  git fetch origin\n  git checkout develop\n  git pull origin develop\n  feature "$1"\n}\n\n# Finish feature\nfinish_feature() {\n  local branch=$(git rev-parse --abbrev-ref HEAD)\n  git checkout develop\n  git pull origin develop\n  git merge --no-ff "$branch"\n  git push origin develop\n  git branch -d "$branch"\n  git push origin --delete "$branch"\n}\n\n# Quick PR\npr() {\n  local branch=$(git rev-parse --abbrev-ref HEAD)\n  git push -u origin "$branch"\n  gh pr create --base develop --head "$branch" --title "$1" --body "$2"\n}'
        }
    ]
}
