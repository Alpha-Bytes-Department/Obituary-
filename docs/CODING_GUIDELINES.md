# CODING_GUIDELINES.md

## 1. Security & Environment Restrictions

### NEVER Modify `.env` Files

- Do not read `.env` files
- Do not modify `.env` files
- Do not generate real secret values
- Do not expose secrets in logs or responses

### Always Use `.env.example`

Use placeholder values only.

```env
DATABASE_URL=your_database_url_here
NEXT_PUBLIC_API_URL=your_api_url_here
STRIPE_SECRET_KEY=your_secret_here
```

### No Hardcoded Secrets

❌ Incorrect

```ts
const stripe = new Stripe("sk_live_secret");
```

✅ Correct

```ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

### Environment Variable Usage

```ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## 2. Standardized Function Documentation

Every function, hook, utility, service, controller, and handler MUST include a JSDoc block.

### Required Format

```ts
/**
 * Short description of what the function does.
 *
 * @param {Type} paramName - Description of the parameter.
 * @param {Type} [optionalParam] - Description of an optional parameter.
 * @returns {Type} Description of what is returned.
 * @throws {ErrorType} Description of when and why this error is thrown.
 */
```

### Example

```ts
/**
 * Fetches obituary details by ID.
 *
 * @param {string} obituaryId - Unique obituary identifier.
 * @returns {Promise<Obituary>} Returns obituary details.
 * @throws {Error} Throws when obituary is not found.
 */
async function getObituaryById(obituaryId: string) {
  return await repository.findById(obituaryId);
}
```

---

## 3. Component Structure & Architecture

### Folder-Based Component Organization

```plaintext
/src/components
  /public
    /home
      HomeContainer.tsx
      HeroSearch.tsx
      FeaturedGrid.tsx

    /obituary
      ObituaryListContainer.tsx
      ObituaryCard.tsx

    /obituary_detail
      ObituaryDetailContainer.tsx
      ImageSlider.tsx
      CondolenceSection.tsx

    /auth
      /login
      /register
      /forgot_password

  /protected
    /profile
      ProfileContainer.tsx
      StatusBadge.tsx

    /create_obituary
      CreateObituaryContainer.tsx
      MultiStepForm.tsx

  /admin
    /dashboard
      AdminDashboardContainer.tsx
      ObituaryTable.tsx
```

---

## 4. The "Page as a Wrapper" Pattern

### Rules

- `page.tsx` files must NOT contain business logic
- `page.tsx` files must NOT contain complex UI logic
- `page.tsx` files must NOT contain heavy state management
- Pages should only import and render a single container component

### Example Page

```ts
import ObituaryDetailContainer from '@/components/public/obituary_detail/ObituaryDetailContainer';

/**
 * Wrapper for the obituary detail page.
 *
 * @param {Object} props - The page props.
 * @param {Object} props.params - The dynamic URL parameters.
 * @returns {JSX.Element} The rendered container.
 */
export default function ObituaryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ObituaryDetailContainer obituaryId={params.id} />;
}
```

---

## 5. Container Responsibility Pattern

Containers are responsible for:

- Fetching data
- Managing state
- Handling business logic
- Orchestrating child components

### Example Container

```ts
import ImageSlider from './ImageSlider';
import CondolenceSection from './CondolenceSection';

interface ContainerProps {
  obituaryId: string;
}

/**
 * Orchestrates the obituary detail view.
 *
 * @param {ContainerProps} props - Component props.
 * @returns {JSX.Element} The composed UI.
 */
export default function ObituaryDetailContainer({
  obituaryId,
}: ContainerProps) {
  return (
    <main>
      <h1>Obituary {obituaryId}</h1>

      <ImageSlider />

      <CondolenceSection />
    </main>
  );
}
```

---

## 6. Naming Conventions

### Component Naming

Use PascalCase.

✅ Correct

```plaintext
UserProfile.tsx
CreateObituaryContainer.tsx
```

❌ Incorrect

```plaintext
userProfile.tsx
create_obituary.tsx
```

### Hook Naming

Hooks must start with `use`.

```ts
useAuth();
useObituaryData();
```

### Variable Naming

Use camelCase.

```ts
const obituaryList = [];
const userProfile = {};
```

### Constant Naming

Use UPPER_SNAKE_CASE.

```ts
const MAX_UPLOAD_SIZE = 5;
```

---

## 7. TypeScript Rules

### Avoid `any`

❌ Incorrect

```ts
const data: any = response;
```

✅ Correct

```ts
interface ApiResponse {
  id: string;
}

const data: ApiResponse = response;
```

### Define Explicit Interfaces

```ts
interface UserProps {
  name: string;
  email: string;
}
```

---

## 8. API & Backend Standards

### Validate Inputs

Always validate:

- Request body
- Query params
- Route params

Recommended Libraries:

- Zod
- Yup
- Valibot

### Error Handling

❌ Incorrect

```ts
return res.json(error);
```

✅ Correct

```ts
return res.status(500).json({
  message: 'Internal server error',
});
```

---

## 9. Styling Rules

### Prefer Tailwind Utility Classes

Use TailwindCSS utilities whenever possible.

### Avoid Inline Styles

❌ Incorrect

```tsx
<div style={{ color: 'red' }} />
```

✅ Correct

```tsx
<div className="text-red-500" />
```

---

## 10. Code Quality Rules

### Keep Components Small

Components should focus on a single responsibility.

### Avoid Deep Nesting

Use:

- Early returns
- Extracted helper functions

### Reusable Logic Goes Into Hooks

Shared logic should be extracted into custom hooks.

---

## 11. Import Order Convention

Import order must follow:

1. External packages
2. Internal aliases
3. Relative imports
4. Styles

### Example

```ts
import React from 'react';

import { Button } from '@/components/ui/button';

import Helper from './Helper';

import './styles.css';
```

---

## 12. Git & Commit Standards

### Conventional Commits

```plaintext
feat: add obituary search feature
fix: resolve login validation issue
refactor: simplify dashboard state management
docs: update coding guidelines
```

---

## 13. Performance Best Practices

### Lazy Load Heavy Components

Use dynamic imports for large modules.

### Avoid Unnecessary Re-renders

Use:

- memo
- useMemo
- useCallback

when appropriate.

---

## 14. Accessibility Standards

### Semantic HTML

```tsx
<main>
<section>
<button>
```

### Image Accessibility

All images must include meaningful `alt` text.

---

## 15. Final Rules

All contributors MUST:

- Follow folder structure strictly
- Use proper TypeScript typing
- Add JSDoc documentation
- Avoid hardcoded secrets
- Keep components modular
- Maintain clean architecture
- Write readable and maintainable code
- Prioritize security and scalability