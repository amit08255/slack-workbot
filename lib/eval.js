const generateMessage = (str, userId, username) => {

    let message = `*<https://app.slack.com/team/${userId}|${username}>* is working on:\n\n${str}`;

    return message;
}

module.exports = (str, userId = null, username = null) => {

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
				"text": `>>> ${generateMessage(str, userId, username)} \n\n *Activity Status:*\n:red_circle: In Progress`
			}
		}
    ];
    
    return result;
}

//returns "blocks" for slack