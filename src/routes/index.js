const routes = (app) => {
    app.get('/api/user', (req, res) =>{
        res.send('Users Page')
    } )
}

module.exports = routes;