export default function handleAIModelsList({sock, messageEvent}) {
    const message = `Type one of these commands to set a model

/model gpt-4
/model gpt-3.5-turbo`
    
    sock.sendMessage(messageEvent.key.remoteJid, {
        text: message
    })
}
