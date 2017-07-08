import Router from './index'
import remotedev from 'mobx-remotedev'


@remotedev({
    global: false
})
export default class LoggedRouter extends Router {}
