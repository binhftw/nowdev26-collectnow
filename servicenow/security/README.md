# Security

**Role:** `x_1234_team39_co_0.buyer`, the collector persona that EmployeeWorks calls as (over OAuth).

| ACL | Operation | Type | Notes |
|---|---|---|---|
| `x_1234_team39_co_0_collector` | execute | REST endpoint | Only `buyer` (or admin) can call the Collector Context API. Anonymous calls get 401. |
| `x_1234_team39_co_0_collectible` | read | record | |
| `x_1234_team39_co_0_store` | read | record | |
| `x_1234_team39_co_0_drop` | read | record | |
| `x_1234_team39_co_0_listing` | read | record | |
| `x_1234_team39_co_0_sale` | read | record | |
| `x_1234_team39_co_0_watch` | create | record | |
| `x_1234_team39_co_0_watch` | read | record | Read-own only (script below) |

All ACLs have `admin_overrides = true`.

```javascript
// x_1234_team39_co_0_watch — read
answer = (current.watcher == gs.getUserID()) || gs.hasRole('admin');
```

Full definitions: [`../xml/metadata/sys_security_acl.xml`](../xml/metadata/sys_security_acl.xml) and [`sys_security_acl_role.xml`](../xml/metadata/sys_security_acl_role.xml).
