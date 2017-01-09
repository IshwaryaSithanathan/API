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
* Create a collection in MongoDB with 'users'.
* Insert document with ```name=your-name```. Once inserted, save the _id value of the generated user.
* Go to the default location of the cloned repo and enter, ```npm run dev```. The application by default will run in port 3000.
* From the Postman google chrome app, enter the url as http://localhost:3000/version, header-key="apikey", header-value="<_id value>" and hit enter.
* Remove/ change the api key section and you should recieve a message stating, 401 Unauthorized.