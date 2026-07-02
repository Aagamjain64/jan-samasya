// api.js
fetch('https://api.positionstack.com/v1/forward?access_key=da15d4fb519c261c72939ff8dd9b6340&query=pratapgarh')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));
