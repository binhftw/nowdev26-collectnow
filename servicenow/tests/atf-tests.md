# ATF tests


| Test | What it proves |
|---|---|
| **Drop status is derived from dates** | Inserts drops with future, live and past date windows and asserts the business rule sets `upcoming`, `live` or `past`, including the no-end-date case (release + 1 day). Then updates an upcoming drop into a live window to cover the update path. |
| **Approving a tip creates a Drop or Store Listing** | Approving a *Drop* tip links a new Drop (name = tip title). Approving a *Listing* tip links a new Store Listing (in stock, URL copied from the source link). |
| **Tip approval is blocked when required data is missing** | The negative path: approving tips with no store, no tip type, or a Drop tip with no date is aborted, and the tip stays pending. Rejecting a complete tip creates nothing. |
| **Collector Context API is installed and returns data** | Asserts the `collector` Scripted REST API is active with its 4 routes, then runs the context queries for COL0001006 (sales, drops, listings). |
| **Collector watch creation logic** | Exercises the logic behind `POST /watch`: resolves a collectible by number, inserts a watch for the current user, asserts the WCH number and watcher, then cleans up. |
| **Watch gets an auto number** | Watch records get a WCH-prefixed number. |
| **Previous Sale gets an auto number** | Sale records get a SAL-prefixed number. |

The two API tests were first written as live HTTP calls, which returned 401 as intended: the endpoint requires auth, and ATF REST steps need stored credentials. They were then converted to server-side tests.
