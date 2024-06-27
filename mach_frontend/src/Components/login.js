import React, { useEffect, useState } from 'react';
import { useLoginMutation } from '../redux/authorization.js';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';
import { loginSuccess } from '../redux/autorizationslice.js';
import './main';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
  }, [isAuthenticated, error, navigate]);

  const handleSubmitClick = (e) => {
    e.preventDefault();
    const loginData = {
      email,
      password,
    };
    login(loginData).unwrap().then((result) => {
      localStorage.setItem('authToken', result.access_token);
      dispatch(loginSuccess({ token: result.access_token, user: email }));
      navigate("/main");
    }).catch((err) => {
      console.error(err);
      toast.error("Login failed");
    });
  };

  return (
    <div className='loginpage'>
      <div className='topcontainer'>
        <div className='headinng'>
          <h1 className='h1'>MACH</h1>
          <p className='description'>
            Welcome to MathCo Capability Hub, <br /> <br />
            This is a centralized platform designed to provide comprehensive insights into the skills and capabilities of employees within our organization.
          </p>
        </div>
      </div>
      <div className="rowwwrapper">
        <div className="form-container">
          <form className="shadow rounded bg-body" onSubmit={handleSubmitClick}>
            <h2 className="mb-4">Login</h2>
            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">Email</label>
              <input
                type="email"
                id="email_field"
                placeholder='Email'
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password_field" className="form-label">Password</label>
              <input
                type="password"
                id="password_field"
                placeholder='Password'
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

           

            <button
              id="login_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              LOGIN
            </button>

            <div className="my-3">
              <Link to="/Components/registration" className="float-end">New User?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
