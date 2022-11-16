import { bugService } from "../services/bug-service.js"
import { userService } from "../services/user.service.js"
export default {
    template:`
        <h1>Hello {{user.fullname}}</h1>
        <p v-if="user">Your bugs: {{ userBugs }}</p>
        <p v-if="user.isAdmin">Your users: {{ users }}</p>
        <p v-if="user.isAdmin">Delete users:
            <select @click="setUser">
                <option  v-if="user.isAdmin" v-for="user in usersAllowedToDelete" :key="username" :value="username" >{{ user.username }}</option>
            </select>
        </p>
        <pre>chosen user:  {{ chosenUser }}</pre>
        <button @click="deleteUser">DELETE</button>

    `,
    data(){
        return{
            usersObj: '',
            user: '',
            users: '',
            userBugs: [],
            chosenUser: '',
            usersAllowedToDelete: ''
        }
    },
    created(){
        this.loadData()
    },
    methods:{
        loadData(){
            this.user = userService.getLoggedInUser() || ""
            console.log(this.user);
            bugService.query({ title: '', page: 0, ownerName: this.user.fullname })
                .then(bugs => {
                    var bugNames = bugs.filteredBugs.map(bug => bug.title)
                    this.userBugs = bugNames.toString()
                    this.getUsers()
                })
            },
            
            getUsers(){
                userService.query()
                .then(users => {
                    this.usersAllowedToDelete = users.filter(user => user.bugs === 0 && user.username !== 'admin')
                    
                    var userNames = users.map(user => user.username)
                    // console.log(userNames);
                    this.users = userNames.filter(name => name !== 'admin')
                    // console.log([this.users]);
                })
        },

        setUser(e){
            var val = document.querySelector('select').value
            this.chosenUser = val
        },  

        deleteUser(){
            var user = this.usersObj.find(user => user.username === this.chosenUser)
            // console.log(user._id);
            userService.remove(user._id)
                .then(()=> this.loadData())
        }
    },
    computed:{
        formatUsers(){
            var userNames = this.users.map(user => user.username )
            return userNames.filter(name => name !== 'admin').toString()
        },
        userBugs(){
            // console.log(this.user.owner.fullname);
            // var filterBy = {
            //     ownerName: this.user.owner.fullname,
            // }
            // userService.query(filterBy)   
            //     .then(bugs => this.userBugs = bugs)
        }
    }
}