````markdown name=docs/legal.md
```text
# Legal & Clinical Disclaimer, Consent, and DPIA Checklist

## Clinical disclaimer (draft)
This application is a research/clinical decision support prototype. It is not a substitute for professional clinical judgment. Clinical decisions must be made by licensed healthcare professionals who review patient data, verify system output, and document their rationale.

Do not rely solely on system suggestions for diagnosis or treatment. Always confirm medication dosing, allergies, drug interactions, and local formularies. Where the system suggests actions, the clinician must confirm and sign-off in the medical record.

## Patient consent (draft)
By using this application and providing health information, you consent to the collection, storage, and secure processing of your personal health data for the purposes of clinical care and quality improvement. Data will be stored locally on devices and may be synchronized to hospital servers. The hospital is the data controller. You have rights to access, correct, and request deletion as permitted by local law.

## DPIA checklist (high-level) — to be completed by project team
- [ ] Data flows mapped and documented (who has access, where data leaves hospital network)
- [ ] Legal basis for processing identified (clinical care, public health, research)
- [ ] Data minimization: only collect necessary fields
- [ ] Encryption at rest & in transit: TLS for transport, AES-256 for stored data
- [ ] Key management: hospital KMS/HSM usage confirmed
- [ ] Authentication & access control: OIDC with MFA, RBAC defined
- [ ] Audit logging: immutable logs; retention policy defined
- [ ] Data retention and deletion policy documented (e.g., retain audit logs for X years)
- [ ] Third-party services assessed and BAAs/contracts in place (if US/HIPAA)
- [ ] Vulnerability scanning & penetration testing scheduled
- [ ] Incident response plan & breach notification process defined
- [ ] Clinical safety validation: prospective validation and clinician sign-off workflow
- [ ] Regulatory review completed (SaMD risk assessment if CDS influences therapy)

## Notes for IT/Legal
- Recommend hosting backend inside hospital network or on vetted cloud under BAA.
- Keep sync endpoints accessible only inside hospital VPN/Subnet; use mTLS if possible.
- Retain logs and audit trails for required retention period (check local laws).
- If AI is added later, treat as decision support; log inputs/outputs and require human sign-off. If outputs influence treatment automatically, pursue SaMD guidance and regulatory pathways (FDA/IMDRF).
```