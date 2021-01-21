const template = `
  <div :id='option' @click="$emit('choice',option)" class='sidebar-option pl-4 py-2'>
    <b-row>
      <b-col cols='1'>
        <b-icon :icon='icon'></b-icon>
      </b-col>
      <b-col>
        <component :is='title_size'></b-icon>{{title}}</component>
      </b-col>
    </b-row>
  </div>
`
export default {
  template,
  props: ['option','title', 'title_size','icon'],
  data () {
    return {}
  }
}
