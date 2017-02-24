export const FRAMES_UPDATE_FRAME = 'FRAMES_UPDATE_FRAME'
export const FRAMES_UPDATE_FRAME_ARRAY = 'FRAMES_UPDATE_FRAME_ARRAY'

export const updateFrameArray = (id, array) => {
  return {
    type: FRAMES_UPDATE_FRAME_ARRAY,
    array: array,
    id
  }
}

export const updateFrame = (id, frame) => {
  "use strict";

}