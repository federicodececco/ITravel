import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import DefaultLayout from './Layout/DefaultLayout';
import HomePage from './pages/HomePage';
import MyTravels from './pages/MyTravels';
import NewPage from './pages/NewPage';
import Page from './pages/Page';
import TravelDetail from './pages/TravelDetail';
import TravelDetailLayout from './Layout/TravelDetailLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/travel' element={<MyTravels />}></Route>
          <Route path='/page/add' element={<NewPage />}></Route>
        </Route>
        <Route element={<TravelDetailLayout />}>
          <Route path='/details/:travelId' element={<TravelDetail />}></Route>
        </Route>

        <Route path='/travel/:travelId/page/:pageId' element={<Page />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
