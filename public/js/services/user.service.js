const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

export const userService = {
    getLoggedInUser,
    login,
    signup,
    logout,
    query,
    remove,
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function query(){
    return axios.get('/api/user-list')
        .then(res => res.data)
        .then(users => {
            return users
        })
}

function remove(userId) {
    // return storageService.remove(STORAGE_KEY, bugId)
    return axios.delete('/api/user-list' + userId)
        .then(res => res.data)
        .then(res => res)
  }

function login( {username, password} ){
    return axios.post('/api/auth/login', {username, password})
        .then(res => res.data)
        .then(user => {
            return setLoggedinUser(user)
        })
  }

function signup( {username, password, fullname} ){
    const user = {username, password, fullname}
    console.log(user);
    return axios.post('/api/auth/signup', user)
        .then(res => res.data)
        .then(user => {
            return setLoggedinUser(user)
        })
}

function logout(){
    return axios.post('/api/auth/logout')
        .then(()=>{
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
}
  function setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}