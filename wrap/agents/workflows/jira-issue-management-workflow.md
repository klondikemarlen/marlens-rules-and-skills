---
description: Create, enhance, and manage well-structured Jira issues using project conventions
auto_execution_mode: 1
---

# Jira Issue Management Workflow

## Intent

**WHY this workflow exists:** Creating and managing effective Jira issues requires consistent structure, clear problem descriptions, and actionable requirements. Poorly written issues lead to confusion, scope creep, and implementation delays, while proper enhancement patterns ensure issues remain valuable throughout their lifecycle.

**WHAT this workflow produces:** Well-structured Jira issues that include:

- Clear problem descriptions or feature requests
- Specific reproduction steps or requirements
- Proper issue labeling and assignment
- Screenshots/mockups when relevant
- Enhanced descriptions with visual evidence and external source links
- Proper dependency relationships between issues

**Decision Rules:**

- **Use Jira Web UI:** Create issues directly in WRAPX project at https://yg-hpw.atlassian.net/jira/core/projects/WRAPX/board
- **Prefer Atlassian MCP for automated Jira work:** When searching, creating, or updating Jira content from an agent, try the Atlassian MCP tools first
- **Check the specific MCP tool needed:** Rovo search can fail while Jira-specific MCP tools still work; for issue lookup, verify with `searchJiraIssuesUsingJql` before falling back to REST
- **Do not infer from failed Jira access:** If a user provides a Jira ticket and it cannot be read
  through the first lookup path, try the Jira-specific MCP or REST fallback before writing plans,
  tickets, or implementation notes. If all lookup paths are blocked, stop and ask the user for the
  ticket details instead of guessing from screenshots or nearby context.
- **Use environment variables for Jira REST fallback:** When MCP is unavailable or blocked, use `JIRA_BASE_URL`, `JIRA_EMAIL`, and `JIRA_API_TOKEN`
- **Treat MCP and Jira REST separately:** If Atlassian MCP/Rovo returns `403`, `The app is not installed on this instance`, or similar app-install errors, do not assume Jira credentials are broken
- **Use direct Jira REST as the fallback path:** When MCP access fails, use `curl` with Jira environment variables for issue search/create/update instead of blocking on the MCP integration
- **Verify credentials with a minimal read-only request first:** Before relying on REST fallback, confirm auth with `/rest/api/3/myself` or a tightly scoped JQL search
- **Action-Oriented Titles:** Use imperative verbs that describe the outcome — drop `Bug:`, `Fix:`, `Feature:`, `Enhancement:`, `Refactor:` type prefixes. Examples: "Fix Silent Publish Failure While Persisting Workflow Slug" not "Bug: Publish Fails Silently..." — see examples below.
- **Title Case Formatting:** Use title case for Jira ticket titles — capitalize major words, keep minor words (articles, prepositions, conjunctions) lowercase
- **Bug Reports:** Use "Bug" issue type for defects and problems
- **Feature Requests:** Use "User Story" issue type for new functionality (validate with getJiraProjectIssueTypesMetadata first)
- **Improvements/Refactoring:** Use "Task" issue type
- **Large Features:** Use "Epic" issue type with multiple child issues
- **Labels:** Always include appropriate labels for type, priority, and component
- **User Reports:** Integrate into main description when primary context; add as separate comment for supplemental information
- **Visual Evidence:** Embed screenshots directly in descriptions when available for immediate context
- **External Sources:** Create remote links with proper global IDs (MD5 hash pattern) for external references
- **Dependencies:** Use proper issue linking ("causes"/"is caused by") to establish technical relationships
- **PR Comment References:** When a bug report references a PR comment, always fetch the actual comment using `gh api` to get precise technical details and include the comment URL as a source link
- **MCP Tool Validation:** Always validate available options before using MCP tools (e.g., check issue types with getJiraProjectIssueTypesMetadata before creating)
- **Complete workflow sequence:** This is step 1 of 4 in the complete PR creation process. Always use before code-review, pull-request-management, and testing-instructions workflows to ensure proper issue structure and requirements gathering.

## Reference Files

