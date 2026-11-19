# 3B AI Business Automation

A lightweight, interactive client-flow preview for the standalone 3B AI Business Automation service branch.

## Run locally

Open `index.html` in a browser, or serve the repository root with any static web server. The site has no build step or package dependencies.

## What the preview includes

- 3B-branded overview dashboard and branch positioning
- Established-business and new-business entry context
- Business audit with known/estimated/unknown data labels
- Client-side opportunity suggestions, with transparent source notes
- Draft proposal and approval gates
- 3B Media Group Small Business Online Launch Toolkit entry point:
  - custom logo and brand identity by 3B Media
  - domain search and setup coordination
  - business email setup
  - professional website build
  - optional ongoing site care
- Local-only demo persistence so the flow can be clicked through

## Important implementation status

This is a front-end prototype. It does not authenticate users, verify 3B ID or 3B Business ID, store information on a server, calculate validated ROI, generate AI output, create/send proposals, process payments, file legal forms, contact 3B Media, register domains, or change customer systems. Preview inputs are stored in the browser's local storage. Do not enter real customer information, secrets, tax identifiers, or payment data.

The production build must connect to the canonical 3B identity and business membership services, server-side authorization, shared 3B Payments, secure vendor credentials, and the appropriate 3B Business Development and 3B Media Group handoffs only after those contracts are audited. Sole proprietors also require a 3B Business ID. Any filing assistance must preserve accurate ownership and required disclosures.

## Deployment

This is a static site and can be served from the repository root by a static host such as Vercel. Configure no production integrations or secrets for this prototype.
