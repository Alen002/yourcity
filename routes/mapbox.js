/* if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
dotenv = require('dotenv').config();
 */

const express = require('express');
const router = express.Router();
// mapbox
const geocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapbox = process.env.MAPBOX;
const geoCoder = geocoding({ accessToken: mapbox }); 

// check whether mapbox is working
router.get('/mapbox', async (req, res) => {
  try {
    await geoCoder.forwardGeocode({
      query: 'Ho Chi Minh City, Vietnam',
      limit: 2
    })
      .send()
      .then(response => {
        const result = response.body;
        res.json(result);
      });
  } 
    catch(err) {
      res.send('Could not retrieve data from mapbox');
  }
});
  
module.exports = router;