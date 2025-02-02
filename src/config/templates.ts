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
        type: 'injector' as const,
        content: '# Core Shell Configuration\nsource ~/.zsh/core/history.sh\nsource ~/.zsh/core/completion.sh\nsource ~/.zsh/core/keybindings.sh\nsource ~/.zsh/core/options.sh',
        main: ['zshrc', 'injector', 'partial'] as const,
        connections: [],
        children: [
            {
                title: 'history.sh',
                type: 'partial' as const,
                main: ['zshrc', 'injector', 'partial'] as const,
                connections: [],
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
        title: 'git-config',
        content: `# Git configuration
source ~/.zsh/git/aliases.sh
source ~/.zsh/git/functions.sh`,
        level: 1,
        children: [
            {
                id: 'git-aliases',
                type: 'partial',
                title: 'git-aliases',
                content: `# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'`,
                level: 2,
                children: []
            }
        ]
    },
    {
        title: 'node-config',
        type: 'injector',
        title: 'node-config',
        content: `# Node.js configuration
source ~/.zsh/node/aliases.sh
source ~/.zsh/node/nvm.sh`,
        level: 1,
        children: [
            {
                id: 'node-aliases',
                type: 'partial',
                title: 'node-aliases',
                content: `# Node.js aliases
alias nr='npm run'
alias ni='npm install'
alias nid='npm install --save-dev'
alias nrb='npm run build'
alias nrd='npm run dev'`,
                level: 2,
                children: []
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
                id: 'docker-aliases',
                type: 'partial',
                title: 'docker-aliases',
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
                id: 'docker-functions',
                type: 'partial',
                title: 'docker-functions',
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
                id: 'docker-compose',
                type: 'partial',
                title: 'docker-compose',
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
                id: 'docker-monitoring',
                type: 'partial',
                title: 'docker-monitoring',
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

export const templates = {
    zsh: `# .zshrc configuration
# Add your custom zsh configuration here

# Example: Set PATH
export PATH=$HOME/bin:/usr/local/bin:$PATH

# Example: Set ZSH theme
ZSH_THEME="robbyrussell"

# Example: Enable plugins
plugins=(git node npm)`,

    injector: `#!/bin/bash
# Injector script
# This script loads all partial configurations

# Directory containing partial configs
PARTIALS_DIR="$HOME/.config/zsh/partials"

# Source all partial configurations
for file in "$PARTIALS_DIR"/*.sh; do
    if [ -f "$file" ]; then
        source "$file"
    fi
done`,

    partial: `#!/bin/bash
# Partial configuration
# Add your specific configuration here

# Example: Add aliases
alias ll='ls -la'
alias gs='git status'
alias gc='git commit'

# Example: Add functions
function mkcd() {
    mkdir -p "$1" && cd "$1"
}`
}

export type TemplateType = keyof typeof templates
