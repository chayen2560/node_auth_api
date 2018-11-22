module.exports = (thisAccess, toMatchAccess) => {
  return new Promise((resolve, reject) => {
    if (thisAccess !== toMatchAccess && thisAccess !== 'admin') 
      reject({ code:403, message:'Access denied' })
    else resolve()
  })
}