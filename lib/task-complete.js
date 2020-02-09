module.exports = (str) => {

    const result = [
        {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Hey, @all I found a new activity here."
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
					"text": "Task ID: your_task_id\nPosted at: February 09, 09:08 AM | Completed at: February 09, 09:08 AM | By: amit"
				}
			]
		}
    ];
    
    return result;
}

//returns "blocks" for slack