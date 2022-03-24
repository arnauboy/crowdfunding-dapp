import {createGlobalState} from 'react-hooks-global-state'

const {setGlobalState,useGlobalState} = createGlobalState({
  accountSignedIn: JSON.parse(window.localStorage.getItem('accountSignedIn')) ||'',
  currentNetwork: JSON.parse(window.localStorage.getItem('currentNetwork')) ||''
})

export {useGlobalState,setGlobalState};