- WRAPX Jira Board: https://yg-hpw.atlassian.net/jira/core/projects/WRAPX/board
- Atlassian MCP tools for preferred automated Jira access
- Jira API environment variables: `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`
- Jira Issue Types: Bug, User Story, Task, Epic (validate with getJiraProjectIssueTypesMetadata)
- WRAP Project Labels and Components

---

## Step 1: Choose Issue Type

**For Bugs/Defects:** Use "Bug" issue type
**For New Features:** Use "User Story" issue type (validate with getJiraProjectIssueTypesMetadata first)
**For Improvements/Refactoring:** Use "Task" issue type
**For Large Features:** Use "Epic" issue type with multiple child issues

---

## Step 2: Fill Out Issue Fields

**Bug Issue Fields:**

- **Summary:** Clear, concise description of the problem — use an imperative verb leading the title without a type prefix (e.g., "Fix" not "Bug:", "Add" not "Feature:")
- **Description:** Detailed problem explanation with reproduction steps using bold section headers (not heading nodes)
- **Priority:** Set appropriate priority level
- **Labels:** Add relevant labels (bug, easy-win, etc.)
- **Components:** Assign to relevant component if applicable

**Story/Task Issue Fields:**

- **Summary:** Clear description of feature or improvement
- **Description:** Problem context and solution requirements
- **Priority:** Set appropriate priority level
- **Labels:** Add relevant labels (enhancement, refactor, etc.)
- **Components:** Assign to relevant component if applicable

---

## Step 3: Write Effective Context

**Enhanced Description Patterns:**

- **Visual Evidence Integration**: Embed screenshots directly in descriptions when available - they provide immediate context that text alone cannot convey
- **Precise Reproduction Steps**: Include specific trigger conditions rather than generic instructions. Example: "Complete at least one step" instead of just "Attempt to re-order"
- **Impact Conciseness**: Use single, powerful statements that capture the essence of the business impact. Example: "Workflow reorder of any kind is now impossible once any step has been completed"
- **External Source Linking**: Create remote links with proper global IDs (using MD5 hash pattern) for external references like Hiver conversations
- **Dependency Relationships**: Use proper issue linking ("causes"/"is caused by") to establish clear technical relationships between tickets
- **Description Integration**: Move user reports into the main description rather than separate comments when they're the primary context
- **Clean Structure**: Remove redundant comments when the information is properly integrated into the main description
- **Factual Accuracy**: Differentiate clearly between definite facts (user quotes, confirmed behaviors) and probable hypotheses (potential causes). Never guess or invent technical details
- **Actionable Investigation**: Provide specific file names, service names, and concrete technical steps rather than general possibilities. Example: "Check if `re-order-steps/create-service.ts` properly updates workflow step player assignments"
- **Focused Root Causes**: Prioritize the most probable causes (2-3 focused hypotheses) rather than exhaustive possibilities, but always label them as "possible" or "potential"
- **Implementation Hints**: Include specific technical solutions like cache invalidation, table "touch" operations, and service updates
- **Bold Section Headers**: Use bold text (`strong` marks in ADF) for section headers, not heading nodes. This is the established pattern across all high-quality WRAPX tickets.
- **Section Ordering**: Standard order for bugs is **Describe the bug** → **To Reproduce** → **Expected behavior** → **Additional context**. Insert optional sections like **Root cause**, **Technical Details**, or **Proposed Solution** after Expected behavior and before Additional context.
- **Code Reference Style**: Use inline `code` marks (not backtick-wrapped plain text) for file paths, service names, API endpoints, model names, and variable names. This matches the ADF formatting pattern used consistently throughout existing tickets.
- **Concise Cause-Effect Pattern**: Follow "When X happens, Y breaks because of Z" structure for bug descriptions. Keep to a single paragraph per section rather than spreading across multiple paragraphs.

**For Bug Reports:**

