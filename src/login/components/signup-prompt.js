const template = `
  <b-modal id="signup" title="Πληροφορίες Λογαριασμού" @hide="cancel" hide-footer >
    <b-form @submit.stop.prevent="signUp" @reset="cancel">
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
      usernameState: null,
      email:'',
      emailState: null,
      password:'',
      passwordState: null,
    }
  },
  computed: {
    usernameValidate(){
      this.usernameState = this.username.length == 0 ? null : true
      return this.usernameState
    },
    emailValidate(){
      this.emailState = this.email.length == 0 ? null : /\w+[@]\w+[.]\w+/.test(this.email)
      return this.emailState
    },
    passwordValidate() {
      this.passwordState = this.password.length == 0 ? null : (this.password.length >= 8) && /[A-Z]/.test(this.password) && /[0-9]/.test(this.password) && /[^A-Z^a-z^0-9]/.test(this.password)
      return this.passwordState
    }
  },
  methods: {
    cancel() {
      this.username=''
      this.email=''
      this.password=''
      this.passwordState=null
      this.$bvModal.hide("signup")
    },
    signUp(){
      event.preventDefault() //prevents page reload after button submit
      if (this.usernameState & this.emailState & this.passwordState){
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
