export default function aiModelsList({sock, messageEvent}) {
    const message = `Type one of these commands to set a model

/model chatgpt4
/model chatgpt3.5`
    
    sock.sendMessage(messageEvent.key.remoteJid, {
        text: message
    })
}
