const express = require('express');
const path = require('path');
const fs = require ('fs');
const util = require('util');
const { v4:uuidv4 } = require('uuid');


// server
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


// Asynchronous Processes
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Get API
app.get('/api/notes',(req, res) => {
   console.info(`${req.method}`);
   readFile("./db/db.json")
   .then((data)=>{
    res.json(JSON.parse(data))
   });
});

// POST route
app.post('/api/notes', (req, res)=>{
    const {title, text} = req.body;
    if (title && text){
        console.info(`{req.method}`);
        const newNote = {
            title, 
            text,
            id: uuidv4(),
        };

        readFile('./db/db.json')
        .then((data)=>{
            const notes =JSON.parse(data);
            notes.push(newNote);
            writeFile("./db/db.json", JSON.stringify(notes));
        });

        const response = {
            status: "Success",
            body: newNote
        }

        res.status(201).json(response);
    } 
    else {
        res.status(500).json(`Failed attempt`)
    }
    });

    // Delete
    app.delete("/api/notes/:id", (req, res)=> {
        readFile("./db/db.json")
        .then((data)=>{
            const database =JSON.parse(data);
            for (let i=0; i<database.length; i++){
                if(database[i].id === req.params.id){
                    database.splice(i, 1);
                    writeFile("./db/db.json", JSON.stringify(database));
                    return res.status(200).json(`Deleted note`)
                }
            }
            return res.status(500).json(`Note couldn't be deleted`)
        })
    })



    // HTML routes
    app.get("/notes", (req, res)=>{
        res.sendFile(path.join(__dirname, "/public/notes.html"));
    });

    app.get("/", function(req, res){
        res.sendFile(path.join(__dirname, "/public/index.html"));
    });

    app.get("*", function(req, res){
        res.sendFile(path.join(__dirname, "/public/notes.html"));
    });


    // Listening
    // app.listen(PORT, function(){
    //     console.log(`Listening on Port ${PORT}`)
    // });

    app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);