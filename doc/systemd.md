## Permits
    sudo systemctl start vacation
    sudo systemctl stop vacation

To enable system control add the following to /etc/systemd/system/vacation.service

## As Root

[Unit]
Description=Vacation Portal
After=network.target

[Service]
User=root
Type=simple
WorkingDirectory=/home/webserver/sharcnet-vacation
ExecStart=node . --no-http -v
Restart=on-failure

[Install]
WantedBy=multi-user.target

## As Non Root

[Unit]
Description=Vacation Node.JS app
After=network.target

[Service]
User=webserver
EnvironmentFile=/home/webserver/sharcnet-vacation/.env
Type=simple
WorkingDirectory=/home/webserver/sharcnet-vacation
ExecStart=node . --no-ssl -v
Restart=on-failure

[Install]
WantedBy=multi-user.target