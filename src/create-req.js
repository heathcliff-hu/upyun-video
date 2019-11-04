const _ = require('lodash');
const axios = require('axios');
const url = require('url');

const sign = require('./sign');

/**
 * @param endpoint
 * @param service
 * @param getHeaderSign
 * @return {AxiosInstance}
 */
module.exports = function(endpoint, service, getHeaderSign = sign.getHeaderSign) {
  const req = axios.create({
    baseURL: endpoint,
    timeout: 15000,
  });

  req.interceptors.request.use((config) => {
    let method = config.method.toUpperCase();
    let path = url.resolve('/', config.url || '');

    if (path.indexOf(config.baseURL) === 0) {
      path = path.substring(config.baseURL.length);
    }
    config.url = encodeURI(decodeURIComponent(config.url));
    let headerSign = getHeaderSign(service, method, path, config.headers['Content-MD5']);
    headerSign = Promise.resolve(headerSign);

    return headerSign.then((headers) => {
      config.headers.common = headers;
      return Promise.resolve(config)
    })
  }, error => {
    throw new Error('upyun video - request failed: ' + error.message)
  });

  req.interceptors.response.use((response) => {
    return response;
  }, error => {
    const response = _.get(error, 'response');
    if (_.isUndefined(response)) {
      throw error;
    }

    if (response.status === 404) {
      return response;
    }

    // @link https://api.upyun.com/doc#/api/guide/errorCode
    error.message = _.get(error, 'response.data.msg');
    throw error;
  });

  return req;
};
