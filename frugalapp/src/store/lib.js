import { Observable } from "rxjs/Observable";

export function createActions(mutations, prefix) {
  const payload = {
    types: {},
    actions: {}
  };

  mutations.forEach(mutation => {
    const type = `${prefix}/${mutation}`;
    payload.types[mutation] = type;
    payload.actions[mutation] = function(payload) {
      return {
        type,
        payload
      };
    };
  });

  return payload;
}

export const defer = func => () => {
  return Observable.defer(func);
};
