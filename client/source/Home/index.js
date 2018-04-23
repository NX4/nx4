import React from 'react';

const Home = () => (
  <div>
    <h1>home component</h1>
    <div class="upload">
      <form
        action="/api/upload"
        enctype="multipart/form-data"
        method="post"
        target=""
      >
        <input type="file" name="upload" multiple="multiple" />
        <label for="choose-file" class="upload-file" />
        <input type="submit" value="Upload" />
      </form>
    </div>
  </div>
);

export default Home;
