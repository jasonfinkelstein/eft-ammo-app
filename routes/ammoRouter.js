const express = require('express');
const axios = require('axios');

const router = express.Router();



router.get('/', (req, res) => {
    res.render('home', {data:[], searchQuery: ''});
});



router.get('/ammo', async (req, res) => {
    const search = req.query.search || 'none';
    const query = `{
    ammo(lang:en, gameMode:regular, limit:185, offset:0) {
    	item{image512pxLink}
        item{name}
        item{wikiLink}
    	damage
    	penetrationPower	
    	armorDamage
        caliber
        item{basePrice}
        item{avg24hPrice}
  }
}`;
    const defaultSearchBy = 'caliber';
    const sortBy = req.query.sortBy || defaultSearchBy;
    const sortOrder = req.query.sortOrder || 'asc';
    console.log(sortBy)
    console.log(sortOrder)
    try {
        const response = await axios.post('https://api.tarkov.dev/graphql', {
            query: query
        });
        
        const allAmmo = sortResults(response.data.data.ammo, sortBy, sortOrder);
        
        const searchResults = allAmmo.filter((ammo) => (ammo.item.name).toLowerCase().includes(search.toLowerCase()));
        // res.json(results)
        const results = sortResults(searchResults, sortBy, sortOrder);

        if (search == 'none') {
            res.render('ammo', {data: allAmmo, searchQuery:''});
            return;
        }
        
        if (!results.length) {
            res.render('ammo', {data:[], searchQuery:'No results were found!'});
        } else {
            res.render('ammo', {data:results, searchQuery:search});
        }
        

    } catch (error) {
        console.log('Error:', error)
    }

});





function sortResults(results, sortBy, sortOrder) {
    const sortedResults = results.toSorted((result1, result2) => {
        if (result1[sortBy] > result2[sortBy]) {
            return 1;
        } else {
            return -1;
        }
    });

    if (sortOrder == 'desc') {
        sortedResults.reverse();
    }

    return sortedResults;
}

module.exports = router;