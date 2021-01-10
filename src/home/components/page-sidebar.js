const template = `
	<div style='height:100vh; width: 100px; background: white'>
      <b-button v-for='option in curr_options' @click='showContent(option)'>{{option}}</b-button>
	</div>
`
export default {
  template,
  data () {
    return {
    	curr_options : [],
    	user_options : ['Χάρτης','Upload'],
    	admin_options : ['Επισκόπιση','Ανάλυση/Request','Ανάλυση/Header','Χάρτης']
    }
  },
  methods: {
    showContent(option) {
      switch(option){
        case 'Χάρτης':
          this.$parent.page_content = 'map'
          this.$parent.page_content_props = null
          break
        case 'Upload':
          break
        case 'Επισκόπιση':
          this.$parent.page_content = 'overview'
          this.$parent.page_content_props = null
          break
        case 'Ανάλυση/Request': 
          this.$parent.page_content = 'analysis'
          this.$parent.page_content_props = {content_type: 'request'}
          break
        case 'Ανάλυση/Header':
          this.$parent.page_content = 'analysis'
          this.$parent.page_content_props = {content_type: 'header'}
          break
      }
    }
  },
  mounted() {
  	axios.post('./php/get_session.php')  // check user type in user session
    .then((response)=>{
      if (response.data != null){
        if (response.data['type'] == 'admin'){  // if user is admin
          this.curr_options = this.admin_options // set the specific sidebar options
        }
        else if (response.data['type'] == 'user'){  // if user is regular user
          this.curr_options = this.user_options
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  }
}
