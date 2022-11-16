'use strict'
import { bugService } from "../services/bug-service.js";
export default {
  props: ['bug'],
  template: `<article className="bug-preview">
                <span>🐛</span>
                <h4>{{bug.title}}</h4>
                <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
                <span :class='"severity" + bug.severity'>Bug Owner: {{bug.owner.fullname}}</span>
                <div class="actions">
                  <router-link :to="'/bug/' + bug._id">Details</router-link>
                  <router-link :to="'/bug/edit/' + bug._id"> Edit</router-link>
                </div>
                <button @click="onRemove(bug._id)">X</button>
                <!-- <button @click="download">down</button> -->
              </article>`,
  methods: {
    onRemove(bugId) {
      this.$emit('removeBug', bugId)
    },
    download(){
      console.log('d');
      bugService.downloadBugs()
        .then((doc) => {
          console.log('downloading');
          
        })
    }
  },
}
