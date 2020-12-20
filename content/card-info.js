import Card from './card.js'

const template = `
  <card style="width:250px;">
    <h5 class='pt-3 px-1'>{{title}}  <b-icon :icon="icon"></b-icon></h5>
    <hr>
    <b-row class='pb-3 px-1' align-v='center'>
      <b-col cols='4'><h2><b>{{value}}% </b></h2></b-col>
      <b-col cols='8'>{{subtitle}}</b-col>
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
