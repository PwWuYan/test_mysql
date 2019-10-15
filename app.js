const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const Static = require('koa-static')
const connect = require('./controller/index.js')

function my(sql, params = []) {
    return new Promise((res, rej) => {
        connect.query(sql, params, (error, data) => {
            if (error) {
                rej({ code: 0, msg: error })
            } else {
                res({ code: 1, msg: data })
            }
        })
    })
}
//查询
router.get('/list', async ctx => {
        let data = await my('select * from userlist')
        ctx.body = data
    })
    //增加
router.post('/add', async cxt => {
        let { name, sex, tel, idCard } = cxt.request.body

        let sql1 = 'select * from userlist where idCard=?'

        let isHas = await my(sql1, [idCard])

        if (!isHas.msg) {
            let sql = 'insert into userlist (name,sex,tel,idCard) values (?,?,?,?)'
            let data = await my(sql, [name, sex, tel, idCard])
            cxt.body = data
        } else {
            cxt.body = { code: 3, msg: '已存在' }
        }


    })
    //删除
router.get('/del', async cxt => {
        let { idCard } = cxt.query
        let sql = 'delete from userlist where idCard=?'
        let data = await my(sql, [idCard])
        if (data.msg == 'error') {
            cxt.body = {
                code: 0,
                msg: '删除失败'
            }

        } else {
            cxt.body = {
                code: 1,
                msg: '删除成功'
            }
        }
    })
    //修改
router.post('/revise', async cxt => {
    let { name, sex, tel, idCard, id } = cxt.request.body
    let sql = "update userlist u set u.name=?,u.sex=?,u.tel=?,u.idCard=? where id=?";
    let data = await my(sql, [name, sex, tel, idCard, id])
    if (data.msg == 'error') {
        cxt.body = {
            code: 0,
            msg: '修改失败'
        }
    } else {
        cxt.body = {
            code: 1,
            msg: '修改成功'
        }
    }
})
app.use(bodyParser())
app.use(router.routes())
app.listen(3000, () => {
    console.log('3000 is doing . . . ')
})