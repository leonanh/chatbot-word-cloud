const API_AI_TOKEN = "2bdc0c9862094dd7941af625a6759707";
const apiAiClient = require("apiai")(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = "EAAfZBWaURunsBANlCkmDbV18G4FAJR2GNLx2ioYsmgpSqlzAvbydm8y3J7IgZBDlMUo2uAqTjwWzCYwfiaDokAwB0AJrkVY3QstFhGyk0YPLx5p6GsmZCZC3pBoSLShahUL7V9JCorHBmWMrwJBIGmZA3sQy74eB4TrZAFnjquuQZDZD";
const request = require("request");

const sendTextMessage = (senderId, text) => {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: "POST",
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    const apiaiSession = apiAiClient.textRequest(message, {sessionId: "crowdbotics_bot"});
    apiaiSession.on("response", (response) => {
        const result = response.result.fulfillment.speech;
        sendTextMessage(senderId, result);
    });

    apiaiSession.on("error", error => console.log(error));
    apiaiSession.end();
};