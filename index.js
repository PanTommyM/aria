/**
You still have to create the API keys and upload it here.
* Create a '.env' file as mentioned in the guide and paste in the keys with the corresponding names shown in the guide.
* Create a 'config.json' file as mentioned in the guide and paste in the content of the file which was downloaded from Dialogflow/Google.
*/

require("dotenv").config();

// --------------------------------------------------------------
// to set environment variables

process.env.GOOGLE_APPLICATION_CREDENTIALS = `${process.env.PWD}/${process.env.REPL_SLUG}/config.json`

// --------------------------------------------------------------

const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");

const Discord = require("discord.js");

const client = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

client.once("ready", () => console.log("ready!"));

async function replyMsg(textMsg) {
  projectId = process.env.PROJECT_ID;
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = await sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: textMsg,
        // The language used by the client (en-US)
        languageCode: "en-US",
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  console.log(`Query: ${result.queryText}`);

  return await result.fulfillmentText;
}

client.on("message", (message) => {
  if (!message.author.bot) {
    replyMsg(message.content).then((res) => {
      console.log(res);
      message.channel.send(res);
    });
  }
});

client.login(token);
