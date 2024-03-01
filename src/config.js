function getenv(name) {
    const value = process.env[name]
    if (typeof value === 'undefined') {
        throw new Error(`got unexpected value '${value}' while reading '${name}' environment variable`)
    }
    return value
}

export default {
    postgres: {
        host: getenv('POSTGRES_HOST'),
        port: getenv('POSTGRES_PORT'),
        user: getenv('POSTGRES_USER'),
        database: getenv('POSTGRES_DATABASE'),
        password: getenv('POSTGRES_PASSWORD')
    },
    openai: {
        apiKey: getenv('OPEN_AI_API_KEY')
    }
}