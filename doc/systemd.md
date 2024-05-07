## Permits
    sudo systemctl start vacation
    sudo systemctl stop vacation

To enable system control add the following to /etc/systemd/system/vacation.service

## As Root
``` bash
[Unit]
Description=Vacation Portal
After=network.target

[Service]
User=root
Type=simple
WorkingDirectory=/home/webserver/sharcnet-vacation
ExecStart=node .
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## As Unprivilaged
``` bash
[Unit]
Description=Vacation Portal
After=network.target

[Service]
User=webserver
EnvironmentFile=/home/webserver/sharcnet-vacation/.env
Type=simple
WorkingDirectory=/home/webserver/sharcnet-vacation
ExecStart=node .
Restart=on-failure

[Install]
WantedBy=multi-user.target
```