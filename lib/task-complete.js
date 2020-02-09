module.exports = (str, footerText, taskTime, username) => {

    const result = [
        {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Hey, *@all* I found a new activity here."
            }
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": str
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
					"text": ":large_blue_circle: Completed"
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
					"text": `${footerText}Completed at: ${taskTime} | By: ${username}`
				}
			]
		}
    ];
    
    return result;
}

//returns "blocks" for slack