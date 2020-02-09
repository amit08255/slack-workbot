const { text } = require('micro');
const axios = require("axios");
const { parse } = require('querystring');
const addTaskForUser = require('./lib/add-task');
const finishUserTask = require('./lib/task-complete');
const messageBlocksScanner = require('./utils/messageBlocksScanner');
const MongoClient = require('mongodb').MongoClient

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




const uri = process.env.MONGODB_URL;
const dbname = "workbot";
const collectionName = "task_list";

// Create cached connection variable
let cachedDb = null;




// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
	// If the database connection is cached,
	// use it instead of creating a new connection
	if (cachedDb) {
		return cachedDb
	}

	// If no connection is cached, create a new one
	const client = await MongoClient.connect(uri, { useNewUrlParser: true })

	// Select the database through the connection,
	// using the database path of the connection string
	const db = await client.db(dbname)

	// Cache the database connection and return the connection
	cachedDb = db
	return db
}




function generateUniqueId(userid, timestamp){

	const useridHex = Buffer.from(userid, 'utf8').toString('hex');
	return `${useridHex}${timestamp}`;
}



function getTime(){

	let date = new Date();

	let formattedTime = date.toLocaleString("en-US", {timeZone: "Asia/Kolkata", month: "long", day: "numeric"}) + ", " + date.toLocaleString('en-US', {timeZone: "Asia/Kolkata", hour: 'numeric', minute: 'numeric', hour12: true });

	return formattedTime;

}


function getTaskId(taskFooter){

	let strArr = taskFooter.split("\n");

	let task = strArr[0].split("task-id:");

	if(task.length > 1){
		return task[1].trim();
	}
	else{
		return null;
	}
}



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
  const body = parse(await text(req));
  let result;

  let write2db = false;

  let delete2db = false;

  let response = body;

  const timestamp = Date.now();

  const taskTime = getTime();

  let dbDataStruct = {
	_id: "",
	userid: "", 
	username: "", 
	task: "", 
	created_at: timestamp, 
	status: ""
  };


  if(body["payload"] !== undefined){
      response = JSON.parse(body["payload"]);
  }

  console.log(JSON.stringify(response));

  if(body["command"] !== undefined){

		if(body["command"] === "/task-add"){

			const taskId = generateUniqueId(body.user_id, timestamp);

			result = addTaskForUser(body.text, body.user_id, body.user_name, taskId, taskTime);

			const data = { response_type: "in_channel", blocks: result}
		
			const respond = await to(axios.post(body.response_url, data)); //send message by response URL

			dbDataStruct.userid = body.user_id;
			dbDataStruct.username = body.user_name;
			dbDataStruct.task = body.text;
			dbDataStruct.status = "progress";
			dbDataStruct._id = taskId;

			write2db = true;
		}
  }
  else if(response["actions"] !== undefined){

        const selected_option = response["actions"][0]["selected_option"];
        const option_value = selected_option["value"];

		const response_url = response["response_url"];
		
		const username = response["user"]["username"];

        const data = {};

		const messageBlock = messageBlocksScanner(response["message"], "section", "task_message")
		
		const footerBlock = messageBlocksScanner(response["message"], "context", "task_footer")

		let footerText = "";

		if(footerBlock !== null){
			footerText = footerBlock["elements"][0]["text"];

			if(footerText !== null && footerText !== undefined){
				footerText = footerText.replace("task-list", "");
			}
		}

		let taskId = getTaskId(footerText);

        console.log("\n\nmessage block: ", messageBlock);

        if(option_value === "delete"){

            data.delete_original = true;

			const respond = await to(axios.post(response_url, data)); //delete message by response URL

			dbDataStruct = {_id: taskId};
			
			delete2db = true;
			write2db = true;

        }
        else if(option_value === "complete"){

            console.log("\n\ncomplete");

            if(messageBlock !== null){

				const messageText = messageBlock["text"]["text"];

                result = finishUserTask(messageText, footerText, taskTime, username);

                data.replace_original = true;

                data.response_type = "in_channel";
                data.blocks = result;

                const respond = await to(axios.post(response_url, data)); //sreplace original / update message by response URL

                console.log("\n\n response:", respond);

            }
            
        }

  }


	if(write2db === true){

		const db = await connectToDatabase(uri);

		// Select the "users" collection from the database
		const collection = await db.collection(collectionName);

		if(delete2db === true){

			const delResponse = await collection.remove( dbDataStruct );
			console.log("\n\nDelete response: ", delResponse);
		}
		else{
			const insertResponse = await collection.insertOne(dbDataStruct);
			console.log("\n\nInsert response: ", insertResponse);
		}

	}

  res.status(200).send(null);
}