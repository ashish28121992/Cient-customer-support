# EC2 SSL Error Fix - Complete Solution

## Problem:
```
GET https://44.221.30.127:4000/search?userId=CLIENT001 
net::ERR_SSL_PROTOCOL_ERROR
```

## Root Cause:
- Frontend HTTPS par hai (Cloudflare se)
- Backend EC2 HTTP par hai (SSL nahi hai)
- Browser HTTPS → HTTP block kar raha hai (mixed content)

---

## Solution: Cloudflare Proxying (EASIEST) ⭐⭐⭐

### Step 1: Cloudflare DNS Update

Cloudflare mein DNS record update karo:

```
Type: A
Name: api
Target: 44.221.30.127
Proxy: ON (Orange Cloud) ✅ VERY IMPORTANT
```

**Proxy ON = Orange Cloud = HTTPS mil jayega**

### Step 2: EC2 Nginx Setup

```bash
# Nginx install
sudo apt-get update && sudo apt-get install nginx -y

# Config file
sudo nano /etc/nginx/sites-available/default
```

**Config:**
```nginx
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Restart
sudo systemctl restart nginx
```

### Step 3: Frontend Config

**src/config.js line 13:**
```javascript
return 'https://api.yourdomain.com'; // Cloudflare domain
```

**Rebuild aur deploy!**
