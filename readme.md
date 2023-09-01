# Installation and Setup

## Downloading && Installing

    git clone git@github.com:Thaerious/sharcnet-vacation.git
    cd sharcnet-vacation    
    npm i
    npm run build-css

## Testing
    npx mocha test/unit

## Starting the Server
    node .
    browse to 127.0.0.1/index

## Create a Devloper API Key & Service Account

* Browse to: console.cloud.google.com
* From the project selection dropdown (upper-left), select 'new project'
* Select the new project (upper-right)
* Fill in the requested information and click 'Create'.
* Select the newly created project from the drop down (upper-left)
* Navigate to: APIs & Services > Credentials
* Select: Create Credentials > API key
* Copy key to '.env' file into field 'API_KEY'
* Under heading 'Service Accounts', select: 'Manage service accounts' (center-right)
* Select: 'Create Service Account'
* Save the service account email for the 'Calendar Setup' step.
* Create and download a private key from the service account.
* Actions > Manage Keys > Add Key > Create New Key > JSON
* Add the filename to .env as 'GKEY_FILENAME'

### Setup Credentials
* Browse to: console.cloud.google.com
* Select: APIs & Services > Credentials (left)
* Select: Create Credentials > OAuth client ID
  * Application Type 'Web Application'
  * Add https://127.0.0.1 to domains
* Save the file under '/keys'

## Calendar Setup

* Open up the the google calendar (calendar.google.com).
* Under 'My calendars' to the right of the calendar find the menu (3 vertical dots).
* Select 'Settings and sharing'.
* Under 'Share with specific people' add the service account email address.
* Set that share to 'Make changes to events'.
* Under 'Integrate calendar' copy the 'Calendar ID' then paste into '.env' in the 'CALENDAR_ID' field.
* Enable the Google Calendar API [1]
* Navigate: console.cloud.google.com > APIs & Services > Enable APIs and Services.
* Select: 'Google Calendar API'
* Select: 'Enable'

## EMail Setup

* Go to your Google Account.
* Select Security.
* Select 2-Factor Authentication.
* Under 'Signing in to Google,' select App Passwords. You may need to sign in. If you don’t have this option, it might be because:
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

## Further Setup

Set the server name and log directory in the .env file.
LOG_DIR=logs
SERVER_NAME=http://vacation.sharcnet.ca:8000

## Install Node

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

## Changing a Destination Email

In the sqlite datbase /eb/requests.db
UPDATE emails set email = 'email@address' where role = 'university';

## Helpfull Commands
### List vacation service user
``systemctl show vacation.service -pUser``

## Notes

[1] (https://console.cloud.google.com/apis/api/calendar-json.googleapis.com/metrics?project=vacation-app-development)