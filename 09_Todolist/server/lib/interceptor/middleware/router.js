const url = require('url');
const path = require('path');

function check(rule, pathname) {
  const paraMatched = rule.match(/:[^/]+/g);
  const ruleExp = new RegExp(`^${rule.replace(/:([^/]+)/g, '([^/]+)')}$`);
  const ruleMatched = pathname.match(ruleExp);
  if(ruleMatched) {
    const ret = {};
    if(paraMatched) {
      for(let i = 0; i < paraMatched.length; i++) {
        ret[paraMatched[i].slice(1)] = ruleMatched[i + 1];
      }
    }
    return ret;
  }
  return null;
}

function route(method, rule, aspect) {
  return async (ctx, next) => {
    const req = ctx.req;
    if(!ctx.url) ctx.url = url.parse(`http://${req.headers.host}${req.url}`);
   
    const checked = check(rule, ctx.url.pathname);
    // console.log('rule: ', rule);
    // console.log('ctx.url.pathname: ', ctx.url.pathname);
    // console.log('checked: ', checked);
    if(!ctx.route && (method === '*' || req.method === method)
      && !!checked) {
      ctx.route = checked;
      await aspect(ctx, next);
    } else {
      await next();
    }
  };
}

class Router {
  constructor(base = '') {
    this.baseURL = base;
  }

  get(rule, aspect) {
    return route('GET', this.baseURL+rule, aspect);
  }

  post(rule, aspect) {
    return route('POST', this.baseURL+rule, aspect);
  }

  put(rule, aspect) {
    return route('PUT', this.baseURL+rule, aspect);
  }

  delete(rule, aspect) {
    return route('DELETE', this.baseURL+rule, aspect);
  }

  all(rule, aspect) {
    return route('*', this.baseURL+rule, aspect);
  }
}

module.exports = Router;
