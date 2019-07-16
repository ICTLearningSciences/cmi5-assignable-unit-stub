import Cmi5 from './cmi5'

export const START_REQUESTED = "CMI5_START_REQUESTED"
export const START_SUCCEEDED = "CMI5_START_SUCCEEDED"
export const START_FAILED = "CMI5_START_FAILED"
export const COMPLETE_REQUESTED = "CMI5_COMPLETE_REQUESTED"
export const COMPLETE_SUCCEEDED = "CMI5_COMPLETE_SUCCEEDED"
export const COMPLETE_FAILED = "CMI5_COMPLETE_FAILED"
export const TERMINATE_REQUESTED = "CMI5_TERMINATE_REQUESTED"
export const TERMINATE_SUCCEEDED = "CMI5_TERMINATE_SUCCEEDED"
export const TERMINATE_FAILED = "CMI5_TERMINATE_FAILED"

/**
 * In CMI5 protocol, one of complete/pass/failed should be called once (and only once).
 * This single 'completed' function will send a result with a completion verb as follows:
 *   - COMPLETED (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_completed)
 *       If no `score` is passed
 *   - PASSED (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_passed)
 *       If a `score` is passed and `failed` is *not* passed or anything other then `true
 *   - FAILED (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_failed)
 *       If a `score` is passed and `failed` is `true`
 * (COMPLETED, PASSED, FAILED)
 * 
 * @params {Number} [score] - the score for PASSED or FAILED or leave undefined for non-assessment resources
 * @params {Boolean} [failed] - pass `true` *only* with a failing score
 * @params {Object} [extensions] - a XAPI extensions object to pass with result 
 *     (https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#result)
 */
export const completed = (score, failed, extensions) => (dispatch, getState) => {
    const cmiStatus = Cmi5.getStatus(getState())
    if(cmiStatus !== Cmi5.STATUS.STARTED && cmiStatus !== Cmi5.STATUS.COMPLETE_FAILED) {
        console.error('complete called from invalid state (you need to call start action before complete and complete can be called only ONE time)', cmiStatus)
        return
    }
    const cmi = Cmi5.instance
    if(!cmi) {
        /**
         * the cmi instance will be null if initialization failed with an error
         * e.g. because this web-app was launched using a url 
         * that didn't have cmi5's expected query params:
         * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch
         */
        console.error('complete called having no cmi instance (you need to call start action before complete)')
        return
    }
    dispatch({type: COMPLETE_REQUESTED})
    const onDone = (err) => {
        if(err) {
            console.error('completion call failed with error:', err)
            dispatch({type: COMPLETE_FAILED, error: err.message})
            return
        }
        dispatch({type: COMPLETE_SUCCEEDED})
    }
    if(isNaN(Number(score))) {
        /**
         * if no score is passed, then we will complete with 
         * the COMPLETED verb (as opposed to PASSED or FAILED)
         * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_completed
         */
        extensions = score
        cmi.completed(extensions, onDone)
        return
    }
    /**
     * A score was passed, so we will complete with 
     * the either verb PASSED 
     * (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_passed)
     * or FAILED
     * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_failed)
     */
    failed = typeof(failed) === 'boolean'? failed: false
    if(failed) {
        cmi.failed(score, extensions, onDone)
    }
    else {
        cmi.passed(score, extensions, onDone)
    }
}

/**
 * As early  as possible you must initialize cmi5 by calling the start action.
 * No completion or termination can be called unless start has completed successfully.
 * Under the covers of start, the full cmi5 launch sequence is executed:
 * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch
 */
export const start = url => dispatch => {
    dispatch({type: START_REQUESTED})
    try {
        const cmi = Cmi5.create(url)
        cmi.start((startErr, result) => {
            if(startErr) {
                dispatch({type: START_FAILED, error: startErr.message})
                console.error(`CMI error: ${startErr}`)
                return
            }
            dispatch({type: START_SUCCEEDED})
        })
    }
    catch(err) {
        dispatch({type: START_FAILED, error: err.message})
    }
}

/**
 * In CMI5 protocol, a statement with verb TERMINATED 
 * (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#938-terminated) 
 * should be called once (and only once) to end the session.
 */
export const terminate = () => (dispatch, getState) => {
    const cmiStatus = Cmi5.getStatus(getState())
    if(cmiStatus !== Cmi5.STATUS.COMPLETED && cmiStatus !== Cmi5.STATUS.TERMINATE_FAILED) {
        console.error('terminate called from invalid state', cmiStatus)
        return
    }
    const cmi = Cmi5.instance
    if(!cmi) {
        /**
         * the cmi instance will be null if initialization failed with an error
         * e.g. because this web-app was launched using a url 
         * that didn't have cmi5's expected query params:
         * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch
         */
        console.error('complete called having no cmi instance (you need to call start action before complete)')
        return
    }
    dispatch({type: TERMINATE_REQUESTED})
    cmi.terminate((err) => {
        if(err) {
            console.error('completion call failed with error:', err)
            dispatch({type: TERMINATE_FAILED, error: err.message})
            return
        }
        dispatch({type: TERMINATE_SUCCEEDED})
    })
}

export default {
    COMPLETE_FAILED,
    COMPLETE_REQUESTED,
    COMPLETE_SUCCEEDED,
    START_FAILED,
    START_REQUESTED,
    START_SUCCEEDED,
    TERMINATE_FAILED,
    TERMINATE_REQUESTED,
    TERMINATE_SUCCEEDED,
    completed,
    start,
    terminate
}