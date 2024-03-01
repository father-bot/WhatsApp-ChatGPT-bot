import {ActionButtons, Body, Button, Interactive} from 'whatsapp-api-js/messages'

export default function aiModelsList(ctx) {
    const message = new Interactive(
        new ActionButtons(
            new Button('changeAIModel#gpt-4', 'ChatGPT 4'),
            new Button('changeAIModel#gpt-3.5-turbo', 'ChatGPT 3.5 turbo'),
        ),
        new Body('You can assign one of these models')
    )
    ctx.reply(message)
}
