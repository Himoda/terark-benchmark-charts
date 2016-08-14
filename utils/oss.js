/**
 * Created by royguo on 6/4/16 AD.
 */

var co = require('co')
var OSS = require('ali-oss')

var config = require('../config')

var client = new OSS({
    endpoint: config.oss.endpointForDownload,
    accessKeyId: config.oss.accessKeyId,
    accessKeySecret: config.oss.accessKeySecret,
    bucket: config.oss.bucketName
});

var OSSUtils = function () {
}

/**
 * 为私有数据创建公共的访问URL
 * @param path
 */
OSSUtils.generateDownloadUrl = function (path) {
    var url = client.signatureUrl(path, {expires: 3600})
    return url
}

/**
 * 上传数据到OSS上
 * @param sourcePath
 * @param targetPath
 * @param filename
 */
OSSUtils.upload = function (sourcePath, targetPath) {
    return co(function* () {
        var result = yield client.put(targetPath, sourcePath)
        return result
    }).catch(function (err) {
        console.log(err);
    });
}

module.exports = OSSUtils
