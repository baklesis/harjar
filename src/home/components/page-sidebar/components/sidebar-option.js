const template = `
  <div :id='option' @click='showContent' class='sidebar-option pl-4 py-2'>
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
  },
  methods: {
    showContent() {  // shows content page based on option from sidebar
      l = this.$parent.$parent.page_content
      if(this.option=='analysis_header'){ // if option is analysis/header
				this.$parent.$parent.$parent.page_content = 'analysis'  // we add '.$parent' one more time because analysis options are inside a collapse component
				this.$parent.$parent.$parent.page_content_props = {content_type: 'header'}
			}
			else if(this.option=='analysis_request'){ // if option is analysis/request
				this.$parent.$parent.$parent.page_content = 'analysis'
				this.$parent.$parent.$parent.page_content_props = {content_type: 'request'}
			}
			else if(this.option=='overview' || this.option=='map' || this.option=='upload'){  // for the other options
				this.$parent.$parent.page_content = this.option
				this.$parent.$parent.page_content_props = null
			}
    }
  },
}
