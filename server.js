const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
// Serve static files
// app.use(express.static('public'));

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));


// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // Your MySQL username
  password: '', // Your MySQL password
  database: 'todo_db',
});


db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Routes
app.get("/",(req,res)=>{
  res.send("index")
})

app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/todos', (req, res) => {
  try{
    console.log(req.body)
    const { task } = req.body;
    db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, task, completed: false });
    });
  }catch(e){
    console.log(e)
  }
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  db.query('UPDATE todos SET task = ?, completed = ? WHERE id = ?', [task, completed, id], err => {
    if (err) throw err;
    res.json({ id, task, completed });
  });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], err => {
    if (err) throw err;
    res.json({ message: 'Todo deleted' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
