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

const updatePost = async (id) => {
    const query = `UPDATE posts SET likes=likes+1 WHERE id = $1`
    const value = [id]
    await pool.query(query, value)
};

const deletePost = async (id) => {
    const query = `DELETE FROM posts where id = $1`
    const value = [id]
    await pool.query(query, value)
}

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

app.put('/posts/like/:id', async (req, res) => {
    const { id } = req.params
    try{
        await updatePost(id);
        res.send('Post actualizado exitosamente')
    }
    catch(error){
        console.error('Error al actualizar el post:', error);
        res.status(500).send('Error en el serviro al actualizar el post')
    }
})

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deletePost(id);
        res.send('Post eliminado exitosamente');
    } catch (error) {
        console.error('Error eliminando el post:', error);
        res.status(500).send('Error en el servidor al eliminar el post');
    }
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

