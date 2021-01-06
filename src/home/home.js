import PageSidebar from './components/page-sidebar.js'
import PageHeader from './components/page-header.js'
import PageContent from './components/page-content/page-content.js'

const template = `
  <div class="fixed-bottom fixed-top animate__animated animate__fadeIn"><b-col><b-row>
      <b-col cols='2' style='background: white'>
        <page-sidebar></page-sidebar>
      </b-col>
      <b-col>
        <b-row class='pt-4 pb-3'>
          <page-header :title='getTitle' :username='username'></page-header>
        </b-row>
        <b-row>
          <page-content :content='getContent' :content_props='page_content_props'></page-content>
        </b-row>
      </b-col>
    </b-row></b-col></div>
`
export default {
  components: {
    'page-sidebar': PageSidebar,
    'page-header': PageHeader,
    'page-content': PageContent
  },
  template,
  props: [],
  data () {
    return {
      header_title: null,
      username: null,
      page_content: null,
      page_content_props: {},
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
    },
    getContent() {
      return this.page_content
    }
  },
  mounted () {
    axios.post('./php/get_session.php')  // check user type in user session
    .then((response)=>{
      if (response.data != null){
        if (response.data['type'] == 'admin'){  // if user is admin
          this.page_content = 'overview' // default content is overview
          this.page_content_props = null
        }
        else if (response.data['type'] == 'user'){  // if user is regular user
          this.page_content = 'map' // default content is map
          this.page_content_props = null
        }
        this.username = response.data['username']
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  }
}
