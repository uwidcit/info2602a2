[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/uwidcit/info2602a2) 

# Testing
1. Update globals.json with your server url and a valid user token

globals.json
```
{
	"id": "80cd143f-8bb4-4313-8f28-a1eaa6ca3cee",
	"values": [
		{
			"key": "a2host",
			"value": [server url here],
			"enabled": true
		},
		{
			"key": "token",
			"value": [valid user token here],
			"enabled": true
		}
	],
	"name": "INFO 2602 Globals",
	"_postman_variable_scope": "globals",
	"_postman_exported_at": "2020-03-25T01:40:13.952Z",
	"_postman_exported_using": "Postman/7.21.1"
}
```

2. Update test.js with your server url

test.js
```
const puppeteer = require('puppeteer');
const { expect, assert }  = require('chai');


let URL = [server root url];

const HEADLESS = true;
const TIMEOUT = 12000;
...
```

3. Execute the following command to test Pokelisting page

```
npm test
```

4. Execute the following comand to test the api

```
npm start
```
