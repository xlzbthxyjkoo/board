import './App.css'
import { Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Lists from './pages/Lists';
import Board from './pages/Board';


function App() {

  return (
    <div>
      {/* <Main>
        <List/>
        <Board/>
      </Main> */}
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/Lists' element={<Lists/>}/>
        <Route path='/Board/:article_no' element={<Board/>}/>
      </Routes>
    </div>
  )
}

export default App;