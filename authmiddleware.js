import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next){
    const token = req.headers?.authorization?.split(' ')[1]
    if(!token) {
        res.send('Please, log in!')
    }
    jwt.verify(token, 'secret', (err, user) => {
        if (err) {
            res.send('Please, log in invalid token')
        }
        req.user = user
        next()
    })
}

export default authMiddleware;