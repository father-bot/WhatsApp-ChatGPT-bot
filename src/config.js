function getenv(name) {
    const value = process.env[name]
    if (!value) {
        throw new Error(`unexpected value '${value}' was got while reading '${name}' environment variable`)
    }
    return value
}

export default {
    postgres: {
        host: 'localhost',
        port: 5432,
        user: getenv('POSTGRES_USER'),
        database: 'whatsapp_chatgpt_bot',
        password: getenv('POSTGRES_PASSWORD')
    },
    whatsapp: {
        appSecret: getenv('WHATSAPP_APP_SECRET'),
        apiKey: getenv('WHATSAPP_API_KEY'),
        webhookVerifyToken: getenv('WHATSAPP_WEBHOOK_VERIFY_TOKEN'),
        webhookPort: 8080
    },
    openai: {
        apiKey: getenv('OPEN_AI_API_KEY')
    }
}