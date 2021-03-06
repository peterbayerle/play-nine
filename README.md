# Play Nine app
A real-time card game for the browser
## Demo
Two players can join a lobby on separate devices and play cards in real time:
<img src="static/gameplay.gif">

At the end of the game, scores are tallied and a winner is declared:
<img src="static/gameover.png">

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
