const generateMessage = (str, userId, username) => {

    let message = `*<https://app.slack.com/team/${userId}|${username} (working on)>*:\n\n${str}`;

    return message;
}

module.exports = (str, userId = null, username = null) => {

    const result = [
        {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Hey, @all I found a new activity here."
            },
            "accessory": {
                "type": "overflow",
                "action_id": "update_task",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"emoji": true,
							"text": ":heavy_check_mark: Complete"
						},
						"value": "complete"
					},
					{
						"text": {
							"type": "plain_text",
							"emoji": true,
							"text": ":x: Delete"
						},
						"value": "delete"
					}
				]
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `${generateMessage(str, userId, username)}`
			},
			"block_id": "task_message"
		},
		{
			"type": "section",
			"fields": [
				{
					"type": "mrkdwn",
					"text": "*Activity Status:*"
				},
				{
					"type": "mrkdwn",
					"text": " "
				},
				{
					"type": "mrkdwn",
					"text": ":red_circle: In Progress"
				}
			],
			"block_id": "task_status"
		},
		{
			"type": "context",
			"block_id": "task_footer",
			"elements": [
				{
					"type": "mrkdwn",
					"text": "Task ID: your_task_id\nPosted at: February 09, 09:08 AM | task-list"
				}
			]
		}
    ];
    
    return result;
}

//returns "blocks" for slack