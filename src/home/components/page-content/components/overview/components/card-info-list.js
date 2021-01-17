import Card from "../../card.js"
const template = `
	<card>
		<h5 class='pt-4 px-1 text-muted' style='' >Μέση Ηλικία Ιστοαντικειμένων</h5>
		<div style='height: 475px; overflow: auto; overflow-x: hidden;'>
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
		}
	},
	computed: {
		types() {
			axios.get('./php/get_avg_age.php')
			.then((response)=>{
				return response.data
			})
			.catch(function (error) {
				console.log(error);
			})
		}
	}
}
