module.exports = {
  upload ({ file_name, transaction, blockNumber }) {
    console.log(`Add file ${file_name} with transaction ${transaction} and blockNumber ${blockNumber}`)
    return Promise.resolve()
  }
}