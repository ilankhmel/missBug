const express = require('express')
const cookieParser = require('cookie-parser')
const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())



// Express Routing:

//LIST
app.get('/api/bug', (req, res) => {
    // let filter = req.query.filterBy
    console.log(req.query);
    const { title, page, ownerName } = req.query
    console.log('title', title);
    const filterBy = {
        title: title || '',
        page: +page || 0,
        ownerName: ownerName || ''
    }
    bugService.query(filterBy)
        .then(bugs => {
            res.send(bugs)
        })
})

//READ
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    var visitedBugs = req.cookies.visitedBugs || []
    console.log(visitedBugs);
    if (!visitedBugs.includes(bugId)) visitedBugs.unshift(bugId)

    if (visitedBugs.length >= 3) {
        // console.log('Wait for a bit');
        return res.status(401).send('Wait for a bit')
    }

    console.log('User visited at the following bugs:', visitedBugs)


    bugService.getById(bugId)
        .then(bug => {
            res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
            res.send(bug)
        })
})

// ADD
app.post('/api/bug/', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot add bug')

    const { title, description, severety } = req.body

    const bug = {
        title,
        description,
        severety,
        owner: loggedInUser,
    }

    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
            userService.getById(loggedInUser._id)
                .then(user => {
                    user.bugs++
                    userService.save(user)
                })
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot add bug')
        })
})

//UPDATE
app.put('/api/bug/:bugId', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot add bug')

    const { _id, title, description, severety, owner } = req.body
    const bug = {
        _id,
        title,
        description,
        severety,
        owner,
    }
    bugService.save(bug, loggedInUser)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot edit bug')
        })
})

//DELETE

app.delete('/api/bug/:bugId', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot delete bug')

    const { bugId } = req.params
    bugService.remove(bugId, loggedInUser)
        .then(() => {
            res.send('Removed!')
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot delete bug')
        })
})

//LOGIN

app.post('/api/auth/login', (req, res) => {
    userService.checkLogin(req.body)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)

            } else {
                res.status(404).send('Invalid login')
            }
        })
})

//SIGNUP

app.post('/api/auth/signup', (req, res) => {
    console.log(req.body);
    userService.save(req.body)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
})

//LOGOUT 
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})


//USER-LIST

app.get('/api/user-list', (req,res)=>{
    userService.query()
        .then(users =>{
            res.send(users)
        })
})

//DELETe-USER

app.delete('/api/user-list:userId', (req, res)=>{
    console.log(req.params);
    const { userId } = req.params
    userService.remove(userId)
        .then(() => res.send('removed!'))
})

//DOWNLOAD

app.get('/api/bug/pdf/download', (req, res) => {
    console.log('QAAAA');
    bugService.downloadPDF()
        .then((doc) => {
            res.send(doc)

        })
})


app.listen(3030, () => console.log(`Server ready at port http://localhost:3030`))