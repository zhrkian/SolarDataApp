import {
  FRAMES_UPDATE_FRAME_ARRAY,
  FRAMES_UPDATE_FRAME_IMAGE
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

      console.log('ARRAY', frame)

      return {...state}
    case FRAMES_UPDATE_FRAME_IMAGE:
      frame = state.frames[action.id] || {}
      frame.image = action.image
      state.frames[action.id] = frame

      console.log('IMAGE', frame)
      return {...state}
    default:
      return state
  }
}

export default frames