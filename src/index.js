const proxyHttp = require('http-proxy')
    , fs = require('fs')
    , http = require('http')
    , proxy = proxyHttp.createProxyServer({})
    , path = require('path')
proxy.on('proxyReq', proxyReq => {
    const data = fs.readFileSync(path.resolve(__dirname, './headers.json'))
        , headers = JSON.parse(data)
    for(const key in headers) {
        if (headers.hasOwnProperty(key)) {
            proxyReq.setHeader(key, headers[key])
        }
    }
})
http.createServer((req, res) => {
    proxy.web(req, res, { target: 'http://119.29.51.222:80' });
}).listen(80)