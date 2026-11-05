# CollectNow

**Scattered rumors → verified drops and fair prices.**
A ServiceNow scoped app plus an EmployeeWorks assistant. Collectors use it to find out when the next drop is, where to buy at retail, and whether a resale price is fair. Built by Team39 at the **now[dev]26 hackathon**.

▶️ **Demo video (2:05):** [`docs/demo/collectnow-demo.mp4`](docs/demo/collectnow-demo.mp4)

![CollectNow Assistant answering in EmployeeWorks](docs/screenshots/ew3_answer.jpg)

---

## The problem

Collectors chase items like a Labubu blind box, a Pokémon Elite Trainer Box or a sports-card hobby box. The information they need is scattered:

- **Group chats and forums** pass around restock rumors with conflicting dates.
- **Official stores** sell out with no restock date.
- **Resellers** charge up to roughly 2× retail (in our demo data, $54.99 against $27.99).

## The solution

| Layer | What it does |
|---|---|
| **EmployeeWorks · CollectNow Assistant** | Collectors ask in plain language ("When is the next Big Into Energy drop, and where can I buy it at retail?"). The assistant calls ServiceNow live and answers with drops, prices, and a deal check. |
| **ServiceNow · CollectNow app** | The system of record for collectibles, stores, drops, listings, community tips, previous sales and watches. Business rules turn verified community tips into drops automatically. A role-secured Collector Context API serves EmployeeWorks over OAuth. |

```mermaid
flowchart LR
  subgraph SN["ServiceNow — CollectNow (system of record)"]
    T[(Collectible, Store, Drop,\nListing, Tip, Sale, Watch)]
    BR[Business rules:\ndrop status, tip approval]
    API[Scripted REST:\nCollector Context API]
    AC[buyer role + ACLs]
  end
  T --> BR
  T --> API
  AC --> API
  API -->|OAuth: read context + create watch| EW[EmployeeWorks\nCollectNow Assistant]
```

## Screenshots

| | |
|---|---|
| ![Question](docs/screenshots/ew1_question.jpg) Maya asks in EmployeeWorks | ![AI steps](docs/screenshots/ew4_steps.jpg) Live lookups against CollectNow |
| ![Deal check](docs/screenshots/ew5_deal.jpg) "Is $42 a good deal?" | ![Upcoming drops](docs/screenshots/sn1_upcoming.jpg) Upcoming Drops page with countdowns |
| ![Finder](docs/screenshots/sn3_finder_prices.jpg) Collectible Finder, best price flagged | ![Tip](docs/screenshots/sn4_tip.jpg) A Reddit tip, verified and turned into a drop |
| ![Business rule](docs/screenshots/sn7_rulecode.jpg) Guard rails on tip approval | ![API](docs/screenshots/sn5_api.jpg) Collector Context API resources |

## What's in the app

**Scope:** `x_1234_team39_co_0` · **Version:** 1.0.0

### Tables
| Table | Purpose |
|---|---|
| `x_1234_team39_co_0_collectible` | Catalog: name, category (Pokémon / Labubu / Sports Cards / Other), series, edition |
| `x_1234_team39_co_0_store` | Stores and marketplaces (online / retail) |
| `x_1234_team39_co_0_drop` | Releases and restocks; status (upcoming / live / past) is derived from dates |
| `x_1234_team39_co_0_listing` | Current store listings: price, condition, availability |
| `x_1234_team39_co_0_tip` | Community tips (from Reddit, email, etc.) awaiting review |
| `x_1234_team39_co_0_sale` | Previous sales that power the market and deal signals |
| `x_1234_team39_co_0_watch` | A collector's watched items, with max price and minimum condition |

### Business logic
- **Set Drop Status from Dates** (before insert/update on Drop): derives `upcoming`, `live` or `past`.
- **Create Record from Approved Tip** (before update on Tip): approving a *Drop* tip creates a Drop, and approving a *Listing/Restock* tip creates a Store Listing. Approval is blocked with a clear error if the tip type, collectible, store or (for drops) date is missing.
- **Inbound email action**: an incoming email creates a Community Tip.

### Collector Context API (Scripted REST)
Base path `/api/x_1234_team39_co_0/collector`. Requires the `x_1234_team39_co_0.buyer` role.

| Method | Path | Purpose |
|---|---|---|
| GET | `/collectible/{id}` | Full context for one collectible (by sys_id or number): sales history, live and upcoming drops, listings, and a computed `market` summary with a `deal_signal` |
| GET | `/collectibles?q=&category=` | Search collectibles |
| POST | `/watch` | Create a watch for the calling collector |
| GET | `/watches` | The caller's active watches with matching drops |

`deal_signal` compares the lowest in-stock listing with the average sold price: `great_deal` (≤ −15%), `fair` (within +10%), otherwise `overpriced`.

### UI
- **Collectible Finder** (`x_1234_team39_co_0_finder.do`): search, live market stats, and tabs for Available Now, Past Drops and Upcoming Drops.
- **Upcoming Drops** (`x_1234_team39_co_0_upcoming_drops.do`): every live and upcoming drop, soonest first, with countdowns.

### Security and testing
- `buyer` role. Read ACLs on the catalog tables, create and read-own on Watch, and execute on the REST endpoint.
- ATF tests cover drop status derivation, tip approval (positive and negative) and auto-numbering.

## Repository layout

```
servicenow/
  metadata/     # App records exported as ServiceNow XML (one file per record type)
  demo-data/    # Demo records for the app's tables
docs/
  demo/         # Demo video + captions
  screenshots/  # EmployeeWorks and ServiceNow screens
```

### Importing into another instance
Each file in `servicenow/` is a standard ServiceNow XML export (`<unload>` format). On a test instance, go to **System Definition → Tables**, open any list, right-click the header, choose **Import XML**, and upload the files from `metadata/` (start with `sys_app.xml`, `sys_scope_privilege.xml` and `sys_db_object.xml`). Then load `demo-data/` if you want sample records.

> This is a backup and showcase export, not a Source Control–linked repo. The app was built on a temporary hackathon instance.

## Built with
ServiceNow (scoped app, Business Rules, Scripted REST, ACLs, ATF) · ServiceNow **Build Agent** · **EmployeeWorks** (CollectNow Assistant, connected over OAuth)

## Team
Team39 · now[dev]26 hackathon
