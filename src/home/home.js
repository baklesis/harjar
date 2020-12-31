import PageContent from './components/page-content/page-content.js'
import PageHeader from './components/page-header.js'

const template = `
  <div class="fixed-bottom fixed-top animate__animated animate__fadeIn"><b-col><b-row>
      <b-col cols='2' style='background: white'>
        <div style='height:100px; width: 100px; background: white'></div>
      </b-col>
      <b-col>
        <b-row class='pt-4 pb-3'>
          <page-header :title='getTitle' :username='username'></page-header>
        </b-row>
        <b-row>
          <page-content :content='page_content' :content_props='page_content_props'></page-content>
        </b-row>
      </b-col>
    </b-row></b-col></div>
`
export default {
  components: {
    'page-content': PageContent,
    'page-header': PageHeader,
  },
  template,
  props: [],
  data () {
    return {
      header_title: null,
      username: null,
      page_content: null,
      page_content_props: {}
    }
  },
  computed: {
    getTitle() {
      switch(this.page_content){
        case 'analysis':
          if (this.page_content_props['content_type'] == "header"){
            this.header_title = 'Ανάλυση / HTTP Κεφαλίδες'
          }
          else if (this.page_content_props['content_type'] == "request"){
            this.header_title = 'Ανάλυση / Χρόνος Απόκρισης Αιτήσεων'
          }
          break;
        case 'map':
          this.header_title = 'Χάρτης'
          break;
        case 'overview':
          this.header_title = 'Επισκόπηση'
      }
      return this.header_title
    }
  },
  mounted () {
    axios.post('./php/get_user.php')
    .then((response)=>{
      if (response.data != null){
        if (response.data['type'] == 'admin'){
          this.page_content = 'analysis' //change to overview later
          this.page_content_props = {content_type: "header"}
        }
        else if (response.data['type'] == 'user'){
          this.page_content = 'overview' //change to map later
          this.page_content_props = {}
        }
        this.username = response.data['username']
      }
    })
    .catch(function (error) {
      console.log(error);
    }) 
  }
}
