Clinical PWA Prototype — Deploy & Import Guide (demo)

Important security note (read before deploying)
- This prototype is NOT production-ready.
- Do NOT deploy with real PHI until hospital IT/legal completed DPIA, key management and pen tests.
- Always host CouchDB and the backend inside the hospital network or on a vetted cloud under a BAA.

Local demo (quick)
1. Clone repo and checkout demo branch:
   git clone git@github.com:temuulenbuuveibaatar-glitch/clinical-pwa-demo.git
   cd clinical-pwa-demo
   git checkout demo

2. Bring up CouchDB + API:
   docker-compose up --build

3. Install & start frontend:
   npm install
   npm run start
   Open http://localhost:5173

4. Login:
   POST /api/login { email, password } (default demo password: password)
   Example accounts are in seeds/users.json

Import medications (full dataset)
- Preferred: keep the full medication dataset in secure internal storage and import via the admin UI or scripts.
- To import via script into CouchDB:
   COUCH_URL=http://admin:admin@localhost:5984/medications node scripts/import_medications.js path/to/meds.csv

Import emergency guides
- If you have the International-emergency-guide repo locally:
   1. git clone https://github.com/temuulenbuuveibaatar-glitch/International-emergency-guide.git
   2. node scripts/import_emergency_guides.js path/to/International-emergency-guide/exported_folder
- Or place markdown/JSON files under data/content/ and the admin UI will list them for manual import in the next release.

Secrets management
- Add production secrets to environment or vault; do NOT commit secrets in repo.
- Set JWT_SECRET, and if using hosted CouchDB set COUCH_* credentials in environment.

Production checklist (short)
- OIDC with MFA (hospital IdP)
- TLS/mTLS for API and CouchDB replication
- Hospital KMS/HSM for keys & backup encryption
- Immutable audit store & retention policies
- Penetration test & DPIA completed