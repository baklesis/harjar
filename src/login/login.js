import Logo from './components/logo.js'
import LoginPrompt from './components/login-prompt.js'
import SignupPrompt from './components/signup-prompt.js'

const template = `
  <div class="fixed-bottom fixed-top animate__animated animate__fadeIn">
    <logo></logo>
    <login-prompt></login-prompt>
    <signup-prompt></signup-prompt>
  </div>
`
export default {
  components: {
    'logo': Logo,
    'login-prompt': LoginPrompt,
    'signup-prompt': SignupPrompt,
  },
  template,
  data () {
    return {
    }
  }
}
