const axios = require('axios');

axios.get('http://localhost:5000')
 .then(response => {
    console.log(response.data); // Affiche "Hello, Flask!"
  })
 .catch(error => {
    console.error(error);
  });
