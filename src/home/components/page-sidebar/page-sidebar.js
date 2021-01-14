import SidebarOption from './components/sidebar-option.js'

const template = `
<div style='background-color: white; height:100vh;'>
	<img src='../assets/img/logo.svg' class='p-4 centered-x' style='width: 70%;'>
	<hr>

	<sidebar-option v-b-toggle option='overview' title='Επισκόπηση' title_size='h5' icon='house-door-fill' style='display:none'></sidebar-option>

	<sidebar-option v-b-toggle.analysis_options option='analysis' title='Ανάλυση' title_size='h5' icon='bar-chart-fill' style='display:none'></sidebar-option>

	<b-collapse id="analysis_options" class="pt-2 pl-4">
		<sidebar-option  v-b-toggle option='analysis_header' title='HTTP Κεφαλίδες' title_size='h6' icon='segmented-nav'></sidebar-option>
		<sidebar-option  v-b-toggle option='analysis_request' title='Χρόνος Απόκρισης Αιτήσεων' title_size='h6' icon='hourglass-bottom' class='pl-4'></sidebar-option>
	</b-collapse>

	<sidebar-option v-b-toggle option='map' title='Χάρτης' title_size='h5' icon='geo-alt-fill' style='display:none'></sidebar-option>

	<sidebar-option v-b-toggle option='upload' title='Μεταφόρτωση' title_size='h5' icon='file-earmark-arrow-up-fill' style='display:none'></sidebar-option>

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
  mounted() {
		//hide all menu options
		document.getElementById('overview').style.display = 'none'
		document.getElementById('analysis').style.display = 'none'
		document.getElementById('map').style.display = 'none'
		document.getElementById('upload').style.display = 'none'
		// check user type in user session
  	axios.post('./php/get_session.php')
    .then((response)=>{
      if (response.data != null){
        if (response.data['type'] == 'admin'){  // if user is admin
					// show the specific sidebar options
          document.getElementById('overview').style.display = 'block'
					document.getElementById('analysis').style.display = 'block'
					document.getElementById('map').style.display = 'block'
        }
        else if (response.data['type'] == 'user'){  // if user is regular user
					// show the specific sidebar options
          document.getElementById('map').style.display = 'block'
					document.getElementById('upload').style.display = 'block'
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  }
}
