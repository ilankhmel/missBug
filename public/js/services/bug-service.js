import { storageService } from './async-storage-service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  downloadBugs
}

function query(filterBy) {
  // return storageService.query(STORAGE_KEY)
  // console.log(filterBy);
  return axios.get(BASE_URL, { params: filterBy })
  .then(res => {
    // console.log(res.data)
    return res.data
  })
}

function getById(bugId) {
  // return storageService.get(STORAGE_KEY, bugId)
  return axios.get(BASE_URL + bugId).then(res => res.data)
}

// function getBugsByOwner(name){
//   return axios.get(BASE_URL + bugId).then(res => res.data)
// }

function getEmptyBug() {
  return {
    title: '',
    severity: '',
  }
}

function remove(bugId) {
  // return storageService.remove(STORAGE_KEY, bugId)
  return axios.delete(BASE_URL + bugId)
}

function save(bug) {
  // return storageService.put(STORAGE_KEY, bug)
  // return storageService.post(STORAGE_KEY, bug)
  // const url = BASE_URL + 'save'
  // var queryParams = `?title="${bug.title}"&description="${bug.description}&severity="${bug.severety}""`
  // if (bug._id) queryParams += `$_id="${bug._id}"`
  if(bug._id){
     return axios.put(BASE_URL + bug._id, bug).then(res => res.data)
  }
     return axios.post(BASE_URL, bug).then(res => res.data)
  
}


function downloadBugs(){
  return axios.get(BASE_URL + 'download')
  // query()
  //   .then((res)=>{
  //     download(res, filename = 'bugs.pdf'){

  //     }
  //   })
}