module.exports = (str) => {

    const result = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*<fakeLink.toEmployeeProfile.com|Fred Enriquez>* is working on:\nThis is user task description"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Activity Status:*\n:large_blue_circle: Completed"
                }
            ]
        }	
    ];
    
    return result;
}

//returns "blocks" for slack