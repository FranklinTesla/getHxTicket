const http = require('http')
    , fs = require('fs')
    , path = require('path')
http.createServer((req, res) => {
    fs.writeFile(path.resolve(__dirname, './headers.json'), JSON.stringify(req.headers), err => {
        if (err) {
            throw err
        }
        res.writeHeader(200)
        res.write('save headers success')
        res.end()
    })
}).listen(80)