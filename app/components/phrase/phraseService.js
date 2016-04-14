function phraseService() {
  var aPrivateVariable = "yay";

  function hello() {
    return "hello mars " + aPrivateVariable;
  }

  // expose a public API
  return {
    hello: hello
  };
}