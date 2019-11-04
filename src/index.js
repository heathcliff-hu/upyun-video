/* eslint-disable camelcase */
const sign = require('./sign');
const util = require('./util');
const createReq = require('./create-req');

/**
 * 音视频异步处理
 * @type {module.Client}
 * @link https://help.upyun.com/knowledge-base/av/#e5bfabe9809fe585a5e997a8
 */

module.exports = class Client {
  constructor(service_name, operator, password) {
		this.endpoint = 'http://p1.api.upyun.com';

		this.service = {
			name: service_name,
			operator,
			password: util.md5(password),
		};

    this.req = createReq(this.endpoint, this.service, sign.getHeaderSign);
  }


	/**
	 * 获取视频截图
	 * @link https://help.upyun.com/knowledge-base/sync_video/#e8a786e9a291e688aae59bbeefbc88m3u8-e688aae59bbeefbc89
	 * @param {String} source 视频存储地址
	 * @param {String} save_as 截图保存地址
	 * @param {String} point 截图时间点，格式为 HH:MM:SS
   * @param {Object} options
   * @param {String} options.size 截图尺寸，格式为 宽x高，默认是视频尺寸
	 * @param {String} options.format 截图格式，可选值为 jpg，png, webp, 默认根据 save_as 的后缀生成
	 */
	async snapshot(source, save_as, point, options = {}) {
		return this.req.post(`/${this.service.name}/snapshot`, {
		  source,
			save_as,
			point,
			...options,
		}).then(response => {
			return response.data;
		})
	}

	/**
	 * 获取 M3U8 信息
	 * @link https://help.upyun.com/knowledge-base/sync_video/#e88eb7e58f96-m3u8-e4bfa1e681af
   * @param {String} m3u8 m3u8 存储地址
 	 */
	async getM3u8Info(m3u8) {
		return this.req.post(`/${this.service.name}/m3u8er/get_meta`, {
			m3u8,
		}).then(response => {
			return response.data;
		});
	}

	/**
	 * m3u8 拼接
	 * @link https://help.upyun.com/knowledge-base/sync_video/#m3u8-e68bbce68ea5
	 * @param {Array<String>} m3u8s 拼接 M3U8 的存储地址，按提交的顺序进行拼接
	 * @param {String} save_as 结果保存地址
	 */
	async m3u8Concat(m3u8s, save_as) {
		return this.req.post(`/${this.service.name}/m3u8er/concat`, {
		  m3u8s,
			save_as,
		}).then(response => {
		  return response.data;
		});
	}

	/**
	 * M3U8 剪辑
	 * @link https://help.upyun.com/knowledge-base/sync_video/#m3u8-e589aae8be91
	 * @param {String} m3u8 M3U8 的存储地址
	 * @param {String} save_as 结果保存地址
	 * @param {Object} options
	 * @param {Array<String>} options.include 包含某段内容的开始结束时间，单位是秒。当 index 为 false 时，为开始结束分片序号
	 * @param {Array<String>} options.exclude 不包含某段内容的开始结束时间，单位是秒。当 index 为 false 时，为开始结束分片序号
	 * @param {Boolean} options.index include 或者 exclude 中的值是否为 ts 分片序号，默认为 false
	 *
	 * @description include 与 exclude 互斥，只能设置一个。当两个都设置时，使用 include。
	 */
	async m3u8Clip(m3u8, save_as, options = {}) {
	  return this.req.post(`/${this.service.name}/m3u8er/clip`, {
	  	m3u8,
			save_as,
			...options,
		}).then(response => {
			return response.data;
		});
	}

	/**
	 * 获取音视频元信息
	 * @link https://help.upyun.com/knowledge-base/sync_video/#e88eb7e58f96e99fb3e8a786e9a291e58583e4bfa1e681af
	 * @param {String} source 视频存储地址
	 */
	async getAVInfo(source) {
		return this.req.post(`/${this.service.name}/avmeta/get_meta`, {
			source
		}).then(response => {
			return response.data;
		});

	}
};
