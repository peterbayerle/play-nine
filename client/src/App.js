import { SocketIOClient } from './containers/SocketIOClient.js';
import { Home } from './screens/Home.js';
import { Game } from './screens/Game.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={
            <SocketIOClient>
              {(props) => <Home {...props} />}
            </SocketIOClient>
          }>
        </Route>
        <Route path="/:lobbyId" 
          element={
            <SocketIOClient>
              {(props) => <Game {...props} />}
            </SocketIOClient>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
