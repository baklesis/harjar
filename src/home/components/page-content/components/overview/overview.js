import CardBar from './components/card-bar.js'
import CardInfoList from './components/card-info-list.js'
import CardInfo from '../card-info.js'

const template = `
  <b-col class='d-flex flex-column px-3'>
    <b-row>
      <b-col>
      	<card-info title='Χρήστες' icon='person-fill' :value='numberOfUsers'></card-info>
      </b-col>
      <b-col>
      	<card-info title='Domain' icon='globe2' :value='numberOfDomains'></card-info>
      </b-col>
      <b-col>
      	<card-info title='Πάροχοι' icon='hdd-network-fill' :value='numberOfProviders'></card-info>
      </b-col>
    </b-row>
    <b-row align-v="stretch" class='flex-grow-1 pt-4' >
      <b-col cols="8">
      	<card-bar></card-bar>
      </b-col>
      <b-col><card-info-list icon='paperclip'></card-info-list></b-col>
    </b-row>
  </b-col>
 `
 export default {
 	template,
 	components: {
 		'card-bar': CardBar,
 		'card-info-list': CardInfoList,
 		'card-info': CardInfo,
 	},
   data () {
     return {
     }
   },
   computed: {
     numberOfUsers() {
       axios.get('./php/get_users_count.php')
       .then((response)=>{
         return response.data
       })
       .catch(function (error) {
         console.log(error);
       })
     },
     numberOfDomains() {
       axios.get('./php/get_domains_count.php')
       .then((response)=>{
         return response.data
       })
       .catch(function (error) {
         console.log(error);
       })
     },
     numberOfProviders() {
       axios.get('./php/get_providers_count.php')
       .then((response)=>{
         return response.data
       })
       .catch(function (error) {
         console.log(error);
       })
     }
   }
 }
