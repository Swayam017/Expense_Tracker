PART 1: AWS EC2 DEPLOYMENT (STEP-BY-STEP)
1️⃣ Create EC2 Instance

Instance type: t2.micro / t3.micro (Free Tier)

OS: Ubuntu 24.04

Key pair: RSA (.pem)

Security Group:

SSH → 22

HTTP → 80

App Port → 3000 (optional after Nginx)

2️⃣ Connect to EC2 (from Windows PowerShell)
ssh -i expense-tracker-key.pem ubuntu@<PUBLIC_IP>

3️⃣ Update Server
sudo apt update
sudo apt upgrade -y

4️⃣ Install Node.js (Node 20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
node -v
npm -v

5️⃣ Install MySQL
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation


Create DB & user:

CREATE DATABASE expensedb;
CREATE USER 'expense_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON expensedb.* TO 'expense_user'@'localhost';
FLUSH PRIVILEGES;

6️⃣ Clone Project
git clone https://github.com/USERNAME/Expense_Tracker.git
cd Expense_Tracker
npm install

7️⃣ Create .env file (ON EC2)
nano .env

PORT=3000
NODE_ENV=production

DB_HOST=localhost
DB_USER=expense_user
DB_PASSWORD=*****
DB_NAME=expensedb

JWT_SECRET=*****

8️⃣ Run App (Manual Test)
node app.js

🔹 PART 2: PM2 (RUN APP 24/7)
9️⃣ Install PM2
sudo npm install -g pm2

🔟 Start App with PM2
pm2 start server.js --name expense-tracker
pm2 list

1️⃣1️⃣ Auto-start on reboot
pm2 save
pm2 startup


(copy & run the command PM2 gives)

🔹 PART 3: NGINX (Reverse Proxy)
1️⃣2️⃣ Install Nginx
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

1️⃣3️⃣ Configure Nginx
sudo nano /etc/nginx/sites-available/default

server {
    listen 80;

    location / {
        proxy_pass http://localhost:3000;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}


Test & restart:

sudo nginx -t
sudo systemctl restart nginx


👉 App now accessible via http://PUBLIC_IP

🔹 PART 4: CI/CD WITH GITHUB ACTIONS
1️⃣4️⃣ Prepare App for Testing

app.js → only exports app

server.js → starts DB + server

Disable DB sync & listen in NODE_ENV=test

1️⃣5️⃣ Install Testing Tools
npm install --save-dev jest supertest


package.json

"scripts": {
  "start": "node server.js",
  "test": "set NODE_ENV=test && jest"
}

1️⃣6️⃣ GitHub CI Workflow (.github/workflows/ci.yml)
name: CI - Expense Tracker

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm test

🔹 PART 5: AUTO DEPLOY (CD)
1️⃣7️⃣ Create SSH Key on EC2
ssh-keygen -t rsa -b 4096 -C "github-actions"

1️⃣8️⃣ Add Public Key
cat ~/.ssh/id_rsa.pub
nano ~/.ssh/authorized_keys


Permissions:

chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

1️⃣9️⃣ Add GitHub Secrets

GitHub → Repo → Settings → Secrets

Secret Name	Value
EC2_HOST	EC2 public IP
EC2_USER	ubuntu
EC2_SSH_KEY	PRIVATE KEY from id_rsa
2️⃣0️⃣ Deploy Workflow (deploy.yml)