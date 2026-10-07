# Campus Café POS Kiosk

A touchscreen friendly self service ordering kiosk for the IT415 Practical Examination. Customers can build an order, review it, choose a simulated payment method, and view a transaction backed digital receipt. The app runs entirely in the browser and does not need a database or payment gateway.

## Features

- Eight campus café products with prices in Philippine pesos.
- Large, touch friendly product cards with add feedback.
- Cart quantities, removal, line subtotals, item count, and order total.
- Review screen with back navigation that preserves the cart.
- Cash validation for blank, invalid, negative, and insufficient amounts; calculates change.
- Simulated QR and card payment flows.
- Payment success screen with a unique transaction reference.
- Receipt values generated from the completed transaction.
- Print Receipt opens the browser print dialog and prints only the completed receipt, without kiosk controls.
- New Order clears the customer transaction and advances the display order number.
- Responsive layout and localStorage persistence for the display order number only.

## Technology Stack

- Next.js 14, React 18, TypeScript
- Tailwind CSS (base setup) and custom responsive CSS
- Lucide React icons
- React hooks and browser localStorage

## Installation

Install Node.js 18.17 or later, then run from this directory:

```bash
npm install
```

## Running the Application

```bash
npm run dev
```

Open http://localhost:3000. To try the exact exam scenario, add Coffee twice, Burger once, and French Fries once. Review the order (total ₱220), continue to payment, choose Cash, enter 500, and pay. The success screen should show ₱280 change; the receipt should list those three lines and the transaction reference. Start New Order should return to the menu with an empty cart and ₱0 total.

## Build Instructions

```bash
npm run build
npm start
```

## Git/GitHub Workflow

Use a feature branch for implementation, commit meaningful units of work with descriptive messages, and open a pull request for review. Do not manufacture contribution history. Suggested stages: setup, product menu, cart, summary/navigation, payment options, cash validation, receipt, reset, refinements, and documentation.

## Group Members

Add the actual group member names and roles here before submission.

## Contributions

Record each group member's actual work here. Do not claim contributions that were not performed.

## AI Development Documentation

- **AI used:** OpenAI Codex, an AI coding assistant.
- **Prompt:** The project brief supplied for this examination, requesting a Next.js, TypeScript, Tailwind and React campus café POS kiosk with product selection, cart, order summary, cash/QR/card simulation, transaction receipt, reset behavior, responsive touchscreen styling, and README.
- **Generated code:** Initial project configuration, product data and types, reusable money and transaction helpers, responsive visual styling, and the customer kiosk flow in `app/page.tsx`.
- **Problems to check during testing:** Cash edge cases, cart math after quantity edits, transaction uniqueness, actual receipt data, and clearing state for the next customer.
- **Changes after implementation review:** Payment state is captured in a transaction snapshot at completion so receipt details reflect the paid order. Cart controls clamp quantities by removing the line at zero. Cash validation stops completion for blank, invalid, negative, and insufficient values. A distinct card processing screen makes the simulated process visible.
- **Debugging/refactoring:** Shared calculation and currency formatting live in `lib/utils.ts`; product definitions and TypeScript domain types are in `lib/products.ts` and `lib/types.ts`. Run the scenario above and the build before submission, and document any further fixes made by the group.
