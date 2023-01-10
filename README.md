# cmi5-assignable-unit-stub

A web-app that functions as a stub/test cmi5 [Assignable Unit](https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#41-assignable-unit-au) for your xapi/cmi5-compliant Learning Management System.

## What is Cmi5?

If you're building a Learning Management System (LMS) you probably need a way to launch Assignable Units (AU) and have the launched AU send back scores etc. CMI5 is a standard within the broader XAPI spec for managing that runtime communication between an LMS and a launched AU.

## Why do I need this stub?

If you're building either an LMS or AU content, it's handy to have a drop in AU that lets you confirm that CMI5 integration is working properly and quickly diagnose any problems should they arise.

## How do I use this stub to test my LMS?

You don't need to clone or build this stub yourself, we have it hosted for you here: https://cmi5-au-stub.pal3.org/

## Launching the Stub

To satisfy the cmi5 protocol, your LMS should launch this stub (or any AU) with the following params

- `fetch`: a url to retrieve an access token for your XAPI server
- `endpoint`: the root endpoint for your XAPI server
- `activityId`: IRI/id for the XAPI object this assignable unit represents (callbacks to 'passed', 'failed' etc. will use this activity id)
- `registration`: basically an XAPI session id
- `actor`: account for which results will be applied (passed as a json XAPI actor object)

Details for the above are here in the cmi5 spec [here](https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#81-launch-method)

## Creating your own Assignable Unit

This stub is using the [@xapi/cmi5](https://www.npmjs.com/package/@xapi/cmi5) library to implement the cmi5 protocol, and you can refer to that module for usage docs.

At the simplest level though, this would be an example of how to make a `react` app function as a CMI5 AU:

- Install the cmi5 lib

> ```bash
> npm install --save @xapi/cmi5
> ```

- As early as possible, initialize cmi5

> ```typescript
> import Cmi5 from '@xapi/cmi5';
> // NOTE: have PR open to change the below to singleton access, e.g. Cmi5.get().initialize();
> const cmi5 = new Cmi5();
> cmi5.initialize();
> ```

- When the lesson is done, send a score
> ```typescript
> // NOTE: have PR open to change the below to singleton access, e.g. Cmi5.get().moveOn(0.9);
> cmi5.moveOn(0.9);
> ```
