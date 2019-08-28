import * as functions from 'firebase-functions';
import * as request from 'request';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
export const search = functions.https.onRequest((_request, _response) => {
    _response.sendStatus(200);

    if (_request.body.event.username && _request.body.event.username === "quentin") {
        return;
    }

    if (_request.body.event.text.includes("-woof ")) {
        const generalChannelId = functions.config().slack.channel_general;
        const generalMessage = _request.body.event.text.replace("-woof ","");
        const generalResponseTwoBody = {
            channel: generalChannelId,
            text: generalMessage
        };
        request.post({
            headers: {
                'content-type': "application/json",
                'authorization': `Bearer ${functions.config().slack.key}`
            },
            url: "https://slack.com/api/chat.postMessage",
            body: generalResponseTwoBody,
            json: true
        }, function (error, response, body) {
            console.log("ER:", error);
        });
        return;
    }

    // search confluence articles
    const regex = / /gi;
    const searchTerm = _request.body.event.text;
    const confluenceSearchTerm = searchTerm.replace(regex, "+");
    const talkSearchTerm = searchTerm.replace(regex, "%20");
    let messageTwo = "Searching for the term - `" + searchTerm + "`. Woof! \n\n"; 
    messageTwo += "Have you tried searching on the <https://www.notion.so/3dhubs/3D-Hubs-Employee-Handbook-f0711d3c541942e280a36d2c5dca1263|Employee Handbook>? \n\n";
    messageTwo += "Here is what I found on our <https://www.3dhubs.com/talk/search?q=" + talkSearchTerm + "%20category%3A29|Q&amp;A> \n\n";
    messageTwo += "Here is what I found on our <https://www.3dhubs.com/talk/search?q=" + talkSearchTerm + "%20category%3A30|Engineering Q&amp;A> \n\n";
    messageTwo += "If that didn't answer your question, please create a new topic on either the <https://www.3dhubs.com/talk/c/internal|Q&amp;A> or the <https://www.3dhubs.com/talk/c/internal-engineering|Engineering Q&amp;A>.";
    const responseTwoBody = {
        channel: _request.body.event.channel,
        text: messageTwo
    };
    request.post({
        headers: {
          'content-type': "application/json",
          'authorization' : `Bearer ${functions.config().slack.key}`
        },
        url: "https://slack.com/api/chat.postMessage",
        body: responseTwoBody,
        json: true
      }, function(error, response, body) {
          console.log("ER:", error);
      }
    );

    // respond to Slack that we have received the request
    console.log("Done!");
});

export const newTopic = functions.https.onRequest((_request, _response) => {
    _response.sendStatus(200);    // respond to Slack that we have received the request

    if (_request.body.topic.views > 0) return;

    console.log(_request.body);
    console.log(_request);

    const channelId = functions.config().slack.channel_general;

    let message = "*Woof!*\n";
    message += "Someone has posted a new question on our Q&amp;A, who will be the hero who answers it?\n";
    message += "<https://www.3dhubs.com/talk/t/" +_request.body.topic.slug +"|" + _request.body.topic.title + ">";
    message += "\n\np.s. I may permit you to give me a belly rub in return";
    const responseTwoBody = {
        channel: channelId,
        text: message
    };
    request.post({
        headers: {
          'content-type': "application/json",
          'authorization' : `Bearer ${functions.config().slack.key}`
        },
        url: "https://slack.com/api/chat.postMessage",
        body: responseTwoBody,
        json: true
      }, function(error, response, body) {
          console.log("ER:", error);
      }
    );

    console.log("Done!");
});

export const newTopicEngineering = functions.https.onRequest((_request, _response) => {
    _response.sendStatus(200);    // respond to Slack that we have received the request

    if (_request.body.topic.views > 0) return;

    console.log(_request.body);
    console.log(_request);

    const channelId = functions.config().slack.channel_dev;

    let message = "*Woof!*\n";
    message += "Someone has posted a new question on our Q&amp;A, who will be the hero who answers it?\n";
    message += "<https://www.3dhubs.com/talk/t/" +_request.body.topic.slug +"|" + _request.body.topic.title + ">";
    message += "\n\np.s. I may permit you to give me a belly rub in return";
    const responseTwoBody = {
        channel: channelId,
        text: message
    };
    request.post({
        headers: {
          'content-type': "application/json",
          'authorization' : `Bearer ${functions.config().slack.key}`
        },
        url: "https://slack.com/api/chat.postMessage",
        body: responseTwoBody,
        json: true
      }, function(error, response, body) {
          console.log("ER:", error);
      }
    );

    console.log("Done!");
});
