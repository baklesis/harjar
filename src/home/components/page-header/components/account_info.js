const template = `
  <b-modal id="account" title="Πληροφορίες Λογαριασμού" @show='show'@hide='reset' hide-footer >
      <b-form-group label-cols-sm="3" label="Όνομα Χρήστη" label-for="username" >
        <b-form @submit.stop.prevent="save('username')" onsubmit='return false' inline>
          <b-form-input
            id="username"
            v-model="username"
            type="text"
            :state="usernameValidate"
            readonly
            required
            placeholder=""
            class="rounded-left"
            style='width: 250px'>
          </b-form-input>
          <b-button id='edit-username' @click="edit('username')" class="rounded-right"><b-icon icon='input-cursor-text'></b-icon></b-button>
          <b-button id='save-username' type='submit' class="rounded-right" style="display: none"><b-icon icon='pencil-fill' ></b-icon></b-button>
        </b-form>
      </b-form-group>
      <b-form-group label-cols-sm="3" label="Κωδικός" label-for="password" :description='password_description'>
        <b-form @submit="save('password')" onsubmit='return false' inline>
          <b-form-input
            id="password"
            v-model="password"
            type="password"
            :state="passwordValidate"
            readonly
            required
            placeholder=""
            class="rounded-left"
            style='width: 250px'>
            </b-form-input>
            <b-button id='edit-password' @click="edit('password')" class="rounded-right"><b-icon icon='input-cursor-text''></b-icon></b-button>
            <b-button id='save-password' type='submit' class="rounded-right" style="display: none"><b-icon icon='pencil-fill' ></b-button>
        </b-form>
      </b-form-group>
      <b-form-group label='Πλήθος Εγγραφών'> lalalal
      </b-form-group>
      <b-form-group label='Τελευταία Εγγραφή'>llalalall
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
    }
  },
  computed: {
    usernameValidate(){
      if(this.username_editable){  // if username field is not disabled (is editable) then check for validity
        this.username_state = this.username.length == 0 ? null : true
      }
      return this.username_state
    },
    passwordValidate() {
      if(this.password_editable){  // if password field is not disabled (is editable) then check for validity
        this.password_state = this.password.length == 0 ? null : (this.password.length >= 8) && /[A-Z]/.test(this.password) && /[0-9]/.test(this.password) && /[^A-Z^a-z^0-9]/.test(this.password)
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
      this.username = 'joangog'
      this.password = 'lol'
      // show modal
      this.$bvModal.show("account")
    },
    edit(field_id) {
      document.getElementById(field_id).readOnly = false  // make field editable
      if(field_id=='username'){
        this.username = ''
        this.username_editable = true  // make editable flag true
        document.getElementById('save-username').style.display = 'block' // show save button
        document.getElementById('edit-username').style.display = 'none' // hide edit button
      }
      else if(field_id=='password'){
        this.password = ''
        this.password_editable = true // make editable flag true
        this.password_description = "Τουλάχιστον 8 λατινικούς χαρακτήρες, ένα κεφαλαίο γράμμα, αριθμός και σύμβολο."
        document.getElementById('save-password').style.display = 'block' // show save button
        document.getElementById('edit-password').style.display = 'none' // hide edit button
      }

    },
    save(field_id){
      document.getElementById(field_id).readOnly = true
      if(field_id=='username'){
        //load data here
        this.username_editable = false // make editable flag false
        document.getElementById('save-username').style.display = 'none' // hide save button
        document.getElementById('edit-username').style.display = 'block' // show edit button
      }
      else if(field_id=='password'){
        //load data here
        this.password_editable = false // make editable flag false
        this.password_description = "Τουλάχιστον 8 λατινικούς χαρακτήρες, ένα κεφαλαίο γράμμα, αριθμός και σύμβολο."
        document.getElementById('save-password').style.display = 'none' // hide save button
        document.getElementById('edit-password').style.display = 'block' // show edit button
      }
    }
  },

}
