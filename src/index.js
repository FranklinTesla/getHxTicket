const proxyHttp = require('http-proxy')
    , fs = require('fs')
    , http = require('http')
    , proxy = proxyHttp.createProxyServer({})
    , path = require('path')
function setHeaders() {
    const isWeixin = arguments[0]
        , proxyRequest = arguments[1];
    if (!isWeixin) {
        const data = fs.readFileSync(path.resolve(__dirname, './headers.json'), 'utf-8')
            , headers = data && JSON.parse(data) || {}
        for(const key in headers) {
            if (headers.hasOwnProperty(key)) {
                proxyRequest.setHeader(key, headers[key])
            }
        }
    }
}
let setHeaderCb;
http.createServer((req, res) => {
    const isWx = /Wechat/.test(req.headers['user-agent'])
    if (isWx) {
        // 若使用微信浏览器打开，则保存请求头信息
        fs.writeFile(path.resolve(__dirname, './headers.json'), JSON.stringify(req.headers), err => {
            if (err) {
                throw err
            }
            console.log('save headers success!')
        })
        setHeaderCb = setHeaders.bind(null, true)
    } else {
        setHeaderCb = setHeaders.bind(null, false)
    }
    proxy.removeListener('proxyReq', setHeaderCb)
        .on('proxyReq', setHeaderCb)
        .web(req, res, { target: 'http://119.29.51.222:80' });
}).listen(80)