- Use **bold** section headers (`strong` marks in ADF) — NOT heading nodes. This is the consistent pattern across all high-quality tickets.
- Standard section order: **Describe the bug** → **To Reproduce** → **Expected behavior** → **Additional context**
- Optional sections (after Additional context when needed): **Root cause**, **Technical Details**, **Production Impact**, **Proposed Solution**, **Environment**
- Bold section header text should be on the same paragraph line as its content, separated by `\n`. Avoid splitting a section across two paragraphs.
- Follow "When X happens, Y breaks because of Z" cause-effect pattern for bug descriptions.
- Use `code` marks for file paths, service names, API endpoints, model names, and variable names.
- Include steps as `orderedList` with "Steps to reproduce the behavior:" preamble.
- Keep Additional context as a `bulletList` — 2-4 concise items.
- Use `codeBlock` with `language` attribute for code snippets.
- Include links to GitHub diffs or related commits in an "Affected version" block when relevant.
- Use `link` marks for GitHub URLs, related ticket URLs, and external references.

**For Feature Requests:**

- Use simple structure: Context → User Report → Proposed Solution(s)
- Keep descriptions concise and focused
- Use numbered options for different approaches
- Reference related tickets where applicable
- Use Jira heading blocks for story/task sections, matching recent WRAPX tickets created by Marlen
- Put direct user quotes in blockquote blocks under **User Report** or **User Reports**
- Use **Proposed Solution** for one clear path and **Proposed Solutions** with option headings only when there are meaningful alternatives
- Do not add acceptance criteria, implementation notes, or constraints unless the user provided them or the ticket genuinely needs them

---

## Step 4: Add Labels and Assignment

**WRAPX Project Labels:**

- `bug` - Something isn't working
- `enhancement` - Adds or modifies features to improve functionality or user experience
- `refactor` - Improves code's internal structure without changing its behavior
- `documentation` - Improvements or additions to documentation
- `easy-win` - Quick fixes that provide significant user value

**Priority Levels:**

- **Highest** - Critical issues blocking production
- **High** - Important issues affecting core functionality
- **Medium** - Standard priority for most issues
- **Low** - Minor issues or nice-to-have improvements
- **Lowest** - Cosmetic issues or very low impact

**Assignment:**

- Assign to appropriate team member based on expertise
- If unsure, leave unassigned for team lead to assign

---

## Complete Examples

### Bug Report Example

**Title:** `Fix PubSub Broadcasts Intermediate Transaction State during Workflow Publish`

**Labels:** `bug`

**Body:**

```
**Describe the bug**
When PublishService.perform() runs inside a db.transaction(), BaseModel.publishUpdate fires on every update() call including mid-transaction intermediate states. generateAndSaveSlug() triggers a WORKFLOWS_UPDATE broadcast while the workflow status is still DRAFT, and the status update to OPEN triggers another. WorkflowsChannel.listener does a reload that receives these intermediate states and broadcasts them to connected socket clients before the transaction commits.

**To Reproduce**
Steps to reproduce the behavior:
1. Publish a draft workflow with a slug sequence configured
2. generateAndSaveSlug() triggers WORKFLOWS_UPDATE with status DRAFT + slug already set
3. Status update to OPEN triggers another WORKFLOWS_UPDATE
4. Any WorkflowsChannel subscriber receives the intermediate { status: 'draft', slug: '...' } state before the transaction commits

**Expected behavior**
PubSub events should only broadcast the final committed state. Intermediate transaction states should not leak to socket clients.

**Additional context**
- A test confirms two WORKFLOWS_UPDATE publishes fire during publish: first with status DRAFT + slug set, then with status OPEN + slug set
- May be related to the draft dashboard query returning draft workflows with slugs set
- Proposed fix: switch to an outbox pattern for PubSub, similar to the mailer setup
```

### Feature Request Example

**Title:** `Add Position Search Improvements`

**Labels:** `enhancement`

**Body:**

```
# Context

Users frequently create new WRAPs without using templates and need to assign Positions to Workflow Steps. Currently, users must type out the full Position title (e.g., "Assistant Deputy Minister") every time they want to assign a Position to a Step. This is time-consuming, prone to typos, and creates friction in the workflow creation process.

## User Report

> Is there a way to add short form titles or nicknames to positions so we don't have to type out the full position name every time?

## Proposed Solutions

### Option 1

Add search feature that priortizes search term by start of word matches.
i.e. a d m would find "Assistant Deputy Minister"

### Option 2

Add optional "Acronym" field to Position model with enhanced search that prioritizes exact acronym matches.

### Option 3

Implement position favorites or recently used list for quick access.

### Option 4

Add better search see https://yg-hpw.atlassian.net/browse/WRAPX-50
```

