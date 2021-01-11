import AccountInfo from './components/account_info.js'
const template = `
  <b-container style='width:85%'>
    <b-row align-v='center'>
      <b-col class='ml-3'>
      <h4 style="color: white">{{title}}</h4>
      </b-col>
      <b-col cols='3'>
        <div style='height: 45px; width: 215px; margin:auto'>
          <b-dropdown right :text='username' variant='outline-light' offset="15" style='width: 150px; float: right;'>
            <b-dropdown-item v-b-modal.account>Λογαριασμός</b-dropdown-item>
            <b-dropdown-item @click="logOut()">Αποσύνδεση</b-dropdown-item>
          </b-dropdown>
          <account-info></account-info>
          <img src='../assets/img/profile.png' style='background: #007BFF; height: 50px; width: 50px; position: absolute; top: -6px; left:65px; border-radius: 50%; z-index: 100;'></img>
        </div>
      </b-col>
    </b-row>
  </b-container>
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
