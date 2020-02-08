const { text } = require('micro');
const axios = require("axios");
const { parse } = require('querystring')
const addTaskForUser = require('./lib/eval')

/*
POST request structure --

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

  result = addTaskForUser(body.text, body.user_id, body.user_name);

  const data = { response_type: "in_channel", blocks: result}

  const respond = await to(axios.post(body.response_url, data));

  res.status(200).send(null);
}