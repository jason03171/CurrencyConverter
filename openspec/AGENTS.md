# OpenSpec Workflow Guide for AI Agents

## What is OpenSpec?

OpenSpec is a spec-driven development workflow that enables AI agents to propose, review, and implement changes in a structured way. Instead of ad-hoc development, every change follows a consistent pattern: **proposal → discussion → implementation**.

## The OpenSpec Workflow

### 1. **Change Proposal Phase**
When you want to add a feature or make a change:
- Create a proposal document in `openspec/specs/` with:
  - Clear problem statement
  - Proposed solution
  - Implementation details
  - Tasks breakdown (for AI to execute)
  - Non-goals (what we're NOT doing)

### 2. **Review & Discussion Phase**
- You review the proposal
- Provide feedback or approval
- AI can iterate on the proposal if needed

### 3. **Implementation Phase**
- Once approved, I create tasks in `openspec/changes/`
- Each task gets its own markdown file with:
  - Clear objectives
  - File changes needed
  - Verification steps
- I execute the tasks and track progress

### 4. **Archival Phase**
- Completed changes are moved to `openspec/changes/archive/`
- This keeps the workflow clean and maintains history

## Directory Structure

```
openspec/
├── config.yaml              # Project context & rules
├── project.md               # Project documentation (THIS FILE)
├── AGENTS.md                # This file - workflow guide
├── specs/                   # Where proposals live
│   └── [feature-name].md    # Proposal for a feature
├── changes/                 # Active tasks
│   ├── archive/             # Completed tasks
│   └── [task-name].md       # Implementation task
└── README.md                # Additional docs
```

## How to Work with Me

### To Create a Change Proposal:
1. Tell me: "I want to add [FEATURE]"
2. I'll create a proposal in `openspec/specs/` that includes:
   - What problem it solves
   - How we'll implement it
   - Step-by-step tasks for me to execute
3. You review and approve (or request changes)
4. I move to implementation

### To Track Progress:
- Check `openspec/changes/` for active tasks
- Check `openspec/changes/archive/` for completed work
- Each file shows what was changed and why

### Best Practices
- **Be specific:** "Add dark mode toggle" is better than "improve UI"
- **Discuss trade-offs:** Does it align with the project goals?
- **Keep proposals focused:** One feature per proposal
- **Link context:** Reference existing code or design docs

## Example Workflow

1. **You:** "I want to add live API integration for exchange rates"
2. **Me:** Create `openspec/specs/live-exchange-rates.md` with proposal
3. **You:** Review and approve
4. **Me:** Create `openspec/changes/live-exchange-rates-task-1.md`, execute changes
5. **You:** Verify implementation
6. **Me:** Move task to archive when complete

## Configuration

Your project context is stored in `openspec/config.yaml`. I use this to understand:
- Your tech stack (Vue 3, Vite, Axios)
- Code conventions (camelCase, `<script setup>`)
- Domain knowledge (currency conversion)
- Custom rules for how to structure proposals and tasks

## Questions?

This workflow keeps development:
- **Transparent:** You always know what's being proposed
- **Reversible:** Easy to see what changed and why
- **Collaborative:** Each change is a discussion point
- **Organized:** Clear history of decisions

Ready to create your first change proposal!
