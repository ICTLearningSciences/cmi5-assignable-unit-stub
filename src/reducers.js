import Cmi5 from './cmi5'

import {
  COMPLETE_FAILED,
  COMPLETE_REQUESTED,
  COMPLETE_SUCCEEDED,
  START_FAILED,
  START_REQUESTED,
  START_SUCCEEDED,
  TERMINATE_FAILED,
  TERMINATE_REQUESTED,
  TERMINATE_SUCCEEDED
} from "./actions";

const initialState = Cmi5.setStatus({}, Cmi5.STATUS.NONE)


const reducer = (state = initialState, action) => {
  if(!action) {
    return state
  }
  switch (action.type) {
    case START_REQUESTED:
      return Cmi5.setStatus(state, Cmi5.STATUS.START_IN_PROGRESS)
    case START_SUCCEEDED:
      return Cmi5.setStatus(state, Cmi5.STATUS.STARTED)
    case START_FAILED:
      return Cmi5.setStatus(state, Cmi5.STATUS.START_FAILED)
    case COMPLETE_REQUESTED:
      return Cmi5.setStatus(state, Cmi5.STATUS.COMPLETE_IN_PROGRESS)
    case COMPLETE_SUCCEEDED:
        return Cmi5.setStatus(state, Cmi5.STATUS.COMPLETED)
    case COMPLETE_FAILED:
        return Cmi5.setStatus(state, Cmi5.STATUS.COMPLETE_FAILED)
    case TERMINATE_REQUESTED:
        return Cmi5.setStatus(state, Cmi5.STATUS.TERMINATE_IN_PROGRESS)
    case TERMINATE_SUCCEEDED:
        return Cmi5.setStatus(state, Cmi5.STATUS.TERMINATED)
    case TERMINATE_FAILED:
        return Cmi5.setStatus(state, Cmi5.STATUS.TERMINATE_FAILED)
    default:
      return state
  }
}


export default reducer;