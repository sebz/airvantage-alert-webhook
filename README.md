# :rotating_light: airvantage-alert-webhook
Sample nodejs web application to receive AirVantage alerts thru a webhook

## Getting started
> :bulb: Nodejs >= 4.x required

1. Install the dependencies `npm i`
2. Check or update `config.js` file
3. Start the server `npm start`
4. Go to http://localhost:3000/ and prepare to watch the alerts coming
5. Test by posting content on http://localhost:3000/alert
     
  ```bash
  curl -H "Content-Type: application/json" -X POST -d '{"name":"event.alert.rule.triggered","date":1473091118798,"content":{"alert.uid":"e3cf3fed7d9c41beb33facbffaca6504","rule.uid":"35b00600117d4cb58437eccd0935a305","target.uid":"88e085b6012a408f9e2582b89a3b7161"}}' http://localhost:3000/alert
  ```


## Real life usage

1. Deploy this application on any public infrastructure
    - Or use https://ngrok.com/ for faster testing
2. Check out AirVantage user documentation https://doc.airvantage.net/av/reference/configure/ to setup the webhook
3. And the API documenation https://doc.airvantage.net/av/reference/cloud/API/#API-Alert-Rule-v1/ (see _Configure Notification Hooks / Subscriber API_) for more details on what will be posted.

