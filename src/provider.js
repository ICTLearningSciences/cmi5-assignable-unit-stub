/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 

No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2))

No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
import React from "react";
import TinCan from "tincanjs";
import { Context as CmiContext } from "./context";
import Cmi5 from "./cmi5";

export const Provider = ({ children }) => {
  const [status, setStatus] = React.useState(Cmi5.STATUS.NONE);

  /**
   * Mark the lesson as completed with a score (or no score if non assement),
   * and then (by default) terminate the cmi5 session.
   *
   * Generally safer to use the combined 'complete then terminate'
   * to more safely manage that the two events are published correctly in order.
   *
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
   * @params {Boolean} terminate - if TRUE, terminates the cmi5 session after
   *      submitting 'completed'. Default is TRUE
   * @params {Boolean} verbose - if TRUE, logs more events to console. Default is FALSE
   */
  const completed = (
    score,
    failed,
    extensions,
    terminate = true,
    verbose = false
  ) => {
    if (!Cmi5.isCmiAvailable) {
      return;
    }
    if (verbose) {
      console.log("cmi5 sending COMPLETED and will follow with TERMINATE...");
    }
    if (
      status !== Cmi5.STATUS.STARTED &&
      status !== Cmi5.STATUS.COMPLETE_FAILED
    ) {
      console.error(
        "complete called from invalid state (you need to call start action before complete and complete can be called only ONE time)",
        status
      );
      return;
    }
    const cmi = Cmi5.instance;
    if (!cmi) {
      /**
       * the cmi instance will be null if initialization failed with an error
       * e.g. because this web-app was launched using a url
       * that didn't have cmi5's expected query params:
       * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch
       */
      console.error(
        "complete called having no cmi instance (you need to call start action before complete)"
      );
      return;
    }
    setStatus(Cmi5.STATUS.COMPLETE_IN_PROGRESS);
    const onCompleteCallback = err => {
      if (err) {
        console.error("completion call failed with error:", err);
        setStatus(Cmi5.STATUS.COMPLETE_FAILED);
      } else {
        setStatus(Cmi5.STATUS.COMPLETED);
      }
      if (!terminate) {
        if (verbose) {
          console.log("after COMPLETED, skipping TERMINATE...");
        }
        return;
      }
      setStatus(Cmi5.STATUS.TERMINATE_IN_PROGRESS);
      cmi.terminate(err => {
        if (err) {
          console.error("completion call failed with error:", err);
          setStatus(Cmi5.STATUS.TERMINATE_FAILED);
          return;
        }
        setStatus(Cmi5.STATUS.TERMINATED);
      });
    };
    if (isNaN(Number(score))) {
      /**
       * if no score is passed, then we will complete with
       * the COMPLETED verb (as opposed to PASSED or FAILED)
       * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_completed
       */
      extensions = score;
      cmi.completed(extensions, onCompleteCallback);
      return;
    }
    /**
     * A score was passed, so we will complete with
     * the either verb PASSED
     * (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_passed)
     * or FAILED
     * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_failed)
     */
    failed = typeof failed === "boolean" ? failed : false;
    if (failed) {
      cmi.failed(score, extensions, onCompleteCallback);
    } else {
      cmi.passed(score, extensions, onCompleteCallback);
    }
  };

  const sendStatement = (
    verb,
    activityExtensions,
    contextExtensions,
    result
  ) => {
    console.log("CALLED sendStatement...");
    if (!Cmi5.isCmiAvailable) {
      return;
    }
    if (status !== Cmi5.STATUS.STARTED) {
      console.error(
        "Send statement called when status is not STARTED.",
        status
      );
      return;
    }
    const cmi = Cmi5.instance;
    if (!cmi) {
      /**
       * the cmi instance will be null if initialization failed with an error
       * e.g. because this web-app was launched using a url
       * that didn't have cmi5's expected query params:
       * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch
       */
      console.error(
        "sendStatement called having no cmi instance (you need to call start action before sendStatement)"
      );
      return;
    }
    const st = cmi.prepareStatement(verb);
    if (activityExtensions) {
      const curDefinition = st.target.definition
        ? st.target.definition.asVersion()
        : {};
      st.target.definition = new TinCan.ActivityDefinition({
        ...curDefinition,
        extensions: curDefinition.extensions
          ? { ...curDefinition.extensions, ...activityExtensions }
          : activityExtensions
      });
    }
    if (contextExtensions) {
      st.context.extensions = st.context.extensions
        ? { ...st.context.extensions, ...contextExtensions }
        : contextExtensions;
    }
    if (result) {
      st.result =
        result instanceof TinCan.Result ? result : new TinCan.Result(result);
    }
    cmi.sendStatement(st, err => {
      if (err) {
        console.error("sendStatement call failed with error:", err);
        return;
      }
    });
  };

  /**
   * As early  as possible you must initialize cmi5 by calling the start action.
   * No completion or termination can be called unless start has completed successfully.
   * Under the covers of start, the full cmi5 launch sequence is executed:
   * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch
   */
  const start = url => {
    if (!Cmi5.isCmiAvailable) {
      return;
    }
    setStatus(Cmi5.STATUS.START_IN_PROGRESS);
    Cmi5.create(url)
      .then(cmi => {
        cmi.start(startErr => {
          if (startErr) {
            setStatus(Cmi5.STATUS.START_FAILED);
            console.error(`CMI error: ${startErr}`);
            return;
          }
          setStatus(Cmi5.STATUS.STARTED);
        });
      })
      .catch(err => {
        setStatus(Cmi5.STATUS.START_FAILED);
      });
  };

  /**
   * In CMI5 protocol, a statement with verb TERMINATED
   * (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#938-terminated)
   * should be called once (and only once) to end the session.
   */
  const terminate = () => {
    if (!Cmi5.isCmiAvailable) {
      return;
    }
    if (
      status !== Cmi5.STATUS.COMPLETED &&
      status !== Cmi5.STATUS.TERMINATE_FAILED
    ) {
      console.error(
        'Terminate called when status is not COMPLETED. Generally safer to use "completeAndTerminate" action',
        status
      );
    }
    const cmi = Cmi5.instance;
    if (!cmi) {
      /**
       * the cmi instance will be null if initialization failed with an error
       * e.g. because this web-app was launched using a url
       * that didn't have cmi5's expected query params:
       * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch
       */
      console.error(
        "complete called having no cmi instance (you need to call start action before complete)"
      );
      return;
    }
    sendStatus(Cmi5.STATUS.TERMINATE_IN_PROGRESS);
    cmi.terminate(err => {
      if (err) {
        console.error("completion call failed with error:", err);
        sendStatus(Cmi5.STATUS.TERMINATE_FAILED);
        return;
      }
      sendStatus(Cmi5.STATUS.TERMINATED);
    });
  };

  return (
    <CmiContext.Provider
      value={{
        cmi5_status: status,
        completed,
        sendStatement,
        start,
        terminate
      }}
    >
      {children}
    </CmiContext.Provider>
  );
};

export default Provider;
