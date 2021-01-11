const template = `
  <b-modal id="signup" title="Πληροφορίες Λογαριασμού" @hide="cancel" hide-footer >
    <b-form @submit.stop.prevent="signUp" @reset="cancel" onsubmit='return false'>
      <b-form-group label-cols-sm="3" label="Όνομα Χρήστη" label-for="username">
        <b-form-input id="username" v-model="username" type="text" :state="usernameValidate" required placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group label-cols-sm="3" label="E-mail" label-for="email">
        <b-form-input id="email" v-model="email" type="email" :state="emailValidate" required placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group label-cols-sm="3" label="Κωδικός" label-for="password" description="Τουλάχιστον 8 λατινικούς χαρακτήρες, ένα κεφαλαίο γράμμα, αριθμός και σύμβολο.">
        <b-form-input id="password" v-model="password" type="password" :state="passwordValidate" required placeholder=""></b-form-input>
      </b-form-group>
      <hr/>
      <b-button type="reset">Ακύρωση</b-button>
      <b-button type="submit" class='btn-color'>Εγγραφή</b-button>
    </b-form>
  </b-modal>
`
export default {
  template,
  data () {
    return {
      username:'',
      username_state: null,
      email:'',
      email_state: null,
      password:'',
      password_state: null,
    }
  },
  computed: {
    usernameValidate(){
      this.username_state = this.username.length == 0 ? null : true
      return this.username_state
    },
    emailValidate(){
      this.email_state = this.email.length == 0 ? null : /\w+[@]\w+[.]\w+/.test(this.email)
      return this.email_state
    },
    passwordValidate() {
      this.password_state = this.password.length == 0 ? null : (this.password.length >= 8) && /[A-Z]/.test(this.password) && /[0-9]/.test(this.password) && /[^A-Z^a-z^0-9]/.test(this.password)
      return this.password_state
    }
  },
  methods: {
    cancel() {
      this.username=''
      this.email=''
      this.password=''
      this.username_state=null
      this.email_state=null
      this.password_state=null
      this.$bvModal.hide("signup")
    },
    signUp(){
      if (this.username_state & this.email_state & this.password_state){
        axios.post('./php/signup.php',{'username': this.username, 'email': this.email, 'password':this.password})
        .then(function (response) {
          if(response.data){
            alert("Η εγγραφή σας ολοκληρώθηκε με επιτυχία")
          }
          else{
            alert("Αυτός ο λογαριασμός υπάρχει ήδη")
          }
          location.reload();
        })
        .catch(function (error) {
          console.log(error);
        })
      }
    }
  }
}
