import Card from './card.js'

const template = `
  <div id="loader" class="fixed-bottom fixed-top" style="position: absolute; top: 50%; left: 50%; margin-left:-25px; margin-top:-25px;">
    <b-spinner label="Loading..." style="color: #24cb7f ;width: 50px; height: 50px; width: 50px; height: 50px;"></b-spinner>
  </div>
`
export default {
  template,
  data () {
    return {
    }
  }
}
