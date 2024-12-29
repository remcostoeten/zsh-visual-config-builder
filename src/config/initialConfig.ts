import type { ConfigNode } from '../types/config';

export const initialConfig: ConfigNode = {
    id: 'root',
    title: 'Main Config',
    content: '# Main ZSH Configuration\n\n# Your configuration here...',
    type: 'main',
    children: [
        {
            id: 'child1',
            title: 'Aliases',
            content: '# Common aliases\nalias ll="ls -la"\nalias ..="cd .."',
            type: 'partial',
            children: []
        }
    ]
};