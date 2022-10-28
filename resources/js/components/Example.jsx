import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Example = () => {
    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [auth, setAuth] = useState({})

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)

        window.axios.post('/api/posts', formData)
        .then(resp => {
            setRefresh(!refresh)
            console.log(resp)
        })
        .catch(err => console.log(err))
    }

    const handleLogin = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)

        window.axios.post('/api/login', formData)
        .then(resp => {
            setAuth({
                loggedIn: true,
                user: resp.data.user
            })
            localStorage.setItem('token', resp.data.token)
            window.axios.defaults.headers.common['Authorization'] = `Bearer ${resp.data.token}`;
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        console.log(token)
        if(!token) return

        window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        window.axios.get('/api/check-auth/')
        .then(resp => setAuth({ loggedIn: true }))
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        window.axios.get('/api/posts')
        .then(resp => {
            console.log(resp)
            setData(resp.data)
        })
        .catch(err => console.log(err))
    }, [refresh])

    return (
        <div className="container">
            <h1>Posts</h1>
            <ul>
                {data.map(post => 
                    <li key={post.id}>{post.title}</li>
                )}
            </ul>
            {!auth.loggedIn ?
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label>El. paštas:</label>
                        <input type="text" name="email" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label>Slaptažodis:</label>
                        <input type="password" name="password" className="form-control"/>
                    </div>
                    <div>
                        <button className="btn btn-primary">Jungtis</button>
                    </div>
                </form>
            :
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Pavadinimas:</label>
                        <input type="text" name="title" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label>Turinys:</label>
                        <textarea name="content" className="form-control"></textarea>
                    </div>
                    <div className="mb-3">
                        <label>Nuotrauka:</label>
                        <input type="text" name="image" className="form-control"/>
                    </div>
                    <div>
                        <button className="btn btn-primary">Siųsti</button>
                    </div>
                </form>
            }
        </div>
    );
}

export default Example;

if (document.getElementById('app')) {
    ReactDOM.render(<Example />, document.getElementById('app'));
}
