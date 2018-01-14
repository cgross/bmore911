const express = require('express')
const { Pool } = require('pg')
import createQuery from './create-query'
const config = require('./config.json');



const connectionString = `postgresql://${config.dbuser}:${config.dbpw}@${config.dbhost}:${config.dbport}/${config.dbname}`

const pool = new Pool({
    connectionString: connectionString,
})

const app = express()

app.use(express.static('public'))

app.get('/data', (req, res) => {

    console.log(req.query)

    var queryConfig = createQuery(req.query)

    console.log(queryConfig)

    pool.query(queryConfig, (err, result) => {
        res.send(result.rows);
        if (err) console.log(err);
    })

})

app.listen(3000, () => console.log('Listening on port 3000!'))
