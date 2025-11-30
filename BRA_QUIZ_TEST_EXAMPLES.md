# Bra Quiz Test Examples

Use these measurement combinations to test different scenarios:

## 1. Sister Size Example (26 Band)
**Triggers:** Sister size message for 26F-L sizes

**Measurements:**
- Snug Underband (SU): 25.5
- Tight Underband (TU): 24
- Standing Overbust (SO): 35
- Leaning Overbust (LO): 37
- Breast Space: Average (1-2 fingers) or any

**Expected Result:**
- Main Size: 26G (or similar)
- Sister Size: 30F (up 2 band sizes, down 2 cup sizes)
- Message: "Although we don't carry your exact recommended size yet, a sister size of 30F might work for you!"

---

## 2. Sister Size Example (28 Band)
**Triggers:** Sister size message for 28E-KK sizes

**Measurements:**
- Snug Underband (SU): 27.3
- Tight Underband (TU): 26
- Standing Overbust (SO): 36
- Leaning Overbust (LO): 38
- Breast Space: Average (1-2 fingers) or any

**Expected Result:**
- Main Size: 28H (or similar)
- Sister Size: 30GG (up 1 band size, down 1 cup size)
- Message: "Although we don't carry your exact recommended size yet, a sister size of 30GG might work for you!"

---

## 3. Sister Size Example (42 Band)
**Triggers:** Sister size message for 42D-JJ sizes

**Measurements:**
- Snug Underband (SU): 41.2
- Tight Underband (TU): 39.5
- Standing Overbust (SO): 48
- Leaning Overbust (LO): 50
- Breast Space: Average (1-2 fingers) or any

**Expected Result:**
- Main Size: 42F (or similar)
- Sister Size: 40FF (down 1 band size, up 1 cup size)
- Message: "Although we don't carry your exact recommended size yet, a sister size of 40FF might work for you!"

---

## 4. Relaxed Fit Example (Different Band Methods)
**Triggers:** Relaxed fit when Method A and Method B give different results

**Measurements:**
- Snug Underband (SU): 32.0
- Tight Underband (TU): 30.0 (TU+2 = 32, but Method A might give 32, Method B gives 32)
- Standing Overbust (SO): 40
- Leaning Overbust (LO): 42
- Breast Space: Average (1-2 fingers)

**Better Example:**
- Snug Underband (SU): 31.5 (rounds to 32)
- Tight Underband (TU): 29.0 (TU+2 = 31, rounds to 32)
- Standing Overbust (SO): 40
- Leaning Overbust (LO): 42
- Breast Space: Average (1-2 fingers)

**Expected Result:**
- Main Size: 32F (or similar)
- Relaxed Fit: 34E (up 1 band size, down 1 cup size)
- Message: "Based on your measurements, we recommend that you either use a non-stretch extender for your first few wears as you break in your new bra. Or, you could also choose 34E for a more relaxed fit."

---

## 5. Relaxed Fit Example (Even Number with Decimal 0.01-0.50)
**Triggers:** Relaxed fit when SU is even with decimal 0.01-0.50

**Measurements:**
- Snug Underband (SU): 32.25
- Tight Underband (TU): 30
- Standing Overbust (SO): 40
- Leaning Overbust (LO): 42
- Breast Space: Average (1-2 fingers)

**Expected Result:**
- Main Size: 32F (or similar)
- Relaxed Fit: 34E
- Message: "Based on your measurements, we recommend that you either use a non-stretch extender for your first few wears as you break in your new bra. Or, you could also choose 34E for a more relaxed fit."

---

## 6. Firm Fit Example (SU - TU > 3")
**Triggers:** Firm fit when there's more "squish" (difference > 3")

**Measurements:**
- Snug Underband (SU): 34
- Tight Underband (TU): 30 (difference = 4")
- Standing Overbust (SO): 42
- Leaning Overbust (LO): 44
- Breast Space: Average (1-2 fingers)

**Expected Result:**
- Main Size: 34F (or similar)
- Firm Fit: 32FF (down 1 band size, up 1 cup size)
- Message: "Based on your measurements, you could choose 32FF for a more supportive fit."

---

## 7. Firm Fit Example (Band Size >= 38)
**Triggers:** Firm fit for larger band sizes

**Measurements:**
- Snug Underband (SU): 38.5
- Tight Underband (TU): 36
- Standing Overbust (SO): 46
- Leaning Overbust (LO): 48
- Breast Space: Average (1-2 fingers)

**Expected Result:**
- Main Size: 38F (or similar)
- Firm Fit: 36FF (down 1 band size, up 1 cup size)
- Message: "Based on your measurements, you could choose 36FF for a more supportive fit."

---

## 8. Multiple Options Example
**Triggers:** Both relaxed fit and firm fit

**Measurements:**
- Snug Underband (SU): 34.2 (even with decimal 0.01-0.50 = relaxed fit trigger)
- Tight Underband (TU): 30 (SU - TU = 4.2" > 3" = firm fit trigger)
- Standing Overbust (SO): 42
- Leaning Overbust (LO): 44
- Breast Space: Average (1-2 fingers)

**Expected Result:**
- Main Size: 34F (or similar)
- Relaxed Fit: 36E
- Firm Fit: 32FF
- Both messages should appear

---

## 9. Standard Size (No Extras)
**Triggers:** Just the main size, no sister sizes or fit options

**Measurements:**
- Snug Underband (SU): 32
- Tight Underband (TU): 30
- Standing Overbust (SO): 40
- Leaning Overbust (LO): 42
- Breast Space: Average (1-2 fingers)

**Expected Result:**
- Main Size: 32F (or similar)
- No sister size
- No relaxed fit
- No firm fit

---

## 10. Adjacent Cup Example (Multiple Cup Sizes)
**Triggers:** Adjacent cup rule (decimal 0.25-0.59)

**Measurements:**
- Snug Underband (SU): 32
- Tight Underband (TU): 30
- Standing Overbust (SO): 40.5
- Leaning Overbust (LO): 42.5
- Breast Space: Average (1-2 fingers)

**Expected Result:**
- Main Size: 32F/FF (adjacent cups)
- If relaxed fit applies: 34E/F (adjacent cups maintained)

---

## Notes:
- **Breast Space Options:**
  - "No space" or "CS" = Close-Set (adds 1 cup size)
  - "1-2 fingers" or "AS" = Average Space (no adjustment)
  - "More than 2 fingers" or "SS" = Side-Set (subtracts 1 cup size)

- **Cup Size Mapping:**
  - Difference 5" = DD
  - Difference 6" = E
  - Difference 7" = F
  - Difference 8" = FF
  - Difference 9" = G
  - Difference 10" = GG
  - And so on...

- **Band Size Rounding:**
  - Even whole numbers: use as-is
  - Odd whole numbers: round up to next even
  - Even with decimal 0.01-0.50: round down to that even
  - Even with decimal 0.51-0.99: round up to next even

