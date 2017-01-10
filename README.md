# Structo-Api
NODEJS application to communicate with PrintQueue through http calls. This project is started out with [nodebootstrap](http://nodebootstrap.io/). 
Please go through the documentation for using the boiler plate, especially the encapsulated modules section.

## Integrations
* Passport: Used for authentication purposes, strategy used is [localapikey](https://www.npmjs.com/package/passport-localapikey-update)
* MongoDB: Used to store api-keys and user credentials into the database.
* Communication with TCP server print queue on port number 8889

## Pre-requisites
* Install MongoDB on the local machine
* The management tool used for mongodb is [Robomongo](https://robomongo.org/)
* Setup [Visual Studio Code](https://code.visualstudio.com/) 
* Install Postman extension for Google Chrome. 

## Installation
* Install nodejs and dependencies
* Clone repo and install application libraries
    $ npm install --save 
    
## Instructions
* Prior to commits/ pull-requests, please format the code. 
On Windows, code formatting is available in VSCode through the shortcut `Shift + Alt + F`.
On Ubuntu, it's `Ctrl + Shift + i`.
    
## Testing (This section will be removed/edited -- Only for first time setup)
* Create a database in your localhost, using RoboMongo. Default databse is mentioned as "test" under /lib/database/index.js.
* Create a collection in MongoDB with 'users' and 'tokens'.
* In the users collection, insert a new document with ```name=your-name``` and ```email=email-address```. Once inserted, save the _id value of the generated user.
* Go to the default location of the cloned repo and enter, ```npm run dev```. For windows, hit the run button on the VS code IDE. The application by default will run in port 3000.
* From the Postman google chrome app, enter the url as http://localhost:3000/api/getToken, header-key="userid", header-value="<_id value>" and submit.
* You should get a 200 OK message followed by, token id. 
* Open the tokens collection in the DB, read the value of the token. The value will be the api key for testing. Default validity is set to 30 days.
* Switch back to the Postman google chrome app, enter the url as http://localhost:3000/version, header-key="apikey", header-value="<token value>" and hit enter.
* Remove/ change the api key section and you should recieve a message stating, 401 Unauthorized.
* Enter the url as http://localhost:3000/version, header-key="apikey", header-value="<token value>" and hit enter. You should get the token expiry date. 