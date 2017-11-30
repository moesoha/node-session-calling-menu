# Session Calling Menu

## 会话互动

It is designed for WeChat Official Accounts at first.

最初为了微信公众号而设计。

----------

### Example 

This is an example with NPM package `wechat`.

```
const scmMongoModel = require('session-calling-menu-model-mongodb'), SessionCallingMenu = require('session-calling-menu');
let scmReady = false, scm;

scmMongoModel("mongodb://127.0.0.1:27017/test", "scm", {
    expireTime: 3600 * 1000
}).then(function (scmModel) {
    scm = new SessionCallingMenu(scmModel, {
        lifetime: 30 * 60 * 1000,
        escapeString: "退出",
        afterEscape: function (content, session, param) {
            param.reply({
                content: "您已退出当前功能。",
                type: "text"
            })
        }
    });

    scm.load([
        {
            entry: "test",
            flow: [
                function (content, session, param) {
                    param.reply({
                        type: 'text',
                        content: 'send 1 or anything.'
                    });
                },
                async function (content, session, param) {
                    if (parseInt(content) == 1) {
                        await session.currentLayerDec();
                        param.reply({
                            type: 'text',
                            content: 'send anything again, but don\'t send 1.'
                        });
                    } else {
                        let type1 = await session.setData('hello.text', content);
                        param.reply({
                            type: 'text',
                            content: 'send anything to see what u sent.'
                        });
                    }
                },
                async function (content, session, param) {
                    param.reply({
                        content: await session.getData('hello.text') + "\n exiting...",
                        type: 'text'
                    });
                }
            ]
        }
    ]);

    scmReady = true;
});

app.use('/wechat', wechat(config, async function (req, res, next) {
    var message = req.weixin, reply = res.reply;
    if (scmReady) {
        if (!await scm.handler({
            uniqueId: message.FromUserName,
            content: message.Content,
            flowParameter: {
                reply: reply,
                message: message
            }
        })) {
            switch (message.Content.trim()) {
                default:
                    reply({
                        content: 'unknown command',
                        type: 'text'
                    });
                    break;
            }
        }
    }
}));
```