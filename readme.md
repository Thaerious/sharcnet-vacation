Downloading
===========
git clone git@github.com:Thaerious/sharcnet-vacation.git
cd sharcnet-vacation
npm i

Quick Setup
===========
The setup script will prompt the user for the requied .env variables.
    npm run setup

Running
=======
    node .
browse to 127.0.0.1/index

Testing
=======
    npx mocha

Create a Devloper API Key & Service Account
===========================================
browse to: console.cloud.google.com

create a new app

* credentials
* create credentials / API key
* copy key to .env file as "API_KEY"

> manage service accounts
> create service account
use the service account email address in the next step

Create and download a private key from the service account.
Add the filename to .env as "GKEY_FILENAME".

Calendar Setup
==============

Open up the the google calendar (calendar.google.com).
Under 'My calendars' to the right of the calendar find the menu (3 vertical dots).
Select 'Settings and sharing'.
Under 'Share with specific people' add the service account email address.
Set that share to 'Make changes to events'.
Under 'Integrate calendar' copy the calendar id and paste it into the .env in the 'CALENDAR_ID' value.

EMail Setup
===========
Fill in the following fields in the .env for Email.
- EMAIL_USER
- EMAIL_PASSWD
- EMAIL_PORT
- EMAIL_HOST
- EMAIL_FROM

Further Setup
=============
Set the server name and log directory in the .env file.
LOG_DIR=logs
SERVER_NAME=http://vacation.sharcnet.ca:8000

Server Setup
============
Use when setting up a linux server from scratch.

Install Apache & Let's Encrypt
==============================
sudo apt update
sudo apt install apache2
sudo apt install certbot python3-certbot-apache
sudo certbot --apache

sudo systemctl start apache2
sudo systemctl restart apache2 

Install Node
============
cd /usr
mkdir node
cd node
sudo wget https://nodejs.org/dist/v18.6.0/node-v18.6.0-linux-x64.tar.xz
sudo tar -xvf node-v18.6.0-linux-x64.tar.xz
sudo mv node-v18.6.0-linux-x64 18.6.0
sudo rm *.xz
cd /usr/local/bin
sudo ln -s /opt/node/18.6.0/bin/node node
sudo ln -s /opt/node/18.6.0/bin/npx npx
sudo ln -s /opt/node/18.6.0/bin/npm npm

Changing a Destination Email
============================
In the sqlite datbase /eb/requests.db
UPDATE emails set email = "email@address" where role = "university";