# Installation and Setup

## Downloading

git clone git@github.com:Thaerious/sharcnet-vacation.git

    cd sharcnet-vacation    
    npm i

## Quick Setup
The setup script will prompt the user for the requied .env variables.
The detials of these variables are listed below.

    npm run setup

## Testing
    npx mocha test/unit

## Starting the Server
    node . --no-http
    browse to 127.0.0.1/index

## Create a Devloper API Key & Service Account

* browse to: console.cloud.google.com
* from the project selection dropdown in the upper left, select 'new project'
* select the new project, then click on 'dashboard'
* APIs & Services > credentials
* create credentials / API key
* copy key to .env file as "API_KEY"
* manage service accounts
* create service account
* use the service account email address in the next step
* Create and download a private key from the service account.
* Actions > Manage Keys > Add Key > JSON
* Add the filename to .env as "GKEY_FILENAME".

Calendar Setup
==============

* Open up the the google calendar (calendar.google.com).
* Under 'My calendars' to the right of the calendar find the menu (3 vertical dots).
* Select 'Settings and sharing'.
* Under 'Share with specific people' add the service account email address.
* Set that share to 'Make changes to events'.
* Under 'Integrate calendar' copy the calendar id and paste it into the .env in the 'CALENDAR_ID' value.
* Enable the Google Calendar API (https://console.cloud.google.com/apis/api/calendar-json.googleapis.com/metrics?project=vacation-app-development)

EMail Setup
===========

* Go to your Google Account.
* Select Security.
* Select 2-Factor Authentication.
* Under "Signing in to Google," select App Passwords. You may need to sign in. If you don’t have this option, it might be because:
* 2-Step Verification is not set up for your account.
* 2-Step Verification is only set up for security keys.
* Your account is through work, school, or other organization.
* You turned on Advanced Protection.
* At the bottom, choose Select app and choose the app you using and then Select device and choose the device you’re using and then Generate.
* Follow the instructions to enter the App Password. The App Password is the 16-character code in the yellow bar on your device.
* Tap Done.

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

Install Apache & Let's Encrypt (DEPRECATED)
===========================================

```bash
sudo apt update
sudo apt install apache2
sudo apt install certbot python3-certbot-apache
sudo certbot --apache

sudo systemctl start apache2
sudo systemctl restart apache2 
```

Install Node
============

```bash
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
```

Changing a Destination Email
============================
In the sqlite datbase /eb/requests.db
UPDATE emails set email = "email@address" where role = "university";

Install Apache SSL
==================
```bash
sudo vim ../apache2.conf
vim> ServerName vacation.sharcnet.ca
sudo apache2ctl configtest
sudo certbot --apache
sudo systemctl reload apache2
```

Setup Reverse Proxy
===================
```bash
cd /etc/apache2
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2
sudo a2ensite 001-proxy
```

Setup Shibboleth
================
See https://wiki.alliancecan.ca/wiki/ShibbolethSPInstall for shibboleth server names.  The following instructions use the test server.  The production server is 'https://idp.alliancecan.ca/idp/shibboleth'.

```bash
sudo apt install shibboleth-sp-common shibboleth-sp-utils libapache2-mod-shib
cd /etc/shibboleth
sudo shib-keygen -b -n sp-signing -u _shibd -g _shibd
sudo shib-keygen -b -n sp-encrypt -u _shibd -g _shibd
sudo curl -o idp-metadata.xml https://idp-alliance.mit.c3.ca/idp/shibboleth
sudo vim shibboleth2.xml
    <SSO entityID="https://idp-alliance.mit.c3.ca/idp/shibboleth">
        SAML2
    </SSO>
    <MetadataProvider type="XML" validate="true" path="idp-metadata.xml"/>

    #replace <ApplicationDefaults entityID="https://sp.example.org/shibboleth" ...
    <ApplicationDefaults entityID="https://vacation.sharcnet.ca/shibboleth"  .... >

sudo systemctl enable shibd
sudo systemctl start shibd
sudo systemctl restart httpd    
```

The following forces shibboleth authentication on root path.
```bash
vim /etc/apache2/conf-available/shib.conf
    <Location />
        AuthType shibboleth
        ShibRequestSetting requireSession 1
        require shib-session
    </Location>
```

Setup Time Server (for shibboleth)
==================================
```bash
sudo apt purge ntp                                                                   
sudo apt install systemd-timesyncd                                                   
systemctl start systemd-timesyncd                                               
systemctl status systemd-timesyncd                                              
sudo timedatectl set-timezone America/Toronto                                        
sudo timedatectl set-ntp true                                                        
timedatectl show-timesync                                                       
vim /etc/systemd/timesyncd.conf                                                  
    [Time]                                                                        
    NTP=ntp1.sharcnet.ca ntp2.sharcnet.ca                                         
sudo systemctl restart systemd-timesyncd.service                                     
timedatectl show-timesync                                                       
timedatectl
```