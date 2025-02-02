interface Gist {
    id: string
    description: string
    updated_at: string
}

export const useGistStore = () => {
    const loadGists = async () => {
        // Implement gist loading logic here
    }

    return {
        gists: [] as Gist[],
        loadGists
    }
} 