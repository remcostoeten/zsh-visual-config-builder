interface GistFile {
    content: string
}

interface Gist {
    description: string
    public: boolean
    files: Record<string, GistFile>
}

export const githubGistService = {
    async saveConfig(config: unknown, token: string) {
        const gist: Gist = {
            description: 'Shell Config Builder configuration',
            public: false,
            files: {
                'zsh-config.json': {
                    content: JSON.stringify(config, null, 2)
                }
            }
        }

        try {
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    Authorization: `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gist)
            })

            const data = await response.json()
            return data.id
        } catch (error) {
            console.error('Failed to save gist:', error)
            throw error
        }
    },

    async loadConfig(gistId: string, token: string) {
        try {
            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                headers: {
                    Authorization: `token ${token}`
                }
            })

            const data = await response.json()
            return JSON.parse(data.files['zsh-config.json'].content)
        } catch (error) {
            console.error('Failed to load gist:', error)
            throw error
        }
    },

    async listGists(token: string) {
        try {
            const response = await fetch('https://api.github.com/gists', {
                headers: {
                    Authorization: `token ${token}`
                }
            })

            const gists = await response.json()
            return gists.filter((gist: any) => gist.files['zsh-config.json'])
        } catch (error) {
            console.error('Failed to list gists:', error)
            return []
        }
    }
}
