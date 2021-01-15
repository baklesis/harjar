const template = `
  <b-modal id="account" title="Πληροφορίες Λογαριασμού" @show='show'@hide='reset' hide-footer >
    <img src="../assets/img/profile.png" alt="profile" width="100" height="100" class='centered' style="background: lightgrey; border-radius: 50%;">
    <b-col id='user-entry-info'>
      <b-row>
        <b-col>
          <label class='text-centered'>Πλήθος Εγγραφών</label>
          <h5 class='text-centered'>{{entries}}</h5>
        </b-col>
        <b-col>
          <label class='text-centered'>Τελευταία Εγγραφή</label>
          <h5 class='text-centered'>{{last_entry}}</h5>
        </b-col>
      </b-row>
    </b-col>
    <b-form-group label-cols-sm="3" label="Όνομα Χρήστη" label-for="username" class='pt-4'>
      <b-form @submit.stop.prevent="save_username()" onsubmit='return false' inline>
        <b-form-input
          id="username"
          v-model="username"
          type="text"
          :state="usernameValidate"
          readonly
          required
          placeholder=""
          class="rounded-left"
          style='width: 300px'>
        </b-form-input>
        <b-button id='edit-username' @click="edit_username()" class="rounded-right"><b-icon icon='input-cursor-text'></b-icon></b-button>
        <b-button id='save-username' type='submit' class="rounded-right" style="display: none"><b-icon icon='pencil-fill' ></b-icon></b-button>
      </b-form>
    </b-form-group>
    <b-form-group label-cols-sm="3" label="Κωδικός" label-for="password" :description='password_description'>
      <b-form @submit="save_password()" onsubmit='return false' inline>
        <b-form-input
          id="password"
          v-model="password"
          type="password"
          :state="passwordValidate"
          readonly
          required
          placeholder=""
          class="rounded-left"
          style='width: 300px'>
        </b-form-input>
        <b-button id='edit-password' @click="edit_password()" class="rounded-right"><b-icon icon='input-cursor-text''></b-icon></b-button>
        <b-button id='save-password' type='submit' class="rounded-right" style="display: none"><b-icon icon='pencil-fill'></b-icon></b-button>
      </b-form>
    </b-form-group>
  </b-modal>
`
export default {
  template,
  data () {
    return {
      username:'',
      username_state: null,
      username_editable: false,
      password:'',
      password_state: null,
      password_description: '',
      password_editable: false,
      entries: null,
      last_entry: ''
    }
  },
  computed: {
    usernameValidate(){
      if(this.username_editable){  // if username field is not disabled (is editable) then check for validity
        this.username_state = this.username.length == 0 ? null : true
      }
      else{
        this.username_state = null
      }
      return this.username_state
    },
    passwordValidate() {
      if(this.password_editable){  // if password field is not disabled (is editable) then check for validity
        this.password_state = this.password.length == 0 ? null : (this.password.length >= 8) && /[A-Z]/.test(this.password) && /[0-9]/.test(this.password) && /[^A-Z^a-z^0-9]/.test(this.password)
      }
      else{
        this.password_state = null
      }
      return this.password_state
    }
  },
  methods: {

    reset() {  // resets fields
      this.username = ''
      this.password = ''
      this.username_state = null
      this.password_state = null
      this.password_description = null
      this.username_editable = false
      this.password_editable = false
      this.$bvModal.hide("account")
    },

    show() {  // shows modal and loads info
      // make fields disabled
      let username_field = document.getElementById('username')
      let password_field = document.getElementById('password')
      if (username_field & password_field){ // if username and password fields are loaded, make them disabled
        document.getElementById('username').readOnly = true
        document.getElementById('password').readOnly = true
      }
      this.username_editable = false
      this.password_editable = false
      // reset validity state of fields
      this.username_state = null
      this.password_state = null
      //load data
      axios.get('./php/get_user_info.php')
      .then((response)=>{
        if(response.data!=null){
          this.username = response.data['username']
          this.password = "*****" // placeholder password
          this.entries = response.data['entries']
          this.last_entry = response.data['last_entry']
        }
        else{
          alert("Πρόβλημα Εύρεσης Πληροφοριών")
        }
      })
      .catch(function (error) {
        alert("Πρόβλημα Συστήματος")
        console.log(error);
      })
      // show modal
      this.$bvModal.show("account")
    },

    edit_username() {
      this.username_editable = true  // make editable flag true
      document.getElementById('username').readOnly = false  // make field editable
      document.getElementById('save-username').style.display = 'block' // show save button
      document.getElementById('edit-username').style.display = 'none' // hide edit button
    },
    edit_password() {
      this.password = ''  // only password will be blank when edit button is selected
      this.password_description = "Τουλάχιστον 8 λατινικούς χαρακτήρες, ένα κεφαλαίο γράμμα, αριθμός και σύμβολο."
      this.password_editable = true // make editable flag true
      document.getElementById('password').readOnly = false  // make field editable
      document.getElementById('save-password').style.display = 'block' // show save button
      document.getElementById('edit-password').style.display = 'none' // hide edit button
    },
    save_username(){
      if(this.username_state){
        document.getElementById('username').readOnly = true
        //save username in database
        axios.post('./php/set_username.php',{'username': this.username})
        .then((response)=>{
          if(response.data!=null){
            alert("Η αλλαγή ονόματος ολοκληρώθηκε με επιτυχία")
            location.reload();
          }
          else{
            alert("Η αλλαγή ονόματος δεν ολοκληρώθηκε με επιτυχία")
            location.reload();
          }
        })
        .catch(function (error) {
          console.log(error);
        })
        this.username_editable = false // make editable flag false
        document.getElementById('save-username').style.display = 'none' // hide save button
        document.getElementById('edit-username').style.display = 'block' // show edit button
      }
    },
    save_password(){
      if(this.password_state){
        document.getElementById('password').readOnly = true
        //save password in database
        axios.post('./php/set_password.php',{'password': this.password})
        .then((response)=>{
          if(response.data!=null){
            alert("Η αλλαγή κωδικού ολοκληρώθηκε με επιτυχία")
            location.reload();
          }
          else{
            alert("Η αλλαγή κωδικού δεν ολοκληρώθηκε με επιτυχία")
            location.reload();
          }
        })
        .catch(function (error) {
          console.log(error);
        })
        this.password_editable = false // make editable flag false
        this.password_description = ""
        document.getElementById('save-password').style.display = 'none' // hide save button
        document.getElementById('edit-password').style.display = 'block' // show edit button
      }
    }
  },
}
