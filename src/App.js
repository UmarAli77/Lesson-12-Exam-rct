import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LayoutPage from './components/Layout';
import ProductsPage from './components/ProductPage';
import Categories from './components/CategoryPage';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<LayoutPage />}>
            <Route path='/products' element={<ProductsPage />} />
            <Route path='/category' element={<Categories />} />
          </Route>
          <Route path='/login' element={<Login />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
