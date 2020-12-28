import Signup from './signup.js'

const template = `
  <div>
    <span class="dot centered" style="padding: 40px; height: 300px; width: 300px; margin-top: 50px; background-color: white; border-radius: 50%;">
      <span class="dot">
        <b-form @submit="logIn()">
          <b-col>
            <b-row class="pb-2" ><img src="./assets/profile.png" alt="profile" width="50" height="50" style="background: lightgrey; margin: auto; border-radius: 50%;"></b-row>
            <b-row id="user-field" class="pb-1" ><b-form-input v-model="login_username" type="text" required placeholder="Όνομα Χρήστη" ></b-form-input></b-row>
            <b-row id="pass-field" class="pb-1" ><b-form-input v-model="login_password" type="password" required placeholder="Κωδικός">></b-form-input></b-row>
            <b-row><b-button type="submit" block class='btn-color'>Σύνδεση</b-button></b-row>
          </b-col>
        </b-form>
        <hr/>
        <b-row><b-link v-b-modal.signup style="text-decoration: none; margin: auto;">Εγγραφή</b-link></b-row>
      </span>
    </span>
  </div>
`
export default {
  components: {
    'signup': Signup
  },
  template,
  data () {
    return {
      login_username:'',
      login_password:'',
    }
  },
  methods: {
    logIn(){
      event.preventDefault() //prevents page reload after button submit
      axios.post('./php/login.php',{'username': this.login_username, 'password': this.login_password})
      .then((response)=>{
        if (response.data != null){
          this.$root.curr_page = 'page-main'
        }
        else{
          alert("Δεν βρέθηκε λογαριασμός")
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  }
}
