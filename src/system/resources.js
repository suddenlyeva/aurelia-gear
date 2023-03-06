let resources = {};

resources.___load = (res) => {
  for (let key in res) {
    resources[key] = res[key];
  }
};

export default resources;
