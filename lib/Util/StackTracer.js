// https://stackoverflow.com/questions/14172455/get-name-and-line-of-calling-function-in-node-js
const StackTracer = {
  get stacks() {
    const orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack) {
      return stack.slice(1).map(v => ({
        fileName: v.getFileName(),
        functionName: v.getFunctionName(),
        line: v.getLineNumber(),
      }));
    };
    const stack = new Error().stack;
    Error.prepareStackTrace = orig;
    return stack;
  },
  get fileName() {
    return this.stacks[1].fileName;
  },
  get functionName() {
    return this.stacks[1].functionName;
  },
  get line() {
    return this.stacks[1].line;
  },
};

module.exports = StackTracer;
