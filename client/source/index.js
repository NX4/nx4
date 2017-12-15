import axios from 'axios';
import './style.scss';

console.log(__ENV__);

axios.get('api/variations/ENSP00000478234')
  .then(function (response) {
    console.log(response.data);
    document.getElementById('root').innerHTML = response.data.length;
  })
  .catch(function (error) {
    console.log(error);
  });

function search(str) {
  if (str.length > 2) {
    axios.get(`api/proteins/search/${str}`)
    .then(function (response) {
      console.log('responce')
      console.log(response.data);
      // document.getElementById('root').innerHTML = response.data.length;
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

document.getElementById('search').onkeypress = (e) => {
  search(e.target.value);
};
