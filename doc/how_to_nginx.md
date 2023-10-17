# How to install NGINX in CentOS

``` bash
sudo dnf install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
systemctl status nginx
curl -4 icanhazip.com # determine ip address
sudo nginx -t
```

```bash
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl disable nginx # don't start on boot
sudo systemctl enable nginx # start on boot
```