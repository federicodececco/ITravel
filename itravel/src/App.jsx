import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import DefaultLayout from './Layout/DefaultLayout';
import HomePage from './pages/HomePage';
import MyTravels from './pages/MyTravels';
import NewPage from './pages/NewPage';
import Page from './pages/Page';
import TravelDetail from './pages/TravelDetail';
import TravelDetailLayout from './Layout/TravelDetailLayout';
import NewTravel from './pages/NewTravel';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContextProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import ProfileCompletition from './pages/ProfileCompletition';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthContextProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            {/* Route pubbliche (senza SearchProvider necessario) */}
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />

            {/* Route protette con DefaultLayout (che include NavbarDesktop) */}
            <Route
              element={
                <ProtectedRoute>
                  <DefaultLayout />
                </ProtectedRoute>
              }
            >
              <Route path='/profile' element={<ProfileCompletition />} />
              <Route path='/' element={<HomePage />} />
              <Route path='/travel/add' element={<NewTravel />} />
              <Route path='/travel' element={<MyTravels />} />
              <Route path='add/:travelId/new-page' element={<NewPage />} />
            </Route>

            {/* Route protette con TravelDetailLayout */}
            <Route
              element={
                <ProtectedRoute>
                  <TravelDetailLayout />
                </ProtectedRoute>
              }
            >
              <Route path='/details/:travelId' element={<TravelDetail />} />
            </Route>

            {/* Route singole protette */}
            <Route
              path='/travel/:travelId/page/:pageId'
              element={
                <ProtectedRoute>
                  <Page />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </AuthContextProvider>
  );
}

export default App;
