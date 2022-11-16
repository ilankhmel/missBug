'use strict'
import { userService } from '../services/user.service.js'
import loginSignup from '../cmps/login-signup.cmp.js'
export default {
  template: `
        <header>
            <h1>Miss Bug</h1>   
            <router-link to="/user-details">User Details</router-link> ||
            <router-link to="/bug">Back to List</router-link>            
            <section v-if="user">
            <p>Welcome {{user.fullname}}</p>   
            <button @click="logout">Logout</button>
            </section>
            <section v-else>
                    <login-signup @onChangeLoginStatus="onChangeLoginStatus"></login-signup>
            </section>
        </header>
    `,
    data(){
        return{
            user: userService.getLoggedInUser()
        }
    },
    methods:{
        onChangeLoginStatus(){
            this.user = userService.getLoggedInUser()
        },
        logout(){
            userService.logout()
                .then(()=> {
                    this.user = null
                })
        }
    },

    components: {
        loginSignup,
    }
}
