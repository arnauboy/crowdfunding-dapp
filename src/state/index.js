import {createGlobalState} from 'react-hooks-global-state'

const {setGlobalState,useGlobalState} = createGlobalState({
  accountSignedIn: '',
  currentNetwork: ''
})

export {useGlobalState,setGlobalState};
