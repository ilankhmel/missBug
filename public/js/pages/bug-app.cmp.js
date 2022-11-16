'use strict'
import { bugService } from '../services/bug-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <button @click="setPage(-1)">Previous</button>
        <button @click="setPage(1)">Next</button>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        title: '',
        page: 0,
      },
      totalPages: 0,
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    setPage(dir){
      this.filterBy.page += +dir
      if(this.filterBy.page > this.totalPages - 1) this.filterBy.page = 0
      if(this.filterBy.page < 0) this.filterBy.page = this.totalPages - 1
      this.loadBugs()
    },
    download(){
      console.log('laa');
      // bugService.downloadBugs()
      //   .then((doc) => {
      //     console.log('downloading');
      //     // doc.end()
      //   })
    },
    loadBugs() {
      // console.log('loading');
      bugService.query(this.filterBy).then(({totalPages, filteredBugs}) => {
        this.bugs = filteredBugs
        this.totalPages = totalPages
      })
    },
    setFilterBy(filterBy) {
      this.filterBy.title = filterBy.title
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => this.loadBugs())
    },
  },
  computed: {
    bugsToDisplay() {
      if (!this.filterBy?.title) return this.bugs
      // return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
      bugService.query(this.filterBy).then((bugs) => {
        this.bugs = bugs
      })
      return bugs
    },
  },
  components: {
    bugList,
    bugFilter,
  },
}