### Refactoring Example

**Title:** `Standardize Delegation Overlap Detection Logic`

**Labels:** `refactor`

**Body:**

```
# Context

Current overlap detection logic is inconsistent between model validators and SQL queries, leading to potential data integrity issues.

## User Report

> We're seeing delegation validation inconsistencies in production.

## Proposed Solutions

### Option 1

Standardize overlap detection using symmetric definition and strict < for adjacent ranges.

### Option 2

Keep current inconsistent logic with manual oversight.

### Option 3

Implement database triggers for validation.
```

---

## Step 5: Create the Issue

### Option 1: Create via Jira Web UI

1. Go to https://yg-hpw.atlassian.net/jira/core/projects/WRAPX/board
2. Click **Create** in the top navigation
3. Select appropriate issue type (Bug, Story, Task, Epic)
4. Fill in Summary and Description fields following the examples above
5. Set Priority and add relevant Labels
6. Assign to appropriate team member if known
7. Click **Create**

### Option 2: Create via Atlassian MCP

Use Atlassian MCP for automated issue reads and writes when the needed tool is available in the
current session.

Start with a small read before creating or updating:

```bash
# Search for a specific issue with JQL
mcp__atlassian__.searchJiraIssuesUsingJql
  cloudId: "https://yg-hpw.atlassian.net"
  jql: "key = WRAPX-XXX"
  maxResults: 1
  fields: ["key", "summary"]
```

If the Jira-specific MCP call succeeds, continue with the relevant Atlassian MCP tool for the
operation. If the needed MCP tool is unavailable, or the Jira-specific MCP call returns a permission
or app-install error, switch to the Jira REST fallback below.

### Option 3: Create via Jira REST API

**REST Fallback Setup:**

```bash
export JIRA_BASE_URL="https://yg-hpw.atlassian.net"
export JIRA_EMAIL="your-email@example.com"
export JIRA_API_TOKEN="your-jira-api-token"

curl -sS -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_BASE_URL/rest/api/3/myself"
```

**Scoped Search Example:**

```bash
curl -sS -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_BASE_URL/rest/api/3/search/jql?jql=assignee%3DcurrentUser()%20order%20by%20updated%20desc&maxResults=1&fields=key,summary"
```

Use the scoped search pattern above when sanity-checking access. Avoid unbounded JQL like
`order by updated desc`, which Jira may reject.

**For Bug Reports:**

Use separate ADF paragraph/list blocks for each section — not a single mega-paragraph:

```bash
curl -X POST "$JIRA_BASE_URL/rest/api/3/issue" \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": { "key": "WRAPX" },
      "issuetype": { "name": "Bug" },
      "summary": "Fix [Title Case Description]",
      "description": {
        "type": "doc",
        "version": 1,
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "text": "Describe the bug", "marks": [{ "type": "strong" }] },
              { "type": "text", "text": "\n[Clear description following cause-effect pattern. Use " },
              { "type": "text", "text": "code", "marks": [{ "type": "code" }] },
              { "type": "text", "text": " marks for file paths, service names, and variable references.]" }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "text": "To Reproduce", "marks": [{ "type": "strong" }] },
              { "type": "text", "text": "\nSteps to reproduce the behavior:" }
            ]
          },
          {
            "type": "orderedList",
            "attrs": { "order": 1 },
            "content": [
              {
                "type": "listItem",
                "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "[Step 1]" }] }]
              },
              {
                "type": "listItem",
                "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "[Step 2]" }] }]
              },
              {
                "type": "listItem",
                "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "[Step 3]" }] }]
              }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "text": "Expected behavior", "marks": [{ "type": "strong" }] },
              { "type": "text", "text": "\n[What should happen]" }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "text": "Additional context", "marks": [{ "type": "strong" }] }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "[Item 1]" }] }]
              },
              {
                "type": "listItem",
                "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "[Item 2]" }] }]
              }
            ]
          }
        ]
      },
      "priority": { "name": "Medium" },
      "labels": ["bug"]
    }
  }'
```

