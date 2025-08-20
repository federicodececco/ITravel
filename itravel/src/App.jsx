import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import DefaultLayout from './Layout/DefaultLayout';
import HomePage from './pages/HomePage';
import MyTravels from './pages/MyTravels';
import NewPage from './pages/NewPage';
import Page from './pages/Page';
import TravelDetail from './pages/TravelDetail';
import TravelDetailLayout from './Layout/TravelDetailLayout';
import NewTravel from './pages/newTravel';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route element={<DefaultLayout />}>
            <Route path='/' element={<HomePage />}></Route>
            <Route path='/travel/add' element={<NewTravel />} />
            <Route path='/travel' element={<MyTravels />}></Route>
            <Route path='add/:travelId/new-page' element={<NewPage />}></Route>
          </Route>
          <Route element={<TravelDetailLayout />}>
            <Route path='/details/:travelId' element={<TravelDetail />}></Route>
          </Route>

          <Route
            path='/travel/:travelId/page/:pageId'
            element={<Page />}
          ></Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
