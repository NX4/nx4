import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>home component</h1>
    <ul>
      <li><Link to="/tool/ebola">Ebola</Link></li>
      <li><Link to="/tool/muv">MUV</Link></li>      
    </ul>
    <div className="upload">
      <form
        action="/api/upload"
        encType="multipart/form-data"
        method="post"
        target=""
      >
        <input type="file" name="upload" multiple="multiple" />
        <label htmlFor="choose-file" className="upload-file" />
        <input type="submit" value="Upload" />
      </form>
    </div>
  </div>
);

export default Home;
