# COMP208-Pub-Website
This is the website portion of the COMP208 group project, built using NodeJS + Express + Pug, and MySQL

## Install for developers on MacOS
### NodeJS Install
Do **NOT** install nodejs via homebrew, it is possible to do so but it can [read: will] break npm (the nodejs package manager) in new and interesting ways that're all really annoying to clean up or fix.

Instead download the installer from [here](https://nodejs.org/en/) and follow the instructions, I'm using the LTS build (8.11.1) currently.

Newer versions of node probably *won't* be ok, if a new LTS version is released we should migrate the project to the newer version.

### MySQL Install
MySQL server can be installed from [here](https://dev.mysql.com/downloads/mysql/), set your own password when prompted, set your MySQL password as an enviroment variable called MYSQL to allow node to login to the server.

### Project setup
- In a terminal in the project dir run
> $ npm install

- In the same terminal run
> $ node createTestDB.js

N.B. This command will error first time as it tries to delete a database that doesnt yet exist, run it again to fix this

## Starting the web server
- In a terminal in the root dir of the project run
> $ npm start

## Useful things
- [NodeJS Docs](https://nodejs.org/dist/latest-v8.x/docs/api/)
- [NodeJS Guides](https://nodejs.org/en/docs/guides/)
- [Express Docs + Guides](https://expressjs.com/)
- [Pug Docs + Guides](https://pugjs.org/api/getting-started.html)

## Quick Reference
- Routing should be done in server.js
- Static HTML pages should be stored in $root/html
- Pug page templates should be placed in $root/views
- Accessing public/img/meme.png is done via the URL /img/meme.png, public/img/meme.png would be a folder called public, in public.
