---
title: Use a Data-Fetching Library with Built-In Deduplication
impact: MEDIUM-HIGH
impactDescription: automatic deduplication
tags: client, deduplication, data-fetching, caching
---

## Use a Data-Fetching Library with Built-In Deduplication

Libraries like SWR and TanStack Query provide automatic request deduplication, caching, and revalidation across component instances.

**Incorrect (no deduplication, each instance fetches):**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

**Correct with SWR (multiple instances share one request):**

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

**Correct with TanStack Query:**

```tsx
import { useQuery } from '@tanstack/react-query'

function UserList() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json())
  })
}
```

Both libraries automatically deduplicate concurrent requests for the same data, cache results, and handle revalidation. Choose based on your project's needs — SWR is lighter-weight, TanStack Query offers more control over cache invalidation and mutations.

Reference: [SWR](https://swr.vercel.app) | [TanStack Query](https://tanstack.com/query)
