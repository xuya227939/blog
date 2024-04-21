---
title: EPROTO 3928:error:1408F10B:SSL routines:ssl3
pubDate: 2019-07-26 13:26:49
categories: ["Node.js"]
description: ""
---

## How fix

node.js use request package and options add a secureProtocol is 'TLSv1_method'

## Example

```
const request = require('request');
const options = {
    url: 'https://10.134.136.112:8888/casserver/login?service=http%3A%2F%2F10.134.137.120%3A8000%2Fpiccclaim%2Fj_acegi_security_check%3BPICC_CLAIM_Cookie%3DWTXhd5pQY4SwQJpdKGxMQhXvl0L4Qp7pJhPrprm0ptmCqlW7JHkS%21566150954%21-472537668',
    // proxy: 'http://127.0.0.1:8888'
    secureProtocol: 'TLSv1_method'
};
request.get(options, function (err, response, data) {
    console.log(data, err, response);
});
```
