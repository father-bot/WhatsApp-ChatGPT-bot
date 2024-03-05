# WhatsApp ChatGPT bot

If you're looking for unofficial API whatsapp bot switch to the
baileys branch

[CLICK HERE TO SWITCH](https://github.com/father-bot/WhatsApp-ChatGPT-bot/tree/baileys) or do it manually

## Deploy 🚀

1. Create an application on Meta Developers for WhatsApp use, copy app secret and issue a whatsapp access token

2. Buy a domain, set up SSL on your server

3. Create a Webhook application on Meta developers, adjust it properly to use with WhatsApp (read [docs](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks/)). Use ```https://{Paste your domain here}/whatsapp/webhook``` as the webhook url

4. Issue your OpenAI access token

5. Connect to your server using ssh

6. Install docker & docker-compose on your machine (go to the [docker official site](https://www.docker.com/)).

7. Clone this repo to a directory on the server
```shell
git clone https://github.com/father-bot/WhatsApp-ChatGPT-bot.git
```

8. Go to the cloned repo, run this line in the terminal
```shell
APP_SECRET={Paste WhatsApp app secret here} \
API_KEY={Paste WhatsApp access token here} \
WEBHOOK_VERIFY_TOKEN={Paste WhatsApp webhook verify token here} \
OPEN_AI_API_KEY={Paste OpenAI access token here} \
docker-compose up
```
