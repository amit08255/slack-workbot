const { text } = require('micro');
const axios = require("axios");
const { parse } = require('querystring')
const addTaskForUser = require('./lib/eval')

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
Overflow menu POST request structure --

{
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
		"message_ts": "1581163218.003400",
		"channel_id": "GTC999C9Z",
		"is_ephemeral": false
	},
	"trigger_id": "945073497287.128270060566.c0e50fddfc0d3dde0f5d5e87922fbbe7",
	"channel": {
		"id": "GTC999C9Z",
		"name": "privategroup"
	},
	"message": {
		"type": "message",
		"subtype": "bot_message",
		"text": "This content can't be displayed.",
		"ts": "1581163218.003400",
		"bot_id": "BTT6YM55L",
		"blocks": [{
			"type": "section",
			"block_id": "NxP",
			"text": {
				"type": "mrkdwn",
				"text": "Hey, @all I found a new activity here.",
				"verbatim": false
			},
			"accessory": {
				"type": "overflow",
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
				}],
				"action_id": "9yZcT"
			}
		}, {
			"type": "divider",
			"block_id": "EkBEK"
		}, {
			"type": "section",
			"block_id": "Z7I1",
			"text": {
				"type": "mrkdwn",
				"text": "&gt;&gt;&gt; *<https:\\/\\/app.slack.com\\/team\\/UE4LKKCHF|amit>* is working on:\\n\\nhello dude \\n\\n *Activity Status:*\\n:red_circle: In Progress",
				"verbatim": false
			}
		}]
	},
	"response_url": "https:\\/\\/hooks.slack.com\\/actions\\/T3S7Y1SGN\\/933063818081\\/P5oCbWznpwXfHteIwo6J5GlE",
	"actions": [{
		"type": "overflow",
		"action_id": "9yZcT",
		"block_id": "NxP",
		"selected_option": {
			"text": {
				"type": "plain_text",
				"text": ":heavy_check_mark: Complete",
				"emoji": true
			},
			"value": "complete"
		},
		"action_ts": "1581165207.806745"
	}]
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

  console.log(body);

  result = addTaskForUser(body.text, body.user_id, body.user_name);

  const data = { response_type: "in_channel", blocks: result}

  const respond = await to(axios.post(body.response_url, data));

  res.status(200).send(null);
}