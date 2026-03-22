const server = require('./src/app.js');
const { conn } = require('./src/db.js');

conn.sync({ force: false }).then(() => {
  const port = process.env.PORT || 3001;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
