const template = `
  <b-col>
    <b-row>
      <b-col>
        <b-container style='width: 80%;'><h4 style="color: white">{{title}}</h4></b-container>
      </b-col>
      <b-col cols='3'>
        <b-container style='height: 45px; width: 215px;'>
          <b-dropdown right :text='username' variant='outline-light' offset="15" style='width: 150px; float: right;'>
            <b-dropdown-item>Λογαριασμός</b-dropdown-item>
            <b-dropdown-item>Αποσύνδεση</b-dropdown-item>
          </b-dropdown>
          <img src='./assets/profile.png' style='background: #007BFF; height: 50px; width: 50px; position: absolute; top: -5px; border-radius: 50%; z-index: 100;'></img>
        </b-container>
      </b-col>
    </b-row>
  </b-col>
`
export default {
  template,
  props: ['title','username'],
  data () {
    return {
    }
  }
}
