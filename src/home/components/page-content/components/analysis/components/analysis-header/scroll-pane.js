import CardInfo from '../../../card-info.js'
import CardHistogram from '../analysis-header/card-histogram.js'
import CardPolar from '../analysis-header/card-polar.js'

const template = `
  <b-container class="rounded-corners-25" style="height: calc(100vh - 110px); background: rgba(255, 255, 255, 0.2)">
    <div class='pt-3 px-3 overflow-auto' style='height: 100%;'>
        <b-row>
          <b-col class='p-3'>
            <card-info title='max-stale' :value='max_stale+"%"' subtitle='των αιτήσεων' icon='graph-up'></card-info>
          </b-col>
          <b-col class='p-3'>
            <card-info title='min-fresh' :value='min_fresh+"%"' subtitle='των αιτήσεων' icon='graph-down'></card-info>
          </b-col>
        </b-row>
        <b-row><b-col class='p-3'><card-polar ref='polar'></card-polar></b-col></b-row>
        <b-row><b-col class='pt-3 px-3 pb-4'><card-histogram ref='histogram'></card-histogram></b-col></b-row>
    </div>
  </b-container>
`
export default {
  components: {
    'card-info': CardInfo,
    'card-histogram': CardHistogram,
    'card-polar': CardPolar,
  },
  template,
  data () {
    return {
      max_stale: 0,
      min_fresh: 0,
      public: 0,
      private: 0,
      no_cache: 0,
      no_store: 0
    }
  },
  methods: {
    loadData() {
      // get data for cache control directives
      axios.post('./php/get_cache_control_count.php',this.$parent.header_saved_filters)
      .then((response)=>{
        this.max_stale = response.data['max-stale']
        this.min_fresh = response.data['min-fresh']
        this.public = response.data['public']
        this.private = response.data['private']
        this.no_cache = response.data['no-cache']
        this.no_store = response.data['no-store']
        //reload polar area chart (if it has already been loaded in DOM, otherwise mounted() of polar area component gets the data from the vars)
        this.$refs.polar.config.data.datasets[0].data = [this.public,this.private,this.no_cache,this.no_store]
        this.$refs.polar.polar.update()
      })
      .catch(function (error) {
          console.log(error);
      })

      //get data for histogram
      axios.post('./php/get_histogram.php',this.$parent.header_saved_filters)
      .then((response)=>{
        this.$refs.histogram.config.data.labels = response.data['buckets']
        this.$refs.histogram.config.data.datasets[0].data = response.data['bucket_vals']
        this.$refs.histogram.histogram.update()
      })
      .catch(function (error) {
          console.log(error);
      })
    }
  },
  mounted() {
    //reset saved filters
    this.$parent.header_saved_filters.content_types = []
    this.$parent.header_saved_filters.providers = []
    // load data
    this.loadData()
  }
}
