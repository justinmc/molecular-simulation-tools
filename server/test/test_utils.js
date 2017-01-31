const request = require('request');
const fs = require('fs-extended');
const path = require('path');
const retry = require('bluebird-retry');
const statusConstants = require('molecular-design-applications-shared').statusConstants;

const test_utils = {
  runAllTests() {
    return Promise.all([test_utils.runTestWorkflow0()])
    // return Promise.all([test_utils.runTest1(), test_utils.runTest2(), test_utils.runTest_executeWorkflow1Step0()])
      .then(results => {
        var successCount = 0;
        var totalCount = 0;
        results.forEach(r => {
            totalCount++;
            successCount += r.success == true ? 1 : 0;
        });
        if (successCount == totalCount && totalCount > 0) {
          log.info(`Success: ${successCount} / ${totalCount} tests passed`);
        } else {
          log.error(`Failure: ${successCount} / ${totalCount} tests passed`);
        }
        return {success: (successCount == totalCount && totalCount > 0), results:results};
      })
      .catch(err => {
        log.error(err);
        return {success:false, error:JSON.stringify(err)};
      });
  },

  /**
   * Only tests if the job ran with exitCode==0.
   */
  runTestWorkflow0() {
    const formData = {
      inputs: [
        {
          name: 'input.pdb',
          type: 'inline',
          value: fs.readFileSync('test/1bna.pdb', {encoding:'utf8'})
        }
      ]
    };

    var port = process.env.PORT;
    const url = `http://localhost:${port}/v1/structure/executeWorkflow0Step0`;
    return new Promise((resolve, reject) => {
      request.post({url:url, body: formData, json:true},
        (err, httpResponse, body) => {
          if (err) {
            log.error({message:'failed run', error:err});
            return reject({success:false, error:JSON.stringify(err)});
          }
          if (httpResponse.statusCode == 200 && body.jobResult.exitCode === 0) {
            resolve(body);
          } else {
            log.error({statusCode:httpResponse.statusCode, exitCode:body.jobResult.exitCode, body});
            return reject({success:false, statusCode:httpResponse.statusCode, exitCode:body.jobResult.exitCode, job:body});
          }
        });
    })
    .then(result => {
      return new Promise((resolve, reject) => {
        var inputs = [];
        
        log.warn({m:'HERE!!!!!', result});
        for (var i = 0; i < result.outputs.length; i++) {
          var output = result.outputs[i];
          inputs.push({
            name: output.split('/')[output.split('/').length - 1],
            type: 'url',
            value: output
          })
        }
        const formData = {
          email: "dionjw@gmail.com",
          inputs: inputs,
          // [
          //   {
          //     name: 'workflow_state.dill',
          //     type: 'url',
          //     value: result.outputs['workflow_state.dill']
          //   }
          // ],
          workflowId: 0
        };
        log.warn({formData});
        const url = `http://localhost:${port}/v1/run`;
        request.post({url:url, body: formData, json:true},
          (err, httpResponse, body) => {
            log.info({body})
            if (err) {
              log.error({message:'failed run', error:err});
              return reject({success:false, error:JSON.stringify(err)});
            }
            if (httpResponse.statusCode == 200) {
              resolve({success:true, body:body});
            } else {
              log.error({statusCode:httpResponse.statusCode, body});
              resolve({success:false, body:body, statusCode:httpResponse.statusCode});
            }
          });
      });
    });
  },

  // runTest_executeWorkflow1Step0() {
  //   const pbdPath = 'test/1bna.pdb';
  //   var pdbDataStream = fs.createReadStream(pbdPath, {encoding:'utf8'});
  //   var port = process.env.PORT;
  //   const url = `http://localhost:${port}/v1/structure/executeWorkflow1Step0`;
  //   return new Promise((resolve, reject) => {
  //     request.post({url:url, formData:{file:pdbDataStream}},
  //       (err, httpResponse, body) => {
  //         if (err) {
  //           return reject({success:false, error:JSON.stringify(err)});
  //         }
  //         if (httpResponse.statusCode == 200) {
  //           resolve({success:true, body:JSON.parse(body)});
  //         } else {
  //           resolve({success:false, body:body, statusCode:httpResponse.statusCode});
  //         }
  //       });
  //   });
  // },

  // /**
  //  * Upload a PDB by PDB url, and run conversion
  //  * @return {[type]} [description]
  //  */
  // runTest2() {
  //   // const pdbUrl = 'https://files.rcsb.org/download/1BNA.pdb';
  //   const params = {
  //     email: "dionjw@gmail.com",
  //     inputs: [{
  //       name: 'input.pdb'
  //       type: 'inline',
  //       value: fs.readFileSync('test/1bna.pdb', {encoding:'utf8'})
  //       }],
  //     workflowId: 0
  //   }
  //   return test_utils.runWorkflow0(params);
  // },

  // /**
  //  * Upload a PDB file, and run conversion
  //  * @return {[type]} [description]
  //  */
  // runTest1() {
  //   var testFilePath = './test/1bna.pdb';
  //   var pdbData = fs.readFileSync(testFilePath, {encoding:'utf8'});
  //   const params = {
  //     email: "dionjw@gmail.com",
  //     pdbData: pdbData,
  //     workflowId: 0
  //   }
  //   return test_utils.runWorkflow0Step0(params);
  // },

  // runWorkflow0Step0(params) {
  //   return new Promise((resolve, reject) => {
  //     var port = process.env.PORT;
  //     const url = `http://localhost:${port}/v1/run`;
  //     request.post(url, {body: params, json:true},
  //       (error, response, body) => {
  //         if (error) {
  //           log.error(error);
  //           return reject(error);
  //         }
  //         resolve(body);
  //       });
  //   })
  //   .then(result => {
  //     const runId = result.runId;
  //     return retry(() => {
  //       return new Promise((resolve, reject) => {
  //         var port = process.env.PORT;
  //         const url = `http://localhost:${port}/v1/run/${runId}`;
  //         request.get(url, (error, response, body) => {
  //             if (error) {
  //               log.error(error);
  //               return reject(error);
  //             }
  //             var getResult = JSON.parse(body);
  //             const status = getResult.status;
  //             if (status === statusConstants.RUNNING) {
  //               log.trace('Rejecting because body.status=' + status);
  //               reject(getResult);
  //             } else {
  //               resolve(getResult);
  //             }
  //           });
  //       });
  //     }, {max_tries:240, interval:2000});
  //   })
  //   .then(result => {
  //     if (result.jobResult.exitCode == 0) {
  //       const outputPdbUrl = result.outputPdbUrl;
  //       return new Promise((resolve, reject) => {
  //         request.get(outputPdbUrl, (error, response, body) => {
  //             if (error) {
  //               log.error(error);
  //               return reject(error);
  //             }
  //             //We're not actually checking the result here, just making
  //             //sure that the request succeeds
  //             if (response.statusCode == 200) {
  //               resolve(true);
  //             } else {
  //               reject({statusCode:response.statusCode, body});
  //             }
  //           });
  //       })
  //       .then(() => {
  //         return {success:true, result:result};
  //       });
  //     } else {
  //       return {success:false, result:result};
  //     }
  //   })
  //   .catch(err => {
  //     log.error(err);
  //     return {success:false, error:JSON.stringify(err)};
  //   });
  // },

  // runWorkflow0(params) {
  //   return new Promise((resolve, reject) => {
  //     var port = process.env.PORT;
  //     const url = `http://localhost:${port}/v1/run`;
  //     request.post(url, {body: params, json:true},
  //       (error, response, body) => {
  //         if (error) {
  //           log.error(error);
  //           return reject(error);
  //         }
  //         resolve(body);
  //       });
  //   })
  //   .then(result => {
  //     const runId = result.runId;
  //     return retry(() => {
  //       return new Promise((resolve, reject) => {
  //         var port = process.env.PORT;
  //         const url = `http://localhost:${port}/v1/run/${runId}`;
  //         request.get(url, (error, response, body) => {
  //             if (error) {
  //               log.error(error);
  //               return reject(error);
  //             }
  //             var getResult = JSON.parse(body);
  //             const status = getResult.status;
  //             if (status === statusConstants.RUNNING) {
  //               log.trace('Rejecting because body.status=' + status);
  //               reject(getResult);
  //             } else {
  //               resolve(getResult);
  //             }
  //           });
  //       });
  //     }, {max_tries:240, interval:2000});
  //   })
  //   .then(result => {
  //     if (result.jobResult.exitCode == 0) {
  //       const outputPdbUrl = result.outputPdbUrl;
  //       return new Promise((resolve, reject) => {
  //         request.get(outputPdbUrl, (error, response, body) => {
  //             if (error) {
  //               log.error(error);
  //               return reject(error);
  //             }
  //             //We're not actually checking the result here, just making
  //             //sure that the request succeeds
  //             if (response.statusCode == 200) {
  //               resolve(true);
  //             } else {
  //               reject({statusCode:response.statusCode, body});
  //             }
  //           });
  //       })
  //       .then(() => {
  //         return {success:true, result:result};
  //       });
  //     } else {
  //       return {success:false, result:result};
  //     }
  //   })
  //   .catch(err => {
  //     log.error(err);
  //     return {success:false, error:JSON.stringify(err)};
  //   });
  // },
};

module.exports = test_utils;