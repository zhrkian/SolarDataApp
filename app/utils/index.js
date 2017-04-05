export const generatePortId = (items = []) => {
  const id = '' + Math.random().toString(36).slice(2)
  if (!items.filter(item => item.id === id)[0]) {
    return id
  }
  return generatePortId(items)
}

export const getFilename = url => {
  return url ? url.substring(url.lastIndexOf('/') + 1) : null
}