# node-user-authentication
This is a web application for user login and registration using Node.js, Express, Passport, Mongoose and EJS.

## Installation
```bash
$npm install
```

## Usage

create env file and store corresponding secrets into it<br>
ex : <br>

```env
  PASSPORT_SECRET = type-passport-secret-here
  
  GOOGLE_CLIENT_ID = type-google-clientid-here
  GOOGLE_CLIENT_SECRET = type-google-clientsecret-here

  FACEBOOK_APP_ID = type-fb-appid-here
  FACEBOOK_APP_SECRET = type-fb-appsecret-here
```
 run the app
 
```bash
$nodemon app.js
```

visit http://localhost:3000/
