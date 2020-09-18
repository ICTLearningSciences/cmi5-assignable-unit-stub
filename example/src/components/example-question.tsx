/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 

No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
import React, { useContext, useState } from "react";
import { Context as CmiContext, ICmi5Context } from "react-cmi5-context";
import {
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

/**
 * An example question that can be wrapped as a child of Cmi5AssignableUnit.
 *
 * The import piece to note is the use of the injected action properties
 * 'passed' and 'failed', which the question can use to submit results.
 */
const ExampleQuestion = () => {
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const cmi = useContext<ICmi5Context>(CmiContext);
  const { completed, terminate } = cmi;

  const onInput = (e) => {
    setScore(parseFloat(e.target.value));
  };

  const onToggle = () => {
    setPassed(!passed);
  };

  const onSubmit = () => {
    const kcs = [
      {
        kc: "kc",
        score: score,
      },
    ];
    const extensions = {
      "https://pal.ict.usc.edu/xapi/vocab/exts/result/kc-scores": kcs,
    };
    if (passed) {
      completed(score, false, extensions);
    } else {
      completed(score, true, extensions);
    }
    terminate();
  };

  return (
    <div>
      <TextField
        id="score"
        placeholder="Score"
        fullWidth
        value={score}
        onChange={(e) => {
          onInput(e);
        }}
        variant="outlined"
      />
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox id="passed" checked={passed} onChange={onToggle} />
          }
          label="Passed"
        />
      </FormGroup>
      <Button
        id="submit"
        variant="contained"
        color="primary"
        size="large"
        onClick={onSubmit}
      >
        Submit
      </Button>
    </div>
  );
};

export default ExampleQuestion;
