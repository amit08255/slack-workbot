const { text } = require('micro')
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

module.exports = async (req, res) => {
  // Parse code received through req
  const body = parse(await text(req))
  let result;

  console.log(body);

  result = addTaskForUser(body.text);

  const response_type = 'in_channel'

  res.writeHead(200, { 'Content-Type': 'application/json' })
  // Create response object and send result back to Slack
  res.end(JSON.stringify({ response_type, blocks: result}))
}