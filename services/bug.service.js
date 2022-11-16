const fs = require('fs')
const bugs = require('../data/bug.json')
const PDFDocument = require('pdfkit');

module.exports = {
    query,
    save,
    getById,
    remove,
    downloadPDF,
}

const itemsPerPage = 2

function query(filterBy){
    const { title, page, ownerName } = filterBy
    console.log('ownername', ownerName);
    const regex = new RegExp (title, 'i')
    let filteredBugs = bugs.filter(bug => regex.test(bug.title)) 
    console.log(bugs);

    if (ownerName) filteredBugs = filteredBugs.filter(bug => bug.owner.fullname === ownerName)

    const startIdx = page * itemsPerPage
    const totalPages = Math.ceil(filteredBugs.length / itemsPerPage)
    filteredBugs = filteredBugs.slice(startIdx, startIdx + itemsPerPage)
    return Promise.resolve({totalPages, filteredBugs})
}

function save(bug, loggedInUser){
    if(bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        if(!loggedInUser.isAdmin && bugs[idx].owner._id !== loggedInUser._id) return Promise.reject('Not your bug')
        bugs[idx] = bug
    } else {
        bug._id = _makeId()
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
} 

function getById(bugId){
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedInUser){
    const idx = bugs.findIndex(bug => bug._id === bugId)
    console.log(loggedInUser);
    if(!loggedInUser.isAdmin && bugs[idx].owner._id !== loggedInUser._id) return Promise.reject('Not your bug')
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)

        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function downloadPDF(filename = 'bugs.pdf') {
    const doc = new PDFDocument();
    console.log(bugs);
    bugs.forEach(bug => {
        doc.pipe(fs.createWriteStream(filename))
        doc.text(`
        Id:${bug._id}
        title:${bug.title}
        Description:${bug.description}
        severety: ${bug.severety}
        `)     
        
        doc.addPage()
    })
    // var document = doc.end()
    return Promise.resolve(doc.end())
    doc.end();
}


function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}