**For Feature Requests:**

```bash
curl -X POST "$JIRA_BASE_URL/rest/api/3/issue" \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": { "key": "WRAPX" },
      "issuetype": { "name": "Story" },
      "summary": "Add [Brief Description]",
      "description": {
        "type": "doc",
        "version": 1,
        "content": [{
          "type": "paragraph",
          "content": [{
            "type": "text",
            "text": "Relates to:\n- [Related issues or documentation]\n\n# Context\n\n**Is your feature request related to a problem? Please describe.**\n[Problem description]\n\n**Describe the solution you'd like**\n[Clear solution description]\n\n**Describe alternatives you've considered**\n[Alternative approaches]\n\n**Additional context**\n[Extra details, examples, or context]"
          }]
        }]
      },
      "priority": { "name": "Medium" },
      "labels": ["enhancement"]
    }
  }'
```

**For Refactoring:**

```bash
curl -X POST "$JIRA_BASE_URL/rest/api/3/issue" \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": { "key": "WRAPX" },
      "issuetype": { "name": "Task" },
      "summary": "[Verb] [Brief Description]",
      "description": {
        "type": "doc",
        "version": 1,
        "content": [{
          "type": "paragraph",
          "content": [{
            "type": "text",
            "text": "Relates to:\n- [Related issues or documentation]\n\n# Context\n\n**Is your feature request related to a problem? Please describe.**\n[Problem description]\n\n**Describe the solution you'd like**\n[Clear solution description]\n\n**Describe alternatives you've considered**\n[Alternative approaches]\n\n**Additional context**\n[Extra details, examples, or context]"
          }]
        }]
      },
      "priority": { "name": "Medium" },
      "labels": ["refactor"]
    }
  }'
  --field 'title=[Verb] [Brief Description]' \
  --field 'body=Relates to:
- [Related issues or documentation]

# Context

**Is your feature request related to a problem? Please describe.**
[Problem description]

**Describe the solution you'"'"'d like**
[Clear solution description]

**Describe alternatives you'"'"'ve considered**
[Alternative approaches]

**Additional context**
[Extra details, examples, or context]' \
  --field 'labels[]=refactor'
```

**Important Notes for CLI:**

- Export `JIRA_BASE_URL`, `JIRA_EMAIL`, and `JIRA_API_TOKEN` before Jira REST calls
- `curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN"` is simpler and less error-prone than hand-building the `Authorization` header
- If Atlassian MCP says `The app is not installed on this instance`, continue with Jira REST if the environment-variable credential check succeeds
- Use `--field 'labels[]=label1' --field 'labels[]=label2'` for multiple labels
- Escape single quotes in body with `'"'"'` (e.g., `you'"'"'d`)
- Use line breaks with `\n` for multi-line content
- Issue URL will be returned in the response

---

## Quality Checklist

**For Bug Reports:**

- [ ] Bug description is clear and concise — follows "When X happens, Y breaks because of Z" pattern
- [ ] Reproduction steps are numbered and specific
- [ ] Expected vs actual behavior is clearly stated
- [ ] Section headers use **bold** (`strong` marks in ADF), not heading nodes
- [ ] Sections in standard order: Describe the bug → To Reproduce → Expected behavior → Additional context
- [ ] Body uses separate ADF blocks per section (not one mega-paragraph)
- [ ] Code references use `code` marks for file paths, service names, model names
- [ ] Screenshots included when applicable
- [ ] Browser/OS version information provided
- [ ] Error messages included verbatim
- [ ] Recent changes mentioned if relevant

**For Feature Requests:**

- [ ] Uses simple structure: Context → User Report → Proposed Solutions
- [ ] User report included as direct quote
- [ ] Problem context is clearly explained
- [ ] Multiple solution options provided when applicable
- [ ] Related tickets referenced where applicable
- [ ] Title uses action-oriented imperative verb (e.g., "Add", "Permit", "Allow") without a type prefix

**General:**

