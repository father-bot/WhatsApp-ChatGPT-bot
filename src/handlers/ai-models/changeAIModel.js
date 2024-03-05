export default function handleChangeAIModel({sock, messageEvent}, db) {    
    const modelID = messageEvent.message.conversation
        .replace('/model ', '')

    const remoteJid = messageEvent.key.remoteJid
    db.users.setAIModel(remoteJid, modelID) // in background

    sock.sendMessage(remoteJid, {
        text: 'You have changed your AI model successfully'
    })
}
