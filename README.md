# Node-Auth-API

Node API app template demonstrating JSON Web Tokens (JWT) for user authentication.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Clone project and install dependencies 

Install Node.js and NPM - https://nodejs.org/en/

```
git clone <link-to-this-project>
cd node-auth-api
npm install 
```

### Setup MySQL 

Install MySQL and enable remote access: 
- https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-16-04
- https://www.techrepublic.com/article/how-to-set-up-mysql-for-remote-access-on-ubuntu-server-16-04/
- https://www.configserverfirewall.com/ubuntu-linux/enable-mysql-remote-access-ubuntu/

Create a schema 
```
mysql> CREATE DATABASE `node`;
```

Create a users table
```
mysql> CREATE TABLE `node`.`users` (
  `username` VARCHAR(20) NOT NULL,
  `password` VARCHAR(72) NOT NULL,
  `admin` TINYINT UNSIGNED NOT NULL,
  `access-group` VARCHAR(20) NOT NULL,
  `last-active` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `date-created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`)
) ENGINE = InnoDB;
```

### Configure Node and run

Configure nodemon.json to use the schema that was created

```
{
  "env": {
    "MYSQL_IP": <db_host_ip>,
    "MYSQL_UN": <db_user>,
    "MYSQL_PW": <db_password>,
    "MYSQL_SM": <schema_name>,
    "JWT_KEY": "secret"
  }
}
```

Run the app

```
npm run server
```

## Examples

For easy testing, it is recommended to use RESTClient plugin for Firefox - https://addons.mozilla.org/en-US/firefox/addon/restclient/

### Insert new user

http://localhost:3000/users/new

```
HTTP Method: POST
Content-Type: application/json
Body: 
{
  "username":"test",
  "password":"pw1234",
  "admin":0,
  "access":"guest"
}
```

### Edit user

http://localhost:3000/users/edit/:username

```
HTTP Method: PATCH
Content-Type: application/json
Body: 
{
  "password":"pw1234",
  "admin":1,
  "access":"admin"
}
```

### Delete user

http://localhost:3000/users/delete/:username

```
HTTP Method: DELETE
```

### Login

http://localhost:3000/users/login

```
HTTP Method: POST
Content-Type: application/json
Body: 
{
  "username":"test",
  "password":"pw1234"
}
```

returns

```
{
  "message":"Authentication OK","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1ZXN0IiwiYWNjZXNzIjoiZ3Vlc3QiLCJpYXQiOjE1NDI4NTExNzEsImV4cCI6MTU0Mjg1NDc3MX0.QU5LwlJjzHldgFIy60qOykAkEW3OW-d3ibuD3FUSrt0"
}
```

### Accessing a protected route

http://localhost:3000/protected - requires a valid token in HTTP header

```
HTTP Method: GET
Authorization: Bearer <token>
```

### Accessing a access-protected route

http://localhost:3000/guest-protected - requires a token with valid access-group i.e. access='guest' in HTTP header
http://localhost:3000/admin-protected - requires a token with valid access-group i.e. access='admin' in HTTP header

```
HTTP Method: GET
Authorization: Bearer <token>
```