- [ ] Appropriate labels assigned (type, priority, component)
- [ ] Related issues or documentation linked
- [ ] Title is descriptive and follows project conventions
- [ ] Title uses proper title case formatting
- [ ] Section headers use **bold** (`strong` marks), not heading nodes
- [ ] Sections follow the standard ordering pattern
- [ ] Code references use `code` marks (file paths, services, APIs, models)
- [ ] Body uses separate ADF blocks per section (not one mega-paragraph)
- [ ] Issue is assigned to appropriate team member if applicable

---

## WRAP-Specific Considerations

### User Reports Integration

For issues reported by users (via Hiver, email, etc.):

1. **Primary Context**: Integrate user reports into main description when they're the primary context for the issue
2. **Supplemental Information**: Add as separate comment with web link when providing additional context
3. **Remote Links**: Create remote links with proper global IDs (MD5 hash pattern) for external references
4. **Format**: Use clear "User Report" section with reporter's email and original description
5. **Visual Evidence**: Include screenshots directly in description when available

**Remote Link Creation Pattern:**

```bash
# Generate MD5 hash global ID
GLOBAL_ID=$(echo -n "https://external-system.com/conversation/unique-id" | md5sum | cut -c1-8)

# Create remote link
curl -X POST "${JIRA_BASE_URL}/rest/api/3/issue/{issueKey}/remotelink" \
  -H "Content-Type: application/json" \
  -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  -d "{
    \"globalId\": \"${GLOBAL_ID}\",
    \"object\": {
      \"url\": \"https://external-system.com/conversation/unique-id\",
      \"title\": \"User Report - UserName <user@example.com>\"
    }
  }"
```

### Issue Linking Patterns

**Dependency Relationships:**

- Use "causes"/"is caused by" for technical dependencies
- Use "relates to" for related but independent issues
- Link to parent/child issues for hierarchical relationships

**Example:**

- WRAPX-333 (reordering bug) is "caused by" WRAPX-331 (duplicate step orders fix)

### Jira Integration

For issues that will be tracked in Jira:

1. Create GitHub issue first with full details
2. Reference GitHub issue URL in Jira ticket creation
3. Add Jira ticket ID to GitHub issue title: `WRAPX-310: Description`
4. Link between systems using remote links in Jira

### Common WRAP Context Patterns

**Dashboard Issues:**

- Include specific dashboard names (Waiting on Me, All Workflows, etc.)
- Reference user roles and permissions
- Include workflow IDs and step numbers when relevant

**Workflow Issues:**

- Include workflow template names
- Reference specific step titles and player assignments
- Include delegation and access control context

**Performance Issues:**

- Include browser and environment details
- Reference specific data volumes (number of workflows, users, etc.)
- Include timing information when available

---

## Automation and Batch Operations

### MCP Tool Integration

Prefer Atlassian MCP tools for automated Jira work. Use the Jira-specific tools first when working
with issues, even if broad Rovo search is failing.

```bash
# Search for existing issues with JQL
mcp__atlassian__.searchJiraIssuesUsingJql
  cloudId: "https://yg-hpw.atlassian.net"
  jql: "project = WRAPX AND text ~ 'search terms'"
  maxResults: 10
  fields: ["key", "summary", "status"]
```

If the needed MCP operation is not exposed in the current session, use the Jira REST fallback above
with `JIRA_BASE_URL`, `JIRA_EMAIL`, and `JIRA_API_TOKEN`.

### Batch Operations

When creating multiple related tickets:

1. **Search First:** Always search for existing related issues
2. **Create in Sequence:** Create tickets one by one to avoid conflicts
3. **Update with Details:** After creation, update with full implementation details

### Template Library

Build templates for common ticket types:

- Database schema changes
- API endpoint additions
- UI component updates
- Security enhancements
- Performance improvements

## Related Workflows

- [`./pull-request-management-workflow.md`](./pull-request-management-workflow.md) - Create and update pull requests with comprehensive testing instructions
- [`./testing-instructions-workflow.md`](./testing-instructions-workflow.md) - Generate comprehensive testing instructions for pull requests
- [`./jira-issue-management-workflow.md`](./jira-issue-management-workflow.md) - Creating, enhancing, and managing Jira issues

---

**Last Updated:** 2026-05-27

_Update this workflow when you discover better patterns or WRAP project conventions evolve._
