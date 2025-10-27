# CORS Error Fix - Backend Configuration

## Problem:
```
Access to XMLHttpRequest blocked by CORS policy
No 'Access-Control-Allow-Origin' header
```

## Root Cause:
Backend mein CORS headers missing hain.

---

## Solution: Backend mein CORS Enable Karo

### Step 1: EC2 par jao

```bash
ssh -i your-key.pem ubuntu@44.221.30.127
cd /path/to/backend
```

### Step 2: Backend Code Mein CORS Add Karo

**Agar Express.js hai:**

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'https://mydiamond99clientsupport.in',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Ya simple:
app.use(cors());
```

**Ya manually headers add karo:**

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
```

### Step 3: Restart Backend

```bash
# PM2 use kar rahe ho toh:
pm2 restart all

# Ya manually:
npm start
# Or
node server.js
```

---

## Nginx Configuration (If using)

EC2 par Nginx config:

```nginx
server {
    listen 80;
    server_name api.mydiamond99clientsupport.in;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## Quick Test:

```bash
# EC2 mein:
curl -H "Origin: https://mydiamond99clientsupport.in" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS \
  http://localhost:4000/search
```

Should return CORS headers.

---

## Expected Result:

✅ API calls work karengi
✅ CORS error nahi aayega
✅ Mobile aur web dono mein search chalega

