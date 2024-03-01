import {Text} from 'whatsapp-api-js/messages'

export default function handleChangeAIModel(ctx, db) {
    const msg = ctx.message
    
    const modelID = msg.interactive.button_reply.id
        .split('#')[1]

    db.users.setAIModel(msg.from, modelID) // in background

    ctx.reply(new Text('You have changed your AI model successfully'))
}
