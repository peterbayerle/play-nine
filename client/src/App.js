import { SocketIOClient } from './containers/SocketIOClient.js';
import { Home } from './screens/Home.js';
import { BoardScreen } from './screens/BoardScreen.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <SocketIOClient>
      { ({ socket }) => <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home socket={socket} />}>
          </Route>
          <Route path="/:lobbyId" element={
            <BoardScreen socket={socket} /> }
          ></Route>
        </Routes>
      </BrowserRouter>} 
    </SocketIOClient>
  );
}

export default App;
