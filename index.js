const { text } = require('micro');
const axios = require("axios");
const { parse } = require('querystring');
const addTaskForUser = require('./lib/add-task');
const finishUserTask = require('./lib/task-complete');
const messageBlocksScanner = require('./utils/messageBlocksScanner');

/*
Slash command POST request structure --

{
  token: 'EIf4E6oUqGN4keNxczLqijRL',
  team_id: 'T3S7Y1SGN',
  team_domain: 'schooglink',
  channel_id: 'GTC999C9Z',
  channel_name: 'privategroup',
  user_id: 'UE4LKKCHF',
  user_name: 'amit',
  command: '/eval',
  text: 'test',
  response_url: 'https://hooks.slack.com/commands/T3S7Y1SGN/943071662341/uePJdNDl3jfg0IQpJEexhsG2',
  trigger_id: '932903671329.128270060566.9c21c804326af16fb3b738be450f019f'
}

*/

/*
Overflow menu POST request structure payload contains JSON string --

{
	"payload": `{
	"type": "block_actions",
	"team": {
		"id": "T3S7Y1SGN",
		"domain": "schooglink"
	},
	"user": {
		"id": "UE4LKKCHF",
		"username": "amit",
		"name": "amit",
		"team_id": "T3S7Y1SGN"
	},
	"api_app_id": "ATDGCATDZ",
	"token": "EIf4E6oUqGN4keNxczLqijRL",
	"container": {
		"type": "message",
		"message_ts": "1581186334.000600",
		"channel_id": "GTC999C9Z",
		"is_ephemeral": false
	},
	"trigger_id": "943403578277.128270060566.bdb9f4099dd5835a8723376cb648538a",
	"channel": {
		"id": "GTC999C9Z",
		"name": "privategroup"
	},
	"message": {
		"type": "message",
		"subtype": "bot_message",
		"text": "This content can't be displayed.",
		"ts": "1581186334.000600",
		"bot_id": "BTT6YM55L",
		"blocks": [{
			"type": "section",
			"block_id": "7kZ",
			"text": {
				"type": "mrkdwn",
				"text": "Hey, @all I found a new activity here.",
				"verbatim": false
			},
			"accessory": {
				"type": "overflow",
				"action_id": "update_task",
				"options": [{
					"text": {
						"type": "plain_text",
						"text": ":heavy_check_mark: Complete",
						"emoji": true
					},
					"value": "complete"
				}, {
					"text": {
						"type": "plain_text",
						"text": ":x: Delete",
						"emoji": true
					},
					"value": "delete"
				}]
			}
		}, {
			"type": "divider",
			"block_id": "66=8"
		}, {
			"type": "section",
			"block_id": "task_message",
			"text": {
				"type": "mrkdwn",
				"text": "*<https:\/\/app.slack.com\/team\/UE4LKKCHF|amit (working on)>*:\n\nHello world",
				"verbatim": false
			}
		}, {
			"type": "section",
			"block_id": "task_status",
			"fields": [{
				"type": "mrkdwn",
				"text": "*Activity Status:*",
				"verbatim": false
			}, {
				"type": "mrkdwn",
				"text": " ",
				"verbatim": false
			}, {
				"type": "mrkdwn",
				"text": ":red_circle: In Progress",
				"verbatim": false
			}]
		}]
	},
	"response_url": "https:\/\/hooks.slack.com\/actions\/T3S7Y1SGN\/943383337920\/ZYX9AnVAw9dcCs8THERnsoW4",
	"actions": [{
		"type": "overflow",
		"action_id": "update_task",
		"block_id": "7kZ",
		"selected_option": {
			"text": {
				"type": "plain_text",
				"text": ":heavy_check_mark: Complete",
				"emoji": true
			},
			"value": "complete"
		},
		"action_ts": "1581186360.438255"
	}]
}`
}

*/


//An utility function to be used with async function to handle promise (API calls) with await
//without writing exception codes
function to(promise) {
    return promise.then(data => {
       return [null, data];
    })
    .catch(err => {
        
        return [err];
    });
 }


module.exports = async (req, res) => {
  // Parse code received through req
  const body = parse(await text(req))
  let result;

  let response = body;

  if(body["payload"] !== undefined){
      response = JSON.parse(body["payload"]);
  }

  console.log(JSON.stringify(response));

  if(body["command"] !== undefined){

        result = addTaskForUser(body.text, body.user_id, body.user_name);

        const data = { response_type: "in_channel", blocks: result}
    
        const respond = await to(axios.post(body.response_url, data)); //send message by response URL
  }
  else if(response["actions"] !== undefined){

        const selected_option = response["actions"][0]["selected_option"];
        const option_value = selected_option["value"];

        const response_url = response["response_url"];

        const data = {delete_original: true};

        const messageBlock = messageBlocksScanner(response["message"], "section", "task_message")

        console.log("\n\nmessage block: ", messageBlock);

        if(option_value === "delete"){

        }
        else if(option_value === "complete"){

            console.log("\n\ncomplete");

            if(messageBlock !== null){

                const messageText = messageBlock["text"]["text"];

                result = finishUserTask(messageText);

                data.response_type = "in_channel";
                data.blocks = result;

                const respond = await to(axios.post(response_url, data)); //send message by response URL

                console.log("\n\n response:", respond);

            }
            
        }

  }

  res.status(200).send(null);
}