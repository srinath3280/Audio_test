import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    var navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: 'http://localhost:4650/login',
            data: formData
        })
            .then((res) => {
                // console.log(res);
                if (res) {
                    localStorage.setItem('name', res.data.name);
                    alert("Login Successfully");
                    navigate('/speechrecognization')
                } else {
                    alert('User records do not match');
                }
            }).catch((error) => {
                alert('User records do not match');
            })
    };

    return (
        <>
            <h2>Login Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </>
    );
};

export default LoginForm;
