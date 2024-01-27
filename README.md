# PVD Things API

## Environment variables
You'll need to set these environment variables in a `.env` file at the root of the project folder:
```js
NODE_ENV=development // or 'production'

AIRTABLE_KEY=[value]
AIRTABLE_BASE_ID=[value]

SUPABASE_URL=[value]
SUPABASE_PUB_ANON_KEY=[value]

// Determines which Discord accounts are allowed to authenticate with the API
DISCORD_WHITELIST="mail@email.com another@email.com"

// Webhook URL used for sending loan reminder messages
LOAN_REMINDER_WEBHOOK_URL=[value]
```

## Local Development

### Run the server
```js
npm run install // on first run
npm run start
```
The server will start on port `8088`.

When running locally, no authentication is needed for the `lending` API. In production environments, these endpoints require tokens provided by Supabase Authentication (via Discord).

### Documentation

**Swagger Docs** are hosted at [http://localhost:8088/docs]().