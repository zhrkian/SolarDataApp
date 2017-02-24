import {
  FRAMES_UPDATE_FRAME_ARRAY
} from '../actions/frames'


const initialState = {
  frames: {}
}

const frames = (state = initialState, action) => {
  let frame = null
  switch(action.type) {
    case FRAMES_UPDATE_FRAME_ARRAY:
      frame = state.frames[action.id] || {}
      frame.array = action.array
      state.frames[action.id] = frame
      return {...state}
    default:
      return state
  }
}

export default frames