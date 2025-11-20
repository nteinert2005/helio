# **Name**: HelioIQ
## Description: 


# **TECH STACK**

NextJS (Javascript NOT Tailwind), TailwindCSS, Vercel, Supabase, Lucide React Icons, Resend Mailer

# **INPUTS** 
### **Required (MVP)**

- Daily weight
- Calories (rough or logged)
- Protein intake
- Steps
- Water
- Sleep hours
- Medication day (yes/no)
- Bowel movements (none / normal / constipated)
### **Optional (Advanced)**

- Sodium
- Carbs
- Time of last meal
- Stress
- Cycle phase
- Alcohol
- Hydration timing
- Appetite score
- Hunger crashes
- Side effects
- Scale brand (to adjust for variability)
- Weekly average weight

# **RULES** 
## Rule Cluster 1: 
IF sodium > baseline
  AND weight ↑ 0.5–2.5 lb
THEN cause = "water retention from sodium"

IF sleep < 6 hrs
  AND weight ↑
THEN cause = "cortisol-related water retention"

IF steps < 3,000
  AND water low
THEN cause = "stagnant water + low movement"

## Rule Cluster 2:
IF dose recent (past 1–4 days)
THEN cause = "delayed GI emptying slowing scale drops"

IF week 1 OR week 2
THEN cause = "normal early-phase variability"

IF weight stable 2–3 days
AND calories < maintenance
THEN cause = "GLP-1 drop will happen soon"

## Rule Cluster 3:
IF bowel movements = "none"
THEN cause = "constipation artificially raising weight"

IF last meal < 8 hrs before weigh-in
THEN cause = "food still digesting"

## Rule Cluster 4:
IF protein < 60g
THEN issue = "low protein stalling fat burn"

IF calories < 900
THEN issue = "body stress → temporary water retention"

## Rule Cluster 5
IF weigh-in times differ by > 60 minutes
  OR different scale
THEN cause = "measurement variability, not biology"

# **AI REASONER (Interpretation Layer)**

This is where GPT comes in and “tells the story.”

The AI receives:

- today’s metrics
- yesterday’s metrics
- weekly trend
- rule triggers
- user’s GLP-1 dose timeline
    

And outputs a human-readable, calm interpretation.

The AI does:

- pattern matching
- correlation
- explanation
- reassurance
- next steps


# **FULL EXAMPLE**
Let’s simulate a real input so you can see the system.

### **User’s Daily Inputs**
- Weight: +0.4 lbs
- Sodium: high
- Protein: low
- Sleep: 5 hours
- Steps: 2,300
- Water: low
- Bowel movement: none
- Week: 1
- Dose: took yesterday
### **Output from Model**

**Reason for today’s number**:  
“Today’s slight increase is from a combination of high sodium, low sleep, and lack of a bowel movement — all of which create temporary water retention. This is not fat gain.”

**Trend interpretation**:  
“You are in the expected week-1 GLP-1 pattern where weight loss comes in drops rather than daily losses. Nothing in your data suggests lack of progress.”

**Today’s focus**:  
“Drink 2 more bottles of water, aim for 6+ hours of sleep, and try a short walk. This will help your body flush retained water.”


# **THE STRAIGHTFORWARD PATH TO UNICORN POTENTIAL**

## **Phase 1 — Niche: GLP-1 Daily Insight Companion**

(What we designed above)

You solve:

- “Why didn’t I lose weight today?”    
- “What’s happening inside my body on semaglutide/tirzepatide?”
    
This alone can be a $5M–$20M ARR niche SaaS.

Not a unicorn. Yet.

But it gives you the _dataset_.

---

## **Phase 2 — Vertical Expansion: The GLP-1 Optimization Engine**

Once you have thousands of people logging:

- Dose
- Side effects
- Eating
- Weight
- Symptoms
- Energy
- Hunger patterns
- Plateaus
- Rebound after stopping
    
You become the **first large-scale behavioral/physiological dataset for GLP-1 users** outside pharma.

This dataset powers:

- predictive models
- telehealth integrations
- adherence-engine features    
- stop/restart protocols
    
The problem becomes **data**, not UI.

This can be a **$100M–$300M valuation** business.

---

## **Phase 3 — Platform: “GLP-1 Intelligence as a Service” (GLP-1IaaS)**

This is the unicorn move.

You become the backend brain for:

- telehealth clinics
- coaching apps
- medical weight-loss startups
- fitness platforms
- nutrition apps
- premium scales
- wearables
- corporate wellness
    

You offer an API:

> **Send us your user’s daily data → we return individualized insights, explanations, risks, and recommendations.**

This is **exactly** how Levels became multi-hundred-million.  
And exactly how HelioIQ was conceptualized — and this is the perfect wedge for it.

This is scalable, defensible, and high-margin.

---

## **Phase 4 — Ecosystem: GLP-1 OS**

Everything in the GLP-1 lifecycle becomes integrated:

- pre-GLP decision support    
- dose optimization
- side effect reduction
- emotional support
- weight-loss prediction
- behavior modeling
- off-GLP maintenance
- regain prevention
- nutrition personalization
- fitness syncing
- sleep + mood correlation
- long-term metabolic forecasting
    
This is now the **dominant consumer-facing analytics layer for the largest new medical category since SSRIs**.

That _is_ unicorn territory.


----
# 🌑 **GLP-1 Insight Engine — Dark Mode UI Kit v1.0**

---

