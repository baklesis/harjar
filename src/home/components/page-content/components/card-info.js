import Card from './card.js'

const template = `
  <card>
  <b-row>
  <b-col cols='9'>
    <h5 class='pt-3 px-1 text-muted'>{{title}}</h5>
    </b-col>
    <b-col cols='3'>
    <b-icon class="pt-3 colored" :icon='icon' font-scale="3" ></b-icon></h5>
    </b-col>
    </b-row>
    <hr>
    <b-row class='pb-3 px-1' align-v='center'>
      <b-col cols='auto'><h2><b>{{value}} </b></h2></b-col>
      <b-col cols='auto'><h6 class='text-muted'>{{subtitle}}</h6></b-col>
    </b-row>
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
  }
}
