import { ConfigNode } from '../types/config'

export const initialConfig: ConfigNode = {
    id: 'main',
    title: '.zshrc',
    content: '# Main ZSH configuration file\n# Add your source statements here',
    type: 'main',
    level: 0,
    children: []
}
