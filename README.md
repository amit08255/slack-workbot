
<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h3 align="center">Slack Workbot</h3>

  <p align="center">
    This is simple slack bot designed in NodeJS and Zeit Now which allows you to track tasks you and other members of your team are working on directly from slack. It uses Mongodb for storing task list. <b>Under development</b>
    <br />
  </p>
</p>

### Built With
This project is designed with technologies listed below - 
* [NodeJS](https://nodejs.org)
* [Zeit Now](https://zeit.co)
* [Slack](https://slack.com)
* [MongoDB](https://mongodb.com)



<!-- GETTING STARTED -->
## Getting Started

First you need to install **NodeJS** and **npm** on your computer.
Then install **Zeit now cli** on your computer.
Then you need to setup your MongoDB server, we are going to use **MongoDB Atlas** for easy configuration.
Create an account for **MongoDB Atlas** and setup free tier cluster for getting started.
Then to get started with this project, you just need to clone or download this repository on your computer.


### Installation

1. Clone the repo
```sh
git clone https://github.com/amit08255/slack-workbot.git
```

2. Setup and login to your zeit now cli.


<!-- USAGE EXAMPLES -->
## Setting Up

1. We start by [creating a new Slack app](https://api.slack.com/apps/new). After naming it, we customize it with our choice of color and icon. When creating a new app, Slack asks for an app name and a default workspace.

2. On the app’s Basic Information page, we find that Slack allows us to add features to our app.

3. Create a new Slash Command called `/eval`. Each time someone types in `/eval your text`, Slack will send a POST request to a Request URL that we specify. We need to process the request and respond with the result we get from executing the code. 
For now set request URL to - https://serverless-eval.now.sh/

4. Enter a short description for slash command and click on - Save

5. Now go to slack app basic information page and copy client ID and client secret from app credentials.

6. Run below command in terminal (in your project directory) --

```sh
now secret add slack-client-id xxxx
now secret add slack-client-secret xxxx
```

7. Now to deploy to Zeit now, run below command --

```sh
now
```

**Note:** Next time when making changes to app, and you want it to deploy to production URL (which is always same) run below command to deploy --

```sh
now --prod
```

8. You will be provided an unique URL for your deployed app. Copy that URL in request URL of your slack app slash command.

9. Now go to oath and permissions page of your slack app and click on - **Install app to workspace**

10. Now go to oath and permissions page of your slack app and add redirect URLs -- https://serverless-eval.now.sh/oauth.js  (replace https://serverless-eval.now.sh/ with your deployed app URL).

11. Go to interactive components page of your slack bot app. Enable interactivity and set request URL to - https://serverless-eval.now.sh/ (replace https://serverless-eval.now.sh/ with your deployed app URL).

12. Login to your **MongoDB Atlas** account and go to Database Access page and add new user. Set user privilege to - **Read and write any database** setup authentication method as - Password. Create username and password and click on - **Add User**

13. When MongoDB atlas is created, go to your MongoDB Atlas clusters list and click on **Connect** to created cluster. It will ask you to setup list of whitelist IP address before you can connect. Use -- **0.0.0.0/0** as whitelist IP address. Click on - **Choose connection method**

14. In choose connection method wizard of MongoDB atlas, choose -- **Connect your application** Choose driver -- **NodeJS** and version -- **3.0 or later**. Copy connection string and replace **<password>** in connection string (with one you used when adding user for database).

15. Now in your MongoDB Atlas cluster list, click on - **COLLECTIONS** on your created cluster. Click on - **Add your own data**. Enter database name and collection name to create database. Set database name -- **workbot** collection name -- **task_list**

16. Now run below command to add connection string for MongoDB securely to work with Zeit Now --

```sh
now secret add mongodb-url "mongodb_connection_string"
```

17. Now deploy your app again with command --

```sh
now --prod
```

## Usage

* Invite app to any slack channel and run any of below commands for app --

1. `/eval YOUR_TASK_DESCRIPTION` -- Add task with given description

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Amit Kumar - [@amit08255](https://twitter.com/amit08255) - amitcute3@gmail.com

Project Link: [https://github.com/amit08255/slack-workbot](https://github.com/amit08255/slack-workbot)
