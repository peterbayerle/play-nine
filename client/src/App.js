import { SocketIOClient } from './containers/SocketIOClient.js';
import { Home } from './screens/Home.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <SocketIOClient
      router={ (props) => (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home {...props} />}> </Route>
          </Routes>
        </BrowserRouter>
      )
      }
    />
  );
}

export default App;