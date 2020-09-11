/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 

No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
import React, { Component } from "react";
import { Context as CmiContext } from "react-cmi5-context";

/**
 * An example question that can be wrapped as a child of Cmi5AssignableUnit.
 *
 * The import piece to note is the use of the injected action properties
 * 'passed' and 'failed', which the question can use to submit results.
 */
export default class ExampleQuestion extends Component {
  static contextType = CmiContext;

  constructor(props) {
    super(props);
    this.state = {
      knowledgeComponents: {
        a: 0,
        b: 0,
        c: 0,
        d: 0
      }
    };
    this.onKnowledgeComponentScoreUpdated = this.onKnowledgeComponentScoreUpdated.bind(
      this
    );
  }

  onKnowledgeComponentScoreUpdated(topicId, e) {
    const score = e.target.value / 100.0;
    this.setState({
      ...this.state,
      knowledgeComponents: {
        ...this.state.knowledgeComponents,
        [topicId]: score
      }
    });
  }

  render() {
    // context includes special actions for passed({score:1.0}) and failed({score: 0.0 })
    // These are wrappers for cmi.passed and cmi.failed
    // that make sure cmi has initialized before score is actually sent
    const { completed, terminate } = this.context;

    const onSubmit = () => {
      // just make the score the avg of all the knowledge-component scores
      const score = Object.getOwnPropertyNames(
        this.state.knowledgeComponents
      ).reduce((acc, cur, i) => {
        return (acc * i + this.state.knowledgeComponents[cur]) / (i + 1);
      }, 0);

      const extensions = {
        "https://pal.ict.usc.edu/xapi/vocab/exts/result/kc-scores": Object.getOwnPropertyNames(
          this.state.knowledgeComponents
        ).reduce((acc, cur, i) => {
          return [
            ...acc,
            {
              kc: cur, // just for reference, in this extension domain, 'kc' is a knowledge component
              score: this.state.knowledgeComponents[cur]
            }
          ];
        }, [])
      };
      if (score > 0) {
        completed(score, false, extensions);
      } else {
        completed(score, true, extensions);
      }

      terminate();
    };

    return (
      <div className="row">
        <div className="col-lg-1 col-md-1 col-sm-1">
          <div>KNOWLEDGE-0COMPONENT SCORES:</div>
          <div className="form-group">
            {["a", "b", "c", "d"].map(id => {
              return (
                <div key={id}>
                  <label>Knowledge Component {id.toUpperCase()}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={this.state.knowledgeComponents[id] * 100.0 || 0}
                    className="slider"
                    id={id}
                    onChange={e => this.onKnowledgeComponentScoreUpdated(id, e)}
                  />
                  <label>: {this.state.knowledgeComponents[id] || 0}</label>
                </div>
              );
            })}
          </div>
          <div className="form-group">
            <button
              htmlFor="button"
              id="submitbutton"
              className="btn"
              onClick={onSubmit}
            >
              submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}
ExampleQuestion.contextType = CmiContext;
