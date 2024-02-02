# WhatsApp ChatGPT bot

## Deploy 🚀
1. Create a WhatsApp application, then copy your access key and app secret (they will be used in the further steps)
2. Deploy the application, it's essentially a webserver running on port 8080 by default. You required to use HTTPS
3. Setup Meta Webhook for the newly created WhatsApp application, paste this "https://{your domain}/whatsapp/webhook" 
in "Callback URL" and then come with your verify token and paste it in the "Verify token" field. Copy your verify token
(it will be needed for the further steps)
4. Get your OpenAI access token for interacting with ChatGPT (copy and save it)
5. Install PostgreSQL on your server. Create your postgres user or use "postgres" by default, think of your password.
Place into the "POSTGRES_USER" environment variable name of the user, afterward place the user's password into the
"POSTGRES_PASSWORD" variable
6. Set the "WHATSAPP_APP_SECRET" environment variable with the value of your app secret (step 1), then set another variable
called "WHATSAPP_API_KEY" and place there your API key (step 1), afterward create the "WHATSAPP_WEBHOOK_VERIFY_TOKEN" variable
and paste there your Meta Webhook verify token (step 3). After all, create the last variable "OPEN_AI_API_KEY" with your OpenAI key
7. Clone this repo into some directory on your server and go in
8. Go to the migrations directory in root and run [PostgreSQL interactive shell](https://www.postgresql.org/docs/current/app-psql.html)
in the directory you entered
9. Run `\i ./setup.sql` in the interactive shell. It will create all the tables and database itself with the right structure 
10. Go to the root directory and type `npm run start` in the terminal
