const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');
app.use(express.static(path.join(__dirname, '../public'))); // middleware

// app.get('/', (req, res) => {
//     res.render('index');
// });

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});