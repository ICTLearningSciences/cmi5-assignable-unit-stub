const _Cmi5 = window.Cmi5
let _url = null
let _cmi = null

/**
 * Singleton wrapper for a cmi service.
 */
class Cmi5 {
    static get STATUS() {
        return {
            NONE: 0,
            START_IN_PROGRESS: 1,
            STARTED: 2,
            START_FAILED: 3,
            COMPLETE_IN_PROGRESS: 4,
            COMPLETED: 5,
            COMPLETE_FAILED: 6,
            TERMINATE_IN_PROGRESS: 6,
            TERMINATED: 7,
            TERMINATE_FAILED: 8
        }
    }

    
    static get STATUS_PROP() {
        return "cmi5_status"
    }


    static getStatus(state) {
        return state? state[Cmi5.STATUS_PROP] || Cmi5.STATUS.NONE: Cmi5.STATUS.NONE
    }

    
    static setStatus(state, status=Cmi5.STATUS.NONE) {
        state = state || {}
        return {
            ...state,
            [Cmi5.STATUS_PROP]: status
        }
    }


    static create(url) {
        _url = url
        _cmi = new _Cmi5(Cmi5.url)
        return _cmi
    }


    static get url() {
        return _url || window.location.href
    }
  

    static set url(value) {
        _url = value
    }


    static get instance() {
        if(_cmi) {
            return _cmi
        }
        try {
           return Cmi5.create()
        }
        catch(err) {
            console.error(err)
            return null
        }
    }
}

export default Cmi5
