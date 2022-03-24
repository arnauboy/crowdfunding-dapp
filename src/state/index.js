import {createGlobalState} from 'react-hooks-global-state'

const {setGlobalState,useGlobalState} = createGlobalState({
  accountSignedIn: JSON.parse(window.sessionStorage.getItem('accountSignedIn')) ||'',
  currentNetwork: JSON.parse(window.sessionStorage.getItem('currentNetwork')) ||''
})

export {useGlobalState,setGlobalState};
