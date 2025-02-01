export interface ShellSnippet {
    id: string
    name: string
    description: string
    code: string
    category: 'variable' | 'loop' | 'function' | 'conditional' | 'export' | 'alias'
}

export const shellSnippets: ShellSnippet[] = [
    // Variables
    {
        id: 'array-var',
        name: 'Array Variable',
        description: 'Define and use an array',
        category: 'variable',
        code: 'items=("item1" "item2" "item3")\necho "${items[@]}"'
    },
    {
        id: 'map-var',
        name: 'Associative Array',
        description: 'Key-value map variable',
        category: 'variable',
        code: 'declare -A config\nconfig=([key1]="value1" [key2]="value2")\necho "${config[key1]}"'
    },

    // Loops
    {
        id: 'for-loop',
        name: 'For Loop',
        description: 'Iterate over a list of items',
        category: 'loop',
        code: 'for item in "${items[@]}"; do\n  echo "$item"\ndone'
    },
    {
        id: 'while-loop',
        name: 'While Loop',
        description: 'Execute while condition is true',
        category: 'loop',
        code: 'while [[ $counter -lt 10 ]]; do\n  echo "$counter"\n  ((counter++))\ndone'
    },

    // Functions
    {
        id: 'function-template',
        name: 'Function Template',
        description: 'Basic function with parameters',
        category: 'function',
        code: 'function_name() {\n  local param1="$1"\n  local param2="$2"\n  echo "$param1 $param2"\n}'
    },
    {
        id: 'function-return',
        name: 'Function with Return',
        description: 'Function with return value',
        category: 'function',
        code: 'get_status() {\n  local result=$?\n  [[ $result -eq 0 ]] && echo "success" || echo "failed"\n  return $result\n}'
    },

    // Conditionals
    {
        id: 'if-file',
        name: 'If File Exists',
        description: 'Check if file exists',
        category: 'conditional',
        code: 'if [[ -f "$file" ]]; then\n  echo "File exists"\nfi'
    },
    {
        id: 'if-dir',
        name: 'If Directory Exists',
        description: 'Check if directory exists',
        category: 'conditional',
        code: 'if [[ -d "$dir" ]]; then\n  echo "Directory exists"\nfi'
    },

    // Exports
    {
        id: 'path-export',
        name: 'PATH Export',
        description: 'Add directory to PATH',
        category: 'export',
        code: 'export PATH="$HOME/bin:$PATH"'
    },
    {
        id: 'env-export',
        name: 'Environment Variable',
        description: 'Export environment variable',
        category: 'export',
        code: 'export NODE_ENV="development"'
    },

    // Aliases
    {
        id: 'git-aliases',
        name: 'Git Aliases',
        description: 'Common Git aliases',
        category: 'alias',
        code: 'alias g="git"\nalias ga="git add"\nalias gc="git commit"\nalias gp="git push"'
    },
    {
        id: 'nav-aliases',
        name: 'Navigation Aliases',
        description: 'Directory navigation aliases',
        category: 'alias',
        code: 'alias ..="cd .."\nalias ...="cd ../.."\nalias ll="ls -la"'
    }
]
