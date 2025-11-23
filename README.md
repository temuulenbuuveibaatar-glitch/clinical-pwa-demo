````markdown name=README.md
```text
# Clinical PWA Prototype

This repository is a prototype PWA (React) demonstrating:
- Offline local DB (PouchDB) with optional sync to a CouchDB-compatible server
- Service worker + web manifest for installability
- Simple clinician UI & a non-AI clinical decision support (CDS) rule
- Audit logging to local DB (sync to server for permanent storage)
- Small Web Crypto utilities for device-side encryption (prototype only)

Important: This is a prototype for demonstration and evaluation only. Do not use for live patient care. See docs/legal.md for legal, clinical disclaimer, DPIA checklist and security notes.

How to run:
1. Copy files into a project (Vite-based).
2. Set .env variables (VITE_SYNC_URL etc).
3. npm install
4. npm run start

For hospital deployments:
- Host the server-side sync (CouchDB) inside the hospital network.
- Use hospital-managed KMS/HSM for keys.
- Use strong OIDC with MFA, device attestation, and RBAC.
- Consult legal and clinical governance before any clinical use.
````