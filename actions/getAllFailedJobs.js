var async = require('async');
var action = {};

/////////////////////////////////////////////////////////////////////
// metadata
action.name = 'getAllFailedJobs';
action.description = 'I will return all failed jobs';
action.inputs = {
  'required': [],
  'optional': []
};
action.blockedConnectionTypes = [];
action.outputExample = {
}

/////////////////////////////////////////////////////////////////////
// functional
action.run = function (api, connection, next) {
  // we cant process any tasks if no scheduler runs... abort action with error
  if(!api.resque.scheduler){
    connection.response.errorMessage = "No Scheduler running!";
    next(connection, true);
    return;
  }
  // Get all delyed jobs via ZRANGEBYSCORE
  api.resque.scheduler.connection.redis.lrange('resque:failed', 0, -1, function(err, failed) {
    var failedJobs = [];
    console.dir(failed);
    for(var fail in failed){
      failedJobs.push(failed[fail]);
    }
    connection.response.failedJobs = failedJobs;
    next(connection, true);
  });

};

/////////////////////////////////////////////////////////////////////
// exports
exports.action = action;
