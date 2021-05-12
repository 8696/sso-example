# SSO example

SSO单点登录跨站点NodeJS示例。基于 cookie、session 实现

### 演示

[链接](https://app-login.sso-demo.icodekk.com/)

### 目录结构

```
|-- app-001
    |-- app.js                业务001服务文件
    |-- view                  模板文件
|-- app-002
    |-- app.js                业务002服务文件
    |-- view                  模板文件
|-- app-sso
    |-- app.js                登录系统服务文件
    |-- view                  模板文件
|-- service
    |-- session.js            session 服务文件
|-- util
|-- app.js                    统一服务启动文件
|-- config.js                 配置文件
|-- package.json              项目配置文件
|-- pm2.config.js              pm2 配置文件
```

### 环境

> node10.0.0+

> redis4.0+

### session

本示例中 session 服务由自己编写，未作任何加密。所有 session 信息保存在 redis 中。实现在跨站点服务中 session 共享


### 站点

- 登录系统：
    + 本地：localhost:3000
    + 生产：https://app-login.sso-demo.icodekk.com
    
- 业务系统001
    + 本地：localhost:3001
    + 生产：https://app-001.sso-demo.icode.link
    
- 业务系统002
    + 本地：localhost:3002
    + 生产：https://app-002.sso-demo.icode.link

### 相关知识

[cookie](https://javascript.ruanyifeng.com/bom/cookie.html)
