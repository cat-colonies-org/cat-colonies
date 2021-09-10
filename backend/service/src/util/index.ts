function pick(obj: Record<string, any>, props: string[]) {
  return props.reduce((result, prop) => {
    result[prop] = obj[prop];
    return result;
  }, {});
}

function omit(obj: Record<string, any>, props: string[]) {
  const result = { ...obj };
  props.forEach(function (prop) {
    delete result[prop];
  });
  return result;
}

export { pick, omit };
