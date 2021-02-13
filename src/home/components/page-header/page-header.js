import AccountInfo from './components/account_info.js'
const template = `
  <b-row align-v='center'>
    <b-col class='pl-3'>
    <h4 style="color: white">{{title}}</h4>
    </b-col>
    <b-col cols='3'>
      <div style='height: 45px; width: 245px; margin:auto'>
        <b-dropdown right :text='username' variant='outline-light' offset="15" style='width: 150px; float: right;'>
          <b-dropdown-item v-b-modal.account>Λογαριασμός</b-dropdown-item>
          <b-dropdown-item @click="logOut()">Αποσύνδεση</b-dropdown-item>
        </b-dropdown>
        <account-info></account-info>
        <img src='../assets/img/profile.png' class='bg-colored' style='height: 50px; width: 50px; position: absolute; top: -6px; left:80px; border-radius: 50%; z-index: 100;'></img>
      </div>
    </b-col>
  </b-row>
`
export default {
  components: {
    'account-info': AccountInfo
  },
  template,
  props: ['title','username'],
  data () {
    return {
    }
  },
  methods: {
    logOut() {
      window.localStorage.removeItem('local_entries');
      axios.get('./php/logout.php')
      .then((response)=>{
        this.$root.curr_page = 'login'
      })
      .catch(function (error) {
          console.log(error);
      })
    }
  }
}
