export const FRAMES_UPDATE_FRAME = 'FRAMES_UPDATE_FRAME'
export const FRAMES_UPDATE_FRAME_ARRAY = 'FRAMES_UPDATE_FRAME_ARRAY'
export const FRAMES_UPDATE_FRAME_IMAGE = 'FRAMES_UPDATE_FRAME_IMAGE'

export const updateFrameArray = (id, array) => {
  return {
    type: FRAMES_UPDATE_FRAME_ARRAY,
    array,
    id
  }
}

export const updateFrameImage = (id, image) => {
  return {
    type: FRAMES_UPDATE_FRAME_IMAGE,
    image,
    id
  }
}

export const updateFrame = (id, frame) => {
  "use strict";

}