import { ConfigNode } from "@/types/config"

export function generateShellScript(config: ConfigNode): string {
  const lines: string[] = [
    "#!/bin/bash",
    "",
    "# Shell Configuration Setup Script",
    "# Generated by Shell Config Builder",
    "",
    "set -e",
    "",
    "echo 'Setting up shell configuration...'"
  ]

  function processNode(node: ConfigNode, parentPath: string = "") {
    const nodePath = `${parentPath}/${node.title}`
    
    if (node.type === 'main') {
      lines.push(`\n# Creating base directory`)
      lines.push(`mkdir -p ~/.zsh`)
    } else {
      lines.push(`\n# Creating ${nodePath}`)
      lines.push(`mkdir -p $(dirname "${nodePath}")`)
      lines.push(`touch "${nodePath}"`)
      lines.push(`chmod +x "${nodePath}"`)
      lines.push(`cat > "${nodePath}" << 'EOL'`)
      lines.push(node.content)
      lines.push("EOL")
    }

    if (node.children) {
      node.children.forEach(child => processNode(child, parentPath + '/' + node.title))
    }
  }

  processNode(config)

  lines.push("\necho 'Configuration setup complete!'")
  return lines.join('\n')
} 