## **1. Background Layers**

|Layer|Hex|Usage|
|---|---|---|
|Primary Background|`#101214`|Full app background, main container|
|Secondary Surface|`#1A1D20`|Cards, modals, dashboards, input surfaces|
|Tertiary Surface|`#2A2F33`|Charts, inactive panels, menus|
|Divider / Separator|`#3A3F47`|Thin lines, section dividers|
|Overlay / Modal Shadow|`rgba(0,0,0,0.6)`|Dark overlay for modals or popups|

---

## **2. Typography**

**Font:** `Inter`  
**Weights & Sizes:**

|Role|Size|Weight|Color|
|---|---|---|---|
|Display / Hero Metric|72–96px|900|`#FFFFFF`|
|Page Title|32px|700|`#FFFFFF`|
|Section Header|20–24px|600|`#FFFFFF`|
|Body Text|16px|400|`#C9CDD2`|
|UI Label / Input Label|14px|500|`#8A8F98`|
|Microtext / Tooltip|12px|400|`#8A8F98`|

**Notes:**

- Primary info = white
    
- Secondary / hints = soft slate
    
- Use line-height 1.5x for body, 1.2x for headings
    

---

## **3. Buttons**

|Type|Background|Text|Border|Radius|Hover|
|---|---|---|---|---|---|
|Primary|`#3A7FFF`|`#FFFFFF`|none|8px|`#5A9BFF`|
|Secondary|`#2A2F33`|`#3A7FFF`|`#3A7FFF`|8px|`#3A7FFF` bg hover|
|Tertiary / Ghost|transparent|`#3A7FFF`|`#3A7FFF`|8px|`#3A7FFF` bg|

**Usage:**

- Primary = main call-to-action (“Submit Today”, “See Insight”)
    
- Secondary = optional or destructive
    
- Ghost = links, inline actions
    

---

## **4. Inputs / Forms**

|Element|Background|Text|Placeholder|Border|Focus|
|---|---|---|---|---|---|
|Input Field|`#1A1D20`|`#FFFFFF`|`#8A8F98`|`#3A3F47`|`#3A7FFF` 2px|
|Textarea|`#1A1D20`|`#FFFFFF`|`#8A8F98`|`#3A3F47`|`#3A7FFF` 2px|
|Dropdown / Select|`#1A1D20`|`#FFFFFF`|`#8A8F98`|`#3A3F47`|`#3A7FFF` highlight|
|Checkbox / Radio|Border: `#3A3F47`|Check: `#3A7FFF`|-|-|Hover bg: `#2A2F33`|

---

## **5. Cards / Containers**

|Type|Background|Shadow|Border Radius|Padding|
|---|---|---|---|---|
|Info Card|`#1A1D20`|`0 4px 16px rgba(0,0,0,0.5)`|12px|24px|
|Insight Block|`#1A1D20`|none|12px|20px|
|Chart Container|`#2A2F33`|none|8px|16px|

**Notes:**

- Cards are slightly lighter than background for layering
    
- Shadows = subtle, never harsh
    

---

## **6. Graph / Chart Styles**

|Element|Color|Usage|
|---|---|---|
|Primary Trend Line|`#3A7FFF`|Weight / main metric|
|Secondary Trend Line|`#7FD1E8`|Steps, sleep, hydration|
|Axis & Grid|`#3A3F47`|Non-distracting|
|Highlight / Alert|`#FFB85C`|Mild warnings|
|Critical Alert|`#FF6F6F`|Major deviations|

**Tip:** Use soft curves, minimal dots, and no 3D effects — keep it readable.

---

## **7. Status Badges / Tags**

|Type|Background|Text|
|---|---|---|
|Positive|`#3EB980`|`#FFFFFF`|
|Neutral|`#7FD1E8`|`#101214`|
|Warning|`#FFB85C`|`#101214`|
|Critical|`#FF6F6F`|`#FFFFFF`|

- Use sparingly — only for trend flags or insights
    

---

## **8. Navigation / Layout**

- **Top Bar / Header:** `#101214` background, `#FFFFFF` text
    
- **Side Nav (if any):** `#1A1D20` with `#3A7FFF` highlight for active item
    
- **Spacing:** 24px outer padding, 16px inner padding for cards, 8px gutters between elements
    
- **Iconography:** outline style, `#C9CDD2` default, hover `#3A7FFF`
    

---

## **9. Icons / Illustrations**

- Keep line-based or minimal vector
    
- Accent color = `#3A7FFF`
    
- For insight emphasis, use small subtle cyan/blue highlights
    

---

## **10. Typography + Data Integration Tips**

- Hero metric (weight trend, week number) = Inter 900, 72px
    
- Insight heading = Inter 700, 24px
    
- Insight text = Inter 400, 16px
    
- Recommendations = Inter 500, 16px
    
- Body copy contrast = `#C9CDD2`
    
- Tooltips / timestamps = `#8A8F98`
    

**Dark mode focus:** high contrast, minimal glow, avoid color fatigue.

---

# ✅ **Dark Mode MVP Guidelines**

- Dark background with layers (`#101214`, `#1A1D20`, `#2A2F33`)
    
- Primary actions = bright blue (`#3A7FFF`)
    
- Info highlights = cyan (`#7FD1E8`)
    
- Alerts = muted amber/red only when needed
    
- Typography = Inter, clear hierarchy
    
- Minimal shadows for depth
    
- Subtle rounded corners (8–12px)