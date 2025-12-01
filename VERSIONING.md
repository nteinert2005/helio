# Helio App Versioning Guide

This document defines the official versioning system for the Helio application. All releases must follow this format exactly:

```
MAJOR.MINOR.PATCH
Example: 0.4.2
```

Versioning exists for one reason: **truth in change**. Every number tells a real story about what shifted.

---

## 1. Version Number Breakdown

### MAJOR (X.0.0)

Represents **foundational shifts**.

Increment MAJOR when:

* Core product philosophy changes
* Data model is restructured
* Primary user workflow is replaced
* Backward compatibility is intentionally broken

Examples:

* 0.x.x → 1.0.0 = Public launch
* 1.x.x → 2.0.0 = New core data engine

Rule:

> MAJOR changes redefine what the product *is*.

---

### MINOR (0.X.0)

Represents **meaningful capability growth**.

Increment MINOR when:

* New major feature is added
* New dashboard module ships
* New insight class is introduced
* New scoring system or category is added
* Significant UX flow expansion

Examples:

* 0.1.0 = Onboarding + tracking
* 0.2.0 = HelioIQ scoring added
* 0.3.0 = Signals dashboard live

Rule:

> MINOR changes expand what the product *can do*.

---

### PATCH (0.0.X)

Represents **stability and precision**.

Increment PATCH when:

* Bugs are fixed
* Copy is refined
* Performance is improved
* Small UI adjustments are made
* Edge cases are corrected

Examples:

* 0.1.1 = Login crash fixed
* 0.1.2 = Copy refinement
* 0.1.3 = Data sync bug resolved

Rule:

> PATCH changes sharpen what already exists.

---

## 2. Pre-1.0.0 Rules (Active Development Phase)

While MAJOR is **0**, the product is considered:

* Experimental
* Rapidly evolving
* Internally validated

During this phase:

* MINOR can break UX expectations
* PATCH should never add new features
* Backward compatibility is **best-effort, not guaranteed**

Truth rule:

> 0.x.x means the foundation is still being shaped.

---

## 3. Public Release Rule (1.0.0)

The jump to **1.0.0** happens only when:

* Core tracking is stable
* HelioIQ scoring is locked
* Data integrity is verified
* Onboarding is complete
* Primary user promise is reliably fulfilled

1.0.0 means:

* The product is now **accountable**
* Breaking changes require major justification

---

## 4. Hotfix Protocol

Hotfixes are PATCH-only releases used for:

* Production errors
* Data corruption risks
* Security issues

Format:

```
Current version: 0.4.1
Hotfix release:  0.4.2
```

Hotfix rules:

* No new features
* No UX expansion
* Fix only what is broken

---

## 5. Internal Build Tagging (Optional Layer)

Internal builds may append a suffix:

```
0.4.2-alpha
0.4.2-beta
0.4.2-rc
```

Definitions:

* **alpha** = experimental, unstable
* **beta** = feature-complete, not polished
* **rc** = release candidate

These tags do **not** change the core semantic number.

---

## 6. Release Naming (Optional, Human Layer)

Versions may have codenames for internal use:

Examples:

* 0.1.0 — "First Signal"
* 0.2.0 — "Momentum"
* 0.3.0 — "Pattern Lock"

Rules:

* Names describe behavior, not hype
* Never public-facing by default

---

## 7. Versioning Truth Table

| Change Type              | Increment |
| ------------------------ | --------- |
| New core system          | MAJOR     |
| New major feature        | MINOR     |
| Bug fix / polish         | PATCH     |
| Copy refinement only     | PATCH     |
| Infrastructure rewrite   | MAJOR     |
| Insight engine expansion | MINOR     |

---

## Final Rule

If the change:

* Alters identity → **MAJOR**
* Adds capability → **MINOR**
* Sharpens precision → **PATCH**

Every release leaves a trace.
The version number is the signature.
