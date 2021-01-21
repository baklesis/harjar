import CardBar from './components/card-bar.js'
import CardInfoList from './components/card-info-list.js'
import CardInfo from '../card-info.js'

const template = `
  <div class='d-flex flex-column pr-3'>
    <b-row>
      <b-col>
      	<card-info title='Χρήστες' icon='person-fill' :value='users'></card-info>
      </b-col>
      <b-col>
      	<card-info title='Domain' icon='globe2' :value='domains'></card-info>
      </b-col>
      <b-col>
      	<card-info title='Πάροχοι' icon='hdd-network-fill' :value='providers'></card-info>
      </b-col>
    </b-row>
    <b-row align-v="stretch" class='flex-grow-1 pt-4' >
      <b-col cols="8">
      	<card-bar></card-bar>
      </b-col>
      <b-col><card-info-list icon='paperclip'></card-info-list></b-col>
    </b-row>
  </div>
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
      users: 0,
      domains: 0,
      providers: 0,
     }
   },
   mounted() {
     // load Card Info data
     // users
     axios.get('./php/get_users_count.php')
     .then((response)=>{
       this.users =  response.data
     })
     .catch(function (error) {
       console.log(error);
     })
     // domains
     axios.get('./php/get_domains_count.php')
     .then((response)=>{
       this.domains = response.data
     })
     .catch(function (error) {
       console.log(error);
     })
     // providers
     axios.get('./php/get_providers_count.php')
     .then((response)=>{
       this.providers = response.data
     })
     .catch(function (error) {
       console.log(error);
     })
   }
 }
