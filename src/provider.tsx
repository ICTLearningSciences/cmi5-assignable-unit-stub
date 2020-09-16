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
import { Result, Extensions } from "@gradiant/xapi-dsl";
import React from "react";
import { Context as CmiContext } from "./context";
import Cmi5, { Cmi5Status } from "./cmi5";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TinCan = require("tincanjs");

interface Props {
  children: React.ReactNode;
}
export function Provider(props: Props): JSX.Element {
  const { children } = props;
  const [cmiStatus, setCmiStatus] = React.useState(Cmi5Status.NONE);

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
  async function completed(
    score: number,
    failed: boolean,
    extensions?: Extensions,
    terminate = true,
    verbose = false
  ): Promise<void> {
    if (!Cmi5.isCmiAvailable) {
      return;
    }
    if (verbose) {
      console.log("cmi5 sending COMPLETED and will follow with TERMINATE...");
    }
    if (
      cmiStatus !== Cmi5Status.STARTED &&
      cmiStatus !== Cmi5Status.COMPLETE_FAILED
    ) {
      console.error(
        "complete called from invalid state (you need to call start action before complete and complete can be called only ONE time)",
        cmiStatus
      );
      return;
    }
    try {
      const cmi = await Cmi5.instance;
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
      setCmiStatus(() => Cmi5Status.COMPLETE_IN_PROGRESS);
      const onCompleteCallback = (err: Error | null): void => {
        if (err) {
          console.error("completion call failed with error:", err);
          setCmiStatus(() => Cmi5Status.COMPLETE_FAILED);
        } else {
          setCmiStatus(() => Cmi5Status.COMPLETED);
        }
        if (!terminate) {
          if (verbose) {
            console.log("after COMPLETED, skipping TERMINATE...");
          }
          return;
        }
        setCmiStatus(() => Cmi5Status.TERMINATE_IN_PROGRESS);
        cmi.terminate((err) => {
          if (err) {
            console.error("completion call failed with error:", err);
            setCmiStatus(() => Cmi5Status.TERMINATE_FAILED);
            return;
          }
          setCmiStatus(() => Cmi5Status.TERMINATED);
        });
      };
      if (isNaN(Number(score))) {
        /**
         * if no score is passed, then we will complete with
         * the COMPLETED verb (as opposed to PASSED or FAILED)
         * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#verbs_completed
         */
        cmi.completed(score, onCompleteCallback);
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
    } catch (err) {
      console.error(err);
    }
  }

  async function sendStatement(
    verb: string,
    activityExtensions?: Extensions,
    contextExtensions?: Extensions,
    result?: Result
  ): Promise<void> {
    console.log("CALLED sendStatement...");
    if (!Cmi5.isCmiAvailable) {
      return;
    }
    if (cmiStatus !== Cmi5Status.STARTED) {
      console.error(
        "Send statement called when cmiStatus is not STARTED.",
        cmiStatus
      );
      return;
    }
    try {
      const cmi = await Cmi5.instance;
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
      const st = cmi.prepareStatement({
        verb: {
          id: `${verb}`,
        },
      });
      if (activityExtensions) {
        const curDefinition = (st as any).target.definition
          ? (st as any).target.definition.asVersion()
          : {};
        (st as any).target.definition = new TinCan.ActivityDefinition({
          ...curDefinition,
          extensions: curDefinition.extensions
            ? { ...curDefinition.extensions, ...activityExtensions }
            : activityExtensions,
        });
      }
      if (contextExtensions) {
        st.context!.extensions = st.context!.extensions
          ? { ...st.context!.extensions, ...contextExtensions }
          : contextExtensions;
      }
      if (result) {
        st.result =
          result instanceof TinCan.Result ? result : new TinCan.Result(result);
      }
      cmi.sendStatement(st, (err) => {
        if (err) {
          console.error("sendStatement call failed with error:", err);
          return;
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * As early  as possible you must initialize cmi5 by calling the start action.
   * No completion or termination can be called unless start has completed successfully.
   * Under the covers of start, the full cmi5 launch sequence is executed:
   * https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#content_launch
   */
  async function start(url = ""): Promise<void> {
    if (!Cmi5.isCmiAvailable) {
      return;
    }
    setCmiStatus(() => Cmi5Status.START_IN_PROGRESS);
    Cmi5.create(url)
      .then((cmi) => {
        cmi.start((startErr) => {
          if (startErr) {
            setCmiStatus(() => Cmi5Status.START_FAILED);
            console.error(`CMI error: ${startErr}`);
            return;
          }
          setCmiStatus(() => Cmi5Status.STARTED);
        });
      })
      .catch((err: Error) => {
        console.error(err);
        setCmiStatus(() => Cmi5Status.START_FAILED);
      });
  }

  /**
   * In CMI5 protocol, a statement with verb TERMINATED
   * (https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#938-terminated)
   * should be called once (and only once) to end the session.
   */
  async function terminate(): Promise<void> {
    if (!Cmi5.isCmiAvailable) {
      return;
    }
    if (
      cmiStatus !== Cmi5Status.COMPLETED &&
      cmiStatus !== Cmi5Status.TERMINATE_FAILED
    ) {
      console.error(
        'Terminate called when cmiStatus is not COMPLETED. Generally safer to use "completeAndTerminate" action',
        cmiStatus
      );
    }
    try {
      const cmi = await Cmi5.instance;
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
      setCmiStatus(() => Cmi5Status.TERMINATE_IN_PROGRESS);
      cmi.terminate((err) => {
        if (err) {
          console.error("completion call failed with error:", err);
          setCmiStatus(() => Cmi5Status.TERMINATE_FAILED);
          return;
        }
        setCmiStatus(() => Cmi5Status.TERMINATED);
      });
    } catch (err) {
      console.error(err);
    }
  }
  // useEffect(() => {
  //   if (Cmi5.isCmiAvailable && cmiStatus === Cmi5Status.NONE) {
  //     start();
  //   }
  // }, []);
  return (
    <CmiContext.Provider
      value={{
        cmiStatus: cmiStatus,
        completed,
        sendStatement,
        start,
        terminate,
      }}
    >
      {children}
    </CmiContext.Provider>
  );
}

export default Provider;
