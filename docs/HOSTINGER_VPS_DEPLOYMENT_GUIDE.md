# Hostinger VPS Production Deployment Guide

This guide provides step-by-step instructions for deploying the **Samud Shabkat E-Commerce Ordering Platform** onto a **Hostinger VPS** using Docker Compose, Nginx Reverse Proxy, and Let's Encrypt SSL.

---

## 📋 Prerequisites & Requirements

- **Hostinger VPS Plan**: KVM 2 / KVM 4 (Minimum 2 vCPU, 4GB RAM recommended).
- **OS**: Ubuntu 22.04 LTS or Ubuntu 24.04 LTS (Clean install).
- **Domain Name**: Registered domain (e.g., `samudshabkat.com`).
- **Cloudflare Account (Optional but Recommended)**: For DNS management and Cloudflare R2 bucket storage.

---

## 🌐 Step 1: DNS Setup (Hostinger / Cloudflare)

Configure your Domain DNS records pointing to your Hostinger VPS Public IP address:

| Record Type | Host | Points To / Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `<YOUR_HOSTINGER_VPS_IP>` | Auto |
| **A** | `www` | `<YOUR_HOSTINGER_VPS_IP>` | Auto |
| **A** | `api` | `<YOUR_HOSTINGER_VPS_IP>` | Auto |

---

## 🔑 Step 2: VPS SSH Access & System Update

Connect to your Hostinger VPS via SSH terminal:

```bash
ssh root@<YOUR_HOSTINGER_VPS_IP>
```

Update system packages:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw htop ca-certificates gnupg
```

Configure Firewall (UFW):

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🐳 Step 3: Install Docker Engine & Compose Plugin

Install official Docker packages:

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

---

## 📂 Step 4: Clone Repository & Setup Environment

Clone the workspace repository to your VPS:

```bash
cd /var/www
git clone https://github.com/ansabazys/samud-shabkat.git
cd samud-shabkat
```

Create production environment file `.env.production`:

```bash
nano .env.production
```

Add your production secrets:

```env
# Node & Database Settings
NODE_ENV=production
POSTGRES_DB=samud_shabkat
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YourStrongPasswordHere2026!
DATABASE_URL=postgres://postgres:YourStrongPasswordHere2026!@postgres:5432/samud_shabkat

# Authentication JWT Secret
JWT_SECRET=YourSuperSecret64CharacterJwtKeyHere!

# Cloudflare R2 Media Storage
R2_ACCOUNT_ID=your_cloudflare_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=samud-shabkat-media
R2_PUBLIC_DOMAIN=https://media.samudshabkat.com

# SMTP Email Dispatch
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ansabazys@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=orders@samudshabkat.com

# Frontend API URL
NEXT_PUBLIC_API_URL=https://samudshabkat.com/api/v1
```

Copy to `.env`:

```bash
cp .env.production .env
```

---

## 🛠️ Step 5: Database Seeding & Production Container Build

Build and launch production Docker containers:

```bash
docker compose -f docker/docker-compose.prod.yml --env-file .env.production up -d --build
```

Run database migrations and seed default Super Admin & catalog data:

```bash
docker compose -f docker/docker-compose.prod.yml exec api pnpm --filter @samud/database db:migrate
docker compose -f docker/docker-compose.prod.yml exec api pnpm --filter @samud/database db:seed
```

Default Super Admin Credentials:
- **Email**: `admin@samudshabkat.com`
- **Password**: `SuperAdmin123!`

---

## 🔒 Step 6: Setup Free Let's Encrypt SSL Certificate

Issue Let's Encrypt SSL certificates for your domain:

```bash
docker compose -f docker/docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d samudshabkat.com -d www.samudshabkat.com --email ansabazys@gmail.com --agree-tos --no-eff-email
```

Reload Nginx to activate HTTPS:

```bash
docker compose -f docker/docker-compose.prod.yml exec nginx nginx -s reload
```

---

## 📊 Step 7: Verification & Health Checks

Check container health status:

```bash
docker compose -f docker/docker-compose.prod.yml ps
```

All 5 services should show `UP / Running`:
1. `samud-postgres-prod` (Database)
2. `samud-api-prod` (Fastify Backend)
3. `samud-web-prod` (Next.js App)
4. `samud-nginx-prod` (SSL Reverse Proxy)
5. `samud-certbot` (Automated SSL Renewal)

Access URLs:
- **Customer Storefront**: `https://samudshabkat.com`
- **Admin Dashboard**: `https://samudshabkat.com/admin/login`
- **Backend REST API**: `https://samudshabkat.com/api/v1/health`

---

## 💾 Step 8: Automated Daily Database Backups (Cron)

Create daily backup script `/var/www/backup-db.sh`:

```bash
nano /var/www/backup-db.sh
```

Insert script:

```bash
#!/bin/bash
BACKUP_DIR="/var/www/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR

docker exec samud-postgres-prod pg_dump -U postgres samud_shabkat > $BACKUP_DIR/db_backup_$TIMESTAMP.sql
find $BACKUP_DIR -type f -mtime +7 -name "*.sql" -delete
```

Make executable and schedule in cron:

```bash
chmod +x /var/www/backup-db.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/backup-db.sh") | crontab -
```
