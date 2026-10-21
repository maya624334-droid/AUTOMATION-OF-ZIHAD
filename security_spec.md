# Security Specification — Zihad Autivex AI Automation Service

## 1. Data Invariants
- `siteSettings`: Anyone can read site settings (brand name, links, logos). Only verified administrators can update or write site settings.
- `portfolioProjects`: Anyone can read published projects (`isPublished == true`). Unauthenticated and regular users cannot read draft projects or write/update/delete any project. Only administrators can create, edit, or delete projects.
- `services`: Anyone can read published services. Only administrators can create, update, or delete services.
- `skills`: Anyone can read skills. Only administrators can manage skills.
- `aboutSections`: Anyone can read published about sections. Only administrators can manage them.
- `contactMessages`: Anyone (public visitors) can create a contact message with valid schema and length limits. No public user can list or read messages. Only administrators can read, list, update (change status), or delete contact messages.
- `users`: Authenticated users can only read and write their own user profile document (`users/{userId}` where `userId == request.auth.uid`). Users cannot modify administrative privileges.
- `userBookmarks`: Authenticated users can only read, create, and delete their own bookmarks (`userBookmarks/{bookmarkId}` where `resource.data.userId == request.auth.uid`).
- `admins`: Only administrators can read or modify administrator records. Initial bootstrap administrator is `zihadfree22@gmail.com`.

## 2. The "Dirty Dozen" Threat Vectors
1. Public user attempting to write or modify `siteSettings/main`. (Expected: PERMISSION_DENIED)
2. Non-admin authenticated user attempting to create or delete a `portfolioProject`. (Expected: PERMISSION_DENIED)
3. Attacker submitting a 10MB message into `contactMessages`. (Expected: PERMISSION_DENIED due to `.size()` limits)
4. Public user attempting to list or read `contactMessages`. (Expected: PERMISSION_DENIED)
5. Attacker attempting to read another user's profile at `users/{otherUserId}`. (Expected: PERMISSION_DENIED)
6. Attacker attempting to write to `admins/{attackerUid}` to elevate privileges. (Expected: PERMISSION_DENIED)
7. Attacker attempting to modify another user's bookmark at `userBookmarks/{id}`. (Expected: PERMISSION_DENIED)
8. User attempting to forge creation of a project with malicious fields. (Expected: PERMISSION_DENIED)
9. Non-admin attempting to delete a service. (Expected: PERMISSION_DENIED)
10. Attacker sending malformed ID with path traversal or script tags. (Expected: PERMISSION_DENIED via `isValidId()`)
11. Public user attempting to list draft portfolio projects without admin rights. (Expected: PERMISSION_DENIED)
12. Attacker attempting to alter `createdAt` immutable timestamp. (Expected: PERMISSION_DENIED)
