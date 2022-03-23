import {createGlobalState} from 'react-hooks-global-state'

const {setGlobalState,useGlobalState} = createGlobalState({
  accountSignedIn: '',
})

export {useGlobalState,setGlobalState};
