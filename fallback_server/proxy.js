const express = require('express');
const proxy = require('http-proxy-middleware');

const apiProxy = proxy({
    target: 'http://127.0.0.1:3001',
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    logLevel: 'debug'
});

const frontendProxy = proxy({
    target: 'http://127.0.0.1:3002',
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    logLevel: 'debug'
});

const app = express();

app.use('/api', apiProxy);
app.use('/a', apiProxy);
app.use('/users-permissions', apiProxy);
app.use('/admin', apiProxy);
app.use('/content-manager', apiProxy);
app.use('/content-type-builder', apiProxy);
app.use('/upload', apiProxy);
app.use('/settings-manager', apiProxy);
app.use('/api', apiProxy);
app.use('/uploads', apiProxy);

app.use('/', frontendProxy);

const port = process.env.PORT || 3000

var server = app.listen(port, () => {
    console.log(`Proxy app listening on port ${port}!`)
    console.log(server.address());
});
