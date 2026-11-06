# CollectNow: executive summary

**Team39 · now[dev]26 hackathon · built in one day**

🏆 **Hackathon Category Winner: _Build it for yourself_** (November 4, 2026)

## The problem
Collectors of Pokémon cards, Labubu blind boxes and sports-card hobby boxes lose time and money to scattered, unreliable information. Restock dates spread as rumors in group chats and forums. Official stores sell out with no restock date. Resellers fill the gap at up to about 2× retail ($54.99 against $27.99 in our demo).

## What we built
A ServiceNow app plus an EmployeeWorks assistant that work together from end to end.

1. **Ask in plain language.** In EmployeeWorks, the *CollectNow Assistant* answers questions like "When is the next Labubu Big Into Energy drop, and where can I buy it at retail?" It calls ServiceNow live and replies with the official drop, the date, the store, the retail price and the reseller prices. It also flags unconfirmed rumors.
2. **Check whether a price is fair.** "Is $42 a good deal?" gets a computed answer: percentage over retail, comparison with other listings, and a condition caveat.
3. **A system of record for the market.** ServiceNow tracks collectibles, stores, drops, listings, community tips, previous sales and watches.
4. **Community tips, verified.** Tips come in from Reddit, email and other places. A reviewer approves them, and approval creates the drop or listing automatically. Incomplete tips are blocked with a clear message.

## How it works
| Piece | Platform capability |
|---|---|
| 7 custom tables, auto-numbered | ServiceNow scoped app |
| Drop status (upcoming / live / past) from dates | Business rule |
| Tip approval → Drop or Listing, with guard rails | Business rule |
| Email → Community Tip | Inbound email action |
| Collector Context API (4 routes, deal signal) | Scripted REST API |
| Role-based access, read-own watches | ACLs + `buyer` role |
| Collectible Finder and Upcoming Drops pages | React UI pages (ServiceNow SDK) |
| Regression safety | 7 ATF tests |
| Middle layer (intent → API call) | ToolSmith plugins, HTTP actions, OAuth connector in Tool Studio |
| Conversational front end | EmployeeWorks productivity assistant |
| Build acceleration | ServiceNow Build Agent |

## Why it matters
- **For collectors:** one trusted answer instead of 11 browser tabs, plus fair-price signals before paying a reseller markup.
- **For the platform:** a pattern any ServiceNow team can reuse. Keep ServiceNow as the system of record, expose *computed context* (not raw rows) through a role-secured Scripted REST API, and let ToolSmith plugins route the conversation in EmployeeWorks to it. See [ARCHITECTURE.md](ARCHITECTURE.md).

## Ideas worth borrowing
- **Serve decisions, not rows.** The API returns a `market` summary and a `deal_signal`, so the assistant reasons over conclusions instead of re-deriving them.
- **Human-in-the-loop for crowd data.** Tips stay pending until a reviewer approves them, and a business rule guarantees approval only succeeds when the data is complete.
- **Fail loudly and helpfully.** Every blocked action tells the user exactly which field to fix.
- **Test the guard rails.** ATF covers the negative paths, not just the happy path.

## What's next
- Price-alert notifications when a watched item drops below `max_price`
- A scheduled job to refresh drop status over time (today it recalculates on save)
- Longer URL fields (some are capped at 30 characters)
- Sales-history ingestion to strengthen the deal signal
