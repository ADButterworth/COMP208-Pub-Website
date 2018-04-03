# COMP208-Pub-Website
This is the website portion of the COMP208 group project, built using NodeJS and MongoDB

## Install for developers on MacOS
### Homebrew Install
- To install Homebrew (Package manager), Open a terminal and run this
> $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

(N.B. This will ask to install Command Line Tools for xcode as part of the install, this is normal)

### MongoDB Install
- To install MongoDB (Database) 
> $ brew install mongodb

- Start MongoDB Service (Requries installing brew services)
> $ brew tap homebrew/services

> $ brew services start mongodb

- Check service started
> $ brew services list

- Verify mongodb running and correct version
> $ mongod --version

First line of console output should be: **db version v3.6.3**

(Higher versions *should* be fine, check mongodb docs for changes)

### NodeJS Install
Do **NOT** install nodejs via homebrew, it is possible to do so but it can [read: will] break npm (the nodejs package manager) in new and interesting ways that're all really annoying to clean up or fix.

Instead download the installer from [here](https://nodejs.org/en/) and follow the instructions, I'm using the LTS build (8.11.1) currently.

Newer versions of node probably *won't* be ok, if a new LTS version is released we should migrate the project to the newer version.
