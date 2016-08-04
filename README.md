# :rotating_light: airvantage-alert-webhook
Sample nodejs code to receive AirVantage alerts thru a webhook

## Getting started
> :bulb: Nodejs >= 4.x required

1. Install dependencies `npm i`
2. Start the server `npm start`
3. Go to http://localhost:3000/ and prepare to watch the alerts comming
4. Test by posting content on http://localhost:3000/alert
     
  ```bash
  curl -H "Content-Type: application/json" -X POST -d '{"fake":"alert"}' http://localhost:3000/alert
  ```


## Real life usage

1. Deploy this application on any public infrastructure
2. Check out AirVantage user documentation https://doc.airvantage.net/av/reference/configure/ to setup the webhook
3. And the API documenation https://doc.airvantage.net/av/reference/cloud/API/#API-Alert-Rule-v1/ (see _Configure Notification Hooks / Subscriber API_) for more details on what will be posted.

