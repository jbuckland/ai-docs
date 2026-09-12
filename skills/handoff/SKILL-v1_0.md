---
name: AI Context Handoff
description: Generates a self-executing context brief to seamlessly migrate an active session to a fresh AI agent, reducing token costs and hallucination drift.
version: 1.0
tags:
  - ai-skill
  - workflow
  - prompt
  - context-management
---

# Context Handoff

**Trigger:** `/handoff`

## Usage Instructions
When your current AI session's context window becomes too full, paste the prompt below. It will output a highly condensed markdown block. Copy that generated block and paste it as the very first prompt in a brand-new AI session.

---

## The Prompt

```text
/handoff

I need to migrate this session to a fresh AI agent to clear the context window. Please synthesize the critical context of our work so far into a comprehensive, highly condensed brief. 

Output the response inside a single, ````, Markdown code block so I can easily copy it in one click. 

Format it using the following structure. Do not add any conversational filler outside of the code block.

**[BEGIN FORMAT]**
Act as a continuation of my previous AI assistant. Read the context brief below, acknowledge you understand the current state, and immediately begin working on the items listed under "IMMEDIATE NEXT STEPS".

# CONTEXT HANDOFF BRIEF
**Project/Goal:** [1-2 sentences on what we are trying to achieve]
**Current Status:** [Where we are at this exact moment]

## CORE CONTEXT & RULES
* [Key constraints, preferences, or specific instructions we've established]
* [Important variables, tech stack details, or formatting rules]

## ACCOMPLISHED SO FAR
* [Bullet points of what has already been completed or decided]

## ACTIVE WORKING STATE
* [Relevant code snippets, text blocks, or data the next agent needs to see immediately]

## IMMEDIATE NEXT STEPS
* [1. Exactly what I need the next agent to start doing]
* [2. Any open questions or known bugs we were just tackling]
**[END FORMAT]**
```