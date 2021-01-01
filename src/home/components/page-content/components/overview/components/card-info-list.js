import Card from "../../card.js"
const template = `
	<card>
	<div class = 'pt-3 overflow-auto' style='height:300px'>
	<div v-for="type in types">
    <h5 class='pt-3 px-1 text-muted'> {{ type.name }}
    <b-icon :icon="icon"></b-icon></h5>
    <hr>
    <b-row class='pb-3 px-1' align-v='center'>
      <b-col cols='4'><h2><b>{{type.value}} </b></h2></b-col>
      <b-col cols='8'>{{subtitle}}</b-col>
    </b-row>
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
     	types: 
     		[{name: 'Application', value: Math.floor((Math.random() * 100) + 1)},
     		{name: 'Audio', value: Math.floor((Math.random() * 100) + 1)},
     		{name: 'Font', value: Math.floor((Math.random() * 100) + 1)},
     		{name: 'Image', value: Math.floor((Math.random() * 100) + 1)},
     		{name: 'Message', value: Math.floor((Math.random() * 100) + 1)},
     		{name: 'Model', value: Math.floor((Math.random() * 100) + 1)},
     		{name: 'Multipart', value: Math.floor((Math.random() * 100) + 1)},
     		{name: 'Text', value: Math.floor((Math.random() * 100) + 1)},
     		{name: 'Video', value: Math.floor((Math.random() * 100) + 1)}],
     	test: {
     		name: "Hey",
     		value: "play",
     	}
     }
   }
 }