# Replit Clone - Cloud IDE

## 1. Run Docker Compose

 - install docker compose 

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

- Build and Run Docker-compose 
```
docker-compose build 
docker-compose up
```

## 2. Deploy API

```
cd api/
docker build -t aaronapz/api .
docker push aaronapz/api
kubectl apply -f deployment.yaml
kubectl apply -f service.yml 
kubectl get services  
kubectl get nodes -o wide  
```

## 2. Deploy webUI

```
cd webui/
docker build -t aaronapz/webui .
docker push aaronapz/webui
kubectl apply -f deployment.yml
kubectl apply -f service.yml 
kubectl get services  
kubectl get nodes -o wide  
```
## Demo
![image](https://github.com/Misash/Replit-Clone/assets/70419764/b0bd3bf3-d46a-4edd-b1b0-97526222bf34)
