const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'likeme',
    password: "postgres",
    port: 5432
});

const getPosts = async () => {
    const query = 'SELECT * FROM posts'
    const result = await pool.query(query)
    return result.rows
};

const addPost = async (titulo, img, descripcion) => {
    const query = `INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0)`
    const values = [titulo, img, descripcion]
    await pool.query(query, values)
};

app.get("/posts", async (req, res) => {
    try{
        const posts = await getPosts()
        res.json(posts)    
    }
    catch(error){
        console.error('Error obteniendo los posts: ', error)
        res.status(500).send('Error en el servidor al obtener los posts')
    }
});

app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion } = req.body;
    try {
        await addPost(titulo, img, descripcion);
        res.send('Post agregado exitosamente');
    }
    catch (error) {
        console.error('Error agregando el post:', error);
        res.status(500).send('Error en el servidor al agregar el post');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

