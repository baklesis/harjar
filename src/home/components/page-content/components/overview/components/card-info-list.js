import Card from "../../card.js"
const template = `
	<card style='height:100%'>
		<h5 class='pt-4 px-1 text-muted' >Μέση Ηλικία Ιστοαντικειμένων</h5>
		<div style='height: calc(100vh - 380px); overflow: auto; overflow-x: hidden;'>
			<hr>
			<div v-for="type in types">
				<b-row>
		  		<b-col cols='9'>
		    		<h6 class='pt-2 px-1 text-muted'>{{type.name}}</h6>
		    	</b-col>
		    	<b-col cols='3'>
		    		<b-icon class="pt-2" :icon='icon' variant="primary" font-scale="3" ></b-icon></h5>
		    	</b-col>
		    </b-row>
		    <b-row class='px-1' align-v='center'>
		      <b-col cols='4'><h3><b>{{type.value}} </b></h3></b-col>
		      <b-col cols='8'>{{subtitle}}</b-col>
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
	props: ['title','subtitle','value','icon'],
	 data () {
	   return {
			 types: [],
		}
	},
	methods: {
		getTypes(){
			axios.get('./php/get_avg_age.php')
			.then((response)=>{
				this.types = response.data
			})
			.catch(function (error) {
				console.log(error);
			})
			this.types =  [{name: 'Application', value: Math.floor((Math.random() * 100) + 1)},
     	// 	{name: 'Audio', value: Math.floor((Math.random() * 100) + 1)},
     	// 	{name: 'Font', value: Math.floor((Math.random() * 100) + 1)},
     	// 	{name: 'Image', value: Math.floor((Math.random() * 100) + 1)},
     	// 	{name: 'Message', value: Math.floor((Math.random() * 100) + 1)},
     	// 	{name: 'Model', value: Math.floor((Math.random() * 100) + 1)},
     	// 	{name: 'Multipart', value: Math.floor((Math.random() * 100) + 1)},
     	// 	{name: 'Text', value: Math.floor((Math.random() * 100) + 1)},
     	// 	{name: 'Video', value: Math.floor((Math.random() * 100) + 1)}]
		}
	},
	mounted() {
		this.getTypes()
	}
}
