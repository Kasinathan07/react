import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './Dashboard';
import Login from './Login';

function App() {
  const [user, setUser] = useState(false)

  setInterval(() =>{
     if(localStorage.getItem('profile')){
      setUser(true)
     }else{
      setUser(false)
     }
  },300)
  return (
    <div>
      <Header />
      {user ? 
      <Dashboard /> :
      <Login />
}
    </div>
  );
}

export default App;
