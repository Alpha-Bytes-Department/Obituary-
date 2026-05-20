# Coding Standards & Restrictions

This document outlines the strict coding guidelines, security restrictions, and documentation standards for the Memorials & Obituaries Platform. **All developers and AI assistants must adhere to these rules without exception.**

## 1. Security & Environment Restrictions
* **NEVER Modify `.env` Files:** Do not read, modify, or generate contents for `.env`, `.env.local`, or any file containing real secrets.
* **Use Environment Examples:** If a new environment variable is required for a feature (e.g., Stripe keys, MongoDB URI), add it to `.env.example` with a placeholder value (e.g., `STRIPE_SECRET_KEY=your_stripe_secret_here`).
* **No Hardcoded Secrets:** Never hardcode API keys, database URIs, or JWT secrets in the source code. Always use `process.env.VARIABLE_NAME`.

## 2. Standardized Function Documentation
Every function, hook, and API controller across the entire frontend and backend MUST include a standardized comment block before its declaration. This ensures the codebase remains readable and self-documenting.

**Required JSDoc Format:**
```javascript
/**
 * Short description of what the function does.
 *
 * @param {Type} paramName - Description of the parameter.
 * @param {Type} [optionalParam] - Description of an optional parameter.
 * @returns {Type} Description of what is returned.
 * @throws {ErrorType} Description of when and why this error is thrown.
 */
 ```