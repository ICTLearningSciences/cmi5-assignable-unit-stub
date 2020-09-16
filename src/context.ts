/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 

No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
import { Extensions, Result } from "@gradiant/xapi-dsl";
import React from "react";
import { Cmi5Status, HasVerb } from "./cmi5";

export interface Cmi5Context {
  cmiStatus: Cmi5Status;
  completed: (
    score: number,
    failed: boolean,
    extensions?: Extensions,
    terminate?: boolean,
    verbose?: boolean
  ) => Promise<void>;
  sendStatement: (
    verb: HasVerb | string,
    activityExtensions?: Extensions,
    contextExtensions?: Extensions,
    result?: Result
  ) => Promise<void>;
  start: () => Promise<void>;
  terminate: () => Promise<void>;
}

export const Context = React.createContext<Cmi5Context>({
  cmiStatus: Cmi5Status.NONE,
  completed: (
    score: number,
    failed: boolean,
    extensions?: Extensions,
    terminate?: boolean,
    verbose?: boolean
  ) => Promise.reject("Context must be wrapped by provider"),
  sendStatement: (
    verb: HasVerb | string,
    activityExtensions?: Extensions,
    contextExtensions?: Extensions,
    result?: Result
  ) => Promise.reject("Context must be wrapped by provider"),
  start: () => Promise.reject("Context must be wrapped by provider"),
  terminate: () => Promise.reject("Context must be wrapped by provider"),
});

export default Context;
