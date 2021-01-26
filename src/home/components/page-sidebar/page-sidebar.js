import SidebarOption from './components/sidebar-option.js'

const template = `
<div style='background-color: white; height:100vh;'>
	<img src='../assets/img/logo.svg' class='p-4 centered-x' style='width: 70%;'>
	<hr>

	<sidebar-option @choice="onChoice($event)" v-b-toggle option='overview' title='Επισκόπηση' title_size='h5' icon='house-door-fill' style='display:none'></sidebar-option>

	<sidebar-option v-b-toggle.analysis_options option='analysis' title='Ανάλυση' title_size='h5' icon='bar-chart-fill' style='display:none'></sidebar-option>

	<b-collapse id="analysis_options" class="pt-2 pl-3">
		<sidebar-option @choice="onChoice($event)" v-b-toggle option='analysis_header' title='HTTP Κεφαλίδες' title_size='h6' icon='segmented-nav'></sidebar-option>
		<sidebar-option @choice="onChoice($event)" v-b-toggle option='analysis_request' title='Χρόνος Απόκρισης Αιτήσεων' title_size='h6' icon='hourglass-bottom' class='pl-4'></sidebar-option>
	</b-collapse>

	<sidebar-option v-b-toggle @choice="onChoice($event)" option='request-map' title='Χάρτης' title_size='h5' icon='geo-alt-fill' style='display:none'></sidebar-option>

	<sidebar-option v-b-toggle @choice="onChoice($event)" option='upload' title='Μεταφόρτωση' title_size='h5' icon='file-earmark-arrow-up-fill' style='display:none'></sidebar-option>

	<hr>
</div>
`

export default {
	components: {
	  'sidebar-option': SidebarOption,
	},
  template,
  data () {
    return {
    }
  },
  methods:{
  	onChoice(option){
  		      if(option=='analysis_header'){ // if option is analysis/header
        this.$parent.page_content = 'analysis'
        this.$parent.page_content_props = {content_type: 'header'}
      }
      else if(option=='analysis_request'){ // if option is analysis/request
        this.$parent.page_content = 'analysis'
        this.$parent.page_content_props = {content_type: 'request'}
      }
      else if(option=='overview' || option=='request-map' || option=='upload'){  // for the other options
        this.$parent.page_content = option
        this.$parent.page_content_props = null
      }
  	}
  },
  mounted() {
		//hide all menu options
		document.getElementById('overview').style.display = 'none'
		document.getElementById('analysis').style.display = 'none'
		document.getElementById('request-map').style.display = 'none'
		document.getElementById('upload').style.display = 'none'
		// check user type in user session
  	axios.post('./php/get_session.php')
    .then((response)=>{
      if (response.data != null){
        if (response.data['type'] == 'admin'){  // if user is admin
					// show the specific sidebar options
          document.getElementById('overview').style.display = 'block'
					document.getElementById('analysis').style.display = 'block'
					document.getElementById('request-map').style.display = 'block'
        }
        else if (response.data['type'] == 'user'){  // if user is regular user
					// show the specific sidebar options
          document.getElementById('request-map').style.display = 'block'
					document.getElementById('upload').style.display = 'block'
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  }
}
