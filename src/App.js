// import { useEffect } from 'react';
import './App.css';
import { Link, Outlet } from 'react-router-dom';
// import axios from 'axios';

function App() {
  function logout() {
    localStorage.removeItem("name");
    alert("Logout Successfully")
  }
  // useEffect(()=>{
  //   axios({
  //     method:'POST',
  //     url:'http://localhost:4650/'
  //   }).then((res)=>{
  //     alert("Inserted")
  //   }).catch((error)=>{
  //     alert(error)
  //   })
  // },[])
  return (
    <div className="App" style={{display:'flex',flexDirection:'row',justifyContent:'flex-start'}}>
      <div style={{width:"40%",marginTop:'20px',textAlign:'center'}}>
        <button type="submit" onClick={() => { logout() }}>Logout</button><br></br>
        <Link to="/register">Register</Link> <br></br>
        <Link to="/login">Login</Link> <br></br>
        <Link to="/speechrecognization">Speech Recognization</Link> <br></br>
        <Link to="/speechrecognizationbyword">Speech Recognization By Word</Link> <br></br>
      </div>
      <div style={{width:'60%',textAlign:'start'}}>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default App;
