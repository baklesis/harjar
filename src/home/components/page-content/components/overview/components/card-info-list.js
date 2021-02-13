import Card from "../../card.js"
const template = `
	<card style='height:100%'>
		<h5 class='pt-3 px-1 text-muted'>Μέση Ηλικία Ιστοαντικειμένων</h5>
		<div style='height: calc(100vh - 380px); overflow: auto; overflow-x: hidden;'>
			<hr>
			<div v-for="type in types">
				<b-row>
		  		<b-col cols='9'>
		    		<h6 class='pt-2 px-1 text-muted'>{{type.name}}</h6>
		    	</b-col>
		    	<b-col cols='3'>
		    		<b-icon class="pt-2 colored" :icon='icon' font-scale="3" ></b-icon></h5>
		    	</b-col>
		    </b-row>
		    <b-row class='px-1' align-v='center'>
		      <b-col cols='auto'><h3><b>{{type.value}}</b></h3></b-col>
					<b-col cols='auto'><h6 class='text-muted'>sec</h6></b-col>
		    </b-row>
				<hr>
	    </div>
	   </div>
  </card>
 `
export default {
	components: {
  'card': Card,
	},
	template,
	props: ['title','value','icon'],
	 data () {
	   return {
			 types: [],
		}
	},
	mounted() {
		// load name and avg age for each content type
		axios.get('./php/get_avg_age.php')
		.then((response)=>{
			// sort returned types by their avg age
			let unsorted_types = response.data
			let sorted_types = unsorted_types.sort(function(a, b) {
			  var keyA = a.value, keyB = b.value;
			  // Compare the two values
			  if (keyA < keyB) return 1;
			  if (keyA > keyB) return -1;
			  return 0;
			})
			this.types = sorted_types
		})
		.catch(function (error) {
			console.log(error);
		})
	}
}
