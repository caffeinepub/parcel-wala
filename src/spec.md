# Specification

## Summary
**Goal:** Update branding and navigation UX, add a Sign Up flow that persists expanded user profile details, simplify Send Parcel, and add profile photo selection.

**Planned changes:**
- Update the home hero phone photo asset to show on-screen text “Pacel Wala”, and use it wherever the current phone photo is used.
- Change tab/screen transitions to a smooth horizontal (side-to-side) slide animation, respecting prefers-reduced-motion.
- Replace remaining “$” currency displays with the Indian Rupee symbol (₹) across the UI, including replacing/removing any $-implying currency icons.
- Simplify Send Parcel by removing the “How are you travelling” field, updating validation, and sending a reasonable default travel mode in the submit payload.
- Add a Profile tab option to upload/select a local image and preview it as the user’s avatar (UI-only).
- Add a Sign Up option from the AccessDenied screen and guide users without a profile through profile creation collecting at minimum Name, Phone number, and Government-ID address; persist these details to the backend user profile and return them on subsequent loads.
- Style the Sign Up Name field with larger text and a transparent input background while keeping accessibility/contrast consistent with the theme.
- Ensure “Offer Trip” is present in the bottom tab navigation and routes to the existing Offer Trip page.
- Replace remaining onboarding/auth text references to “ParcelGo” with “Parcel Wala”.
- Extend backend UserProfile to store additional Sign Up fields (at minimum phone number and address) and update save/get flows; add upgrade migration if needed to preserve existing stored profiles.

**User-visible outcome:** Users see updated “Parcel Wala” branding (including the hero phone image), smooth horizontal transitions between tabs, ₹ currency throughout, a simpler Send Parcel form, a profile photo preview option, and a Sign Up flow that creates and saves a fuller user profile; “Offer Trip” is available in the bottom tabs.
