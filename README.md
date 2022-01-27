# Play Nine app

## Server
### Install dependencies and activate venv
```
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
### Start server
```
python3 start_server.py
```
### Run tests
```
python3 -m unittest discover tests
```

## Client
### Install dependencies
```
cd client
npm install 
```
### Start app (after server is already running)
```
npm start
```