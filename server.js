const express = require('express');
const fs = require('fs');
const path = require('path');


const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming data
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('public'))

app.listen(PORT, () => {
    console.log(`API server note listening on port ${PORT}!`